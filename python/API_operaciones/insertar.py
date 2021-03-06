from API_operaciones.mysql_connection import app
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
import MySQLdb


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
  query = '''INSERT INTO ''' + str(elementoRelacional) + '''('''
  camposBD = pimcBD.obtenerCamposTabla(elementoRelacional)
  
  # Revisamos que algo se haya insertado
  insertado = False
  
  # Llenamos los campos
  for campo in camposBD:
    if campo in parametrosJSON:
      query = query + str(campo)+ ", "
  
  # Para los valores
  query = query[:-2] + ") VALUES("
  
  for campo in camposBD:
    if campo in parametrosJSON:
      insertado = True
      if isinstance(parametrosJSON[campo], str):
        query = query + '"' + parametrosJSON[campo] + '"' + ', '
      else:
        query = query + str(parametrosJSON[campo]) + ', '
  
  # borramos la ultima coma
  query = query[:-2] + ')'
        
  if insertado:
    try:
      #Enviamos consulta
      numAffectedRows = cur.execute(query)
      mysql.commit()
      if numAffectedRows == 0:
        raise ValueError("Algo salio mal")
        return None
      
      #Obtanemos el elemento insertado
      query = "SELECT LAST_INSERT_ID()"
      idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
      
      if idElementoRelacional != None:
        cur.execute(query)
        rv = cur.fetchall()
        if (len(rv) != 0):
          for row in rv:
            nuevoID = row[0]
          query = "SELECT * FROM " + str(elementoRelacional) + " WHERE " + str(idElementoRelacional) + " = " + str(nuevoID)
          cur.execute(query)
          rv = cur.fetchall()
          columns = cur.description
          result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
          return result
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
