from sys import stderr
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.mysql_connection import app
import MySQLdb

def print_err(*args, **kwargs):
    print(*args, file=stderr, **kwargs)

class bd_descripcion:
  """ Esta clase tiene metodos para revisar 
  que los datos requeridos si existan """
  tablas = []
  descripcionTablas = {}
  idPorTabla = {}
  
  """ Constructor"""
  def __init__(self):
    db_cursor = mysql.cursor()
    # Obtenemos todos los nombres de las tablas
    querry = "SHOW TABLES"
    db_cursor.execute(querry)
    tablasDB = db_cursor.fetchall()
    # Por cada tabla
    for tabla in tablasDB:
      self.insertarTabla(tabla[0])
      # Obtenemos la llave primaria
      querry = "SELECT k.column_name \
                FROM information_schema.table_constraints t \
                JOIN information_schema.key_column_usage k \
                USING(constraint_name,table_schema,table_name) \
                WHERE t.constraint_type='PRIMARY KEY' \
                AND t.table_schema=%s \
                AND t.table_name=%s"
      db_cursor.execute(querry, (app.config['MYSQL_DB'], tabla[0],))
      llave = db_cursor.fetchone()
      self.insertarIdPrincipalTabla(tabla[0], llave[0])
      # Obtenemos los nombres de las columnas 
      querry = "SELECT `COLUMN_NAME`\
                FROM `INFORMATION_SCHEMA`.`COLUMNS`\
                WHERE `TABLE_SCHEMA`=%s\
                AND `TABLE_NAME`=%s"
      db_cursor.execute(querry, (app.config['MYSQL_DB'], tabla[0]))
      columnas = db_cursor.fetchall()
      for columna in columnas:
        self.insertarDescripcion(tabla[0], columna[0])
  
  """ Permite insertar el nombre de una tabla"""
  def insertarTabla(self, nuevasTablas):
    if isinstance(nuevasTablas,list):
      self.tablas.extend(nuevasTablas)
    elif isinstance(nuevasTablas, str):
      self.tablas.append(nuevasTablas)
    else:
      print_err("ERROR parametro nuevasTablas invalido")
    
  
  """ Permite insertar los campos de una tabla"""
  def insertarDescripcion(self, nombreBD, elemento):
    if nombreBD in self.tablas:
      if isinstance(elemento, str):
        if nombreBD not in self.descripcionTablas:
          self.descripcionTablas[nombreBD] = [] 
        self.descripcionTablas[nombreBD].append(elemento)
      else:
        print_err("ERROR parametro elemento es invalido")
    else:
      print_err("ERROR La tabla no existe")
      
      
  
  """ Permite insertar la llave primaria de una talba"""
  def insertarIdPrincipalTabla(self, nombreTabla, nombreID):
    if nombreTabla in self.tablas:
      if isinstance(nombreID, str):
        self.idPorTabla[nombreTabla] = nombreID
      else:
        print_err("ERROR parametro nombrID invalido")
    else:
      print_err("ERROR La tabla no existe")
        
  
  """ Permite obtener todos los campos de la tabla"""
  def obtenerCamposTabla(self, tablaNombre):
    if tablaNombre in self.tablas:
      return self.descripcionTablas[tablaNombre]
    else:
      print_err("ERROR La tabla no existe")
      return None
  
  
  """ Permite revisar si una tabla existe"""
  def tablaExiste(self, tablaNombre):
    if isinstance(tablaNombre, str):
      if tablaNombre in self.tablas:
        return True
      else:
        return False
    else:
      print_err("ERROR, tabla nombre no es un string")
      return None
  
  """ Permite revisar si una tabla cuenta con el campoNombre"""
  def campoExisteEnTabla(self, tablaNombre, campoNombre):
    if tablaNombre in self.tablas:
      if campoNombre in self.descripcionTablas[tablaNombre]:
        return True
      else:
        return False
    else:
      return False
  
  """ Permite obtener el ID de una tabla"""
  def obtenerTablaId(self, tablaNombre):
    if tablaNombre in self.tablas:
      if tablaNombre in self.idPorTabla:
        return self.idPorTabla[tablaNombre]
      else:
        print_err("ERROR La tabla no existe en idPorTabla")
        return None
    else:
      print_err("ERROR La tabla no existe")
      return None

pimcBD = bd_descripcion()
