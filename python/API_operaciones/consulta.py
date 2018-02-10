from API_operaciones.mysql_connection import app
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
import MySQLdb


def consultarTodosFiltro(elementoRelacional, parametrosJSON):
  cur = mysql.cursor()
  if (not pimcBD.tablaExiste(elementoRelacional)):
    raise ValueError("elementoRelacional No Existe")
    return None

  camposBD = pimcBD.obtenerCamposTabla(elementoRelacional)
  argumentosBD = []
  # Inicializamos la consulta
  query = '''SELECT * FROM ''' + elementoRelacional + ''' WHERE ( '''
  
  hayParametros = false
  for campo in camposBD:
    if campo in parametrosJSON:
      hayParametros = true
      if isinstance(parametrosJSON[campo],str) :
        query = query + str(campo) + ' LIKE %s OR '
        argumentosBD.append("%"+parametrosJSON[campo]+"%")
      else:
        query = query + str(campo) + ' = %s OR '
        argumentosBD.append(parametrosJSON[campo])

  if hayParametros:
    query = query[:-3] + ' )' # quitamos el ultimo or y cerramos los parentesis
 
  #revisamos si hay restricciones
  hayRestricciones = false
  if parametrosJSON['restricciones'] and isinstance(parametrosJSON['restricciones'], dict):
    if hayParametros:
      query = query + ' AND (' # Agregamos un and y un parentesis para agregar las restricciones
    restricciones = parametrosJSON['restricciones']
    for campo in camposBD: 
      if campo in restricciones:
        hayRestricciones = true
        if isinstance(restricciones[campo],str) :
          query = query + str(campo) + ' LIKE %s AND '
          argumentosBD.append("%" + restricciones[campo] + "%")
        else:
          query = query + str(campo) + ' = %s AND '
          argumentosBD.append(restricciones[campo])
    
    if not hayRestricciones:
      # Si no hay restricciones agregadas quitamos el ' AND (' del principio
      query = query[:-6]
    else:
      # si hay restricciones, quitamos el ultimo AND
      query = query[:-4]
    
    #cerramos el parentesis
    query = query + ' )'

  if not (hayParametros or hayRestricciones):
    # si no se encontraron ninguno de los dos simplificamos la consulta
    query = '''SELECT * FROM ''' + elementoRelacional
  
  try:
    cur.execute(query, argumentosBD)
    rv = cur.fetchall()
    if (len(rv) != 0):
      columns = cur.description
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
      return result
    else:
      return {}
  except (MySQLdb.Error, MySQLdb.Warning) as e:
    raise ValueError("MYSQL ERROR = ", str(e))
    return None
  
def consultarElemento(elementoRelacional, parametrosJSON):
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
  
  idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
  if idElementoRelacional:
    if idElementoRelacional in parametrosJSON:
      idValor = parametrosJSON[idElementoRelacional]
      # Inicializamos la consulta
      query = '''SELECT * FROM %s WHERE %s = %d '''
      try:
        cur.execute(query % (elementoRelacional, idElementoRelacional, int(idValor)))
        rv = cur.fetchall()
        if (len(rv) != 0):
          columns = cur.description
          result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
          return result
        else:
          return {}
      except (MySQLdb.Error, MySQLdb.Warning) as e:
        raise ValueError("MYSQL ERROR = ", str(e))
        return None
    else:
      raise ValueError("ID Invalido para elemento relacional")
      return None
  else:
    raise ValueError("ID invalido para elemento relacional")
    return None