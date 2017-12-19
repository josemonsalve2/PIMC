from API_operaciones.mysql_connection import app
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
import MySQLdb
from flask import jsonify


def insertarNuevoElemento(elementoRelacional, parametrosJSON):
  cur = mysql.cursor()
  if (not pimcBD.tablaExiste(elementoRelacional)):
    raise ValueError("elementoRelacional No Existe")
    return None
  if (not isinstance(parametrosJSON, dict)):
    raise ValueError("parametrosJSON no es dictionario")
    return None
  if (parametrosJSON == {}):
    raise ValueError("parametrosJSON vacios")
    return None
  
  # Inicializamos la consulta
  querry = '''INSERT INTO ''' + str(elementoRelacional) + '''('''
  camposBD = pimcBD.obtenerCamposTabla(elementoRelacional)
  
  # Revisamos que algo se haya insertado
  insertado = False
  
  # Llenamos los campos
  for campo in camposBD:
    if campo in parametrosJSON:
      querry = querry + str(campo)+ ", "
  
  # Para los valores
  querry = querry[:-2] + ") VALUES("
  
  for campo in camposBD:
    if campo in parametrosJSON:
      insertado = True
      if isinstance(parametrosJSON[campo], str):
        querry = querry + '"' + parametrosJSON[campo] + '"' + ', '
      else:
        querry = querry + str(parametrosJSON[campo]) + ', '
  
  # borramos la ultima coma
  querry = querry[:-2] + ')'
        
  if insertado:
    try:
      #Enviamos consulta
      numAffectedRows = cur.execute(querry)
      mysql.commit()
      if numAffectedRows == 0:
        raise ValueError("Algo salio mal")
        return None
      
      #Obtanemos el elemento insertado
      querry = "SELECT LAST_INSERT_ID()"
      idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
      
      if idElementoRelacional != None:
        cur.execute(querry)
        rv = cur.fetchall()
        if (len(rv) != 0):
          for row in rv:
            nuevoID = row[0]
          querry = "SELECT * FROM " + str(elementoRelacional) + " WHERE " + str(idElementoRelacional) + " = " + str(nuevoID)
          cur.execute(querry)
          rv = cur.fetchall()
          columns = cur.description
          result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
          return jsonify(result)
        else:
          raise ValueError("Error obteniendo LAST_INSERTED_ID")
          return None
      else: 
        raise ValueError("Error idElementoRelacional No existe")
    except (MySQLdb.Error, MySQLdb.Warning) as e:
      raise ValueError("MYSQL ERROR = ", str(e))
      return None
  else:
    raise ValueError("No se enviaron elementos")
    return None
