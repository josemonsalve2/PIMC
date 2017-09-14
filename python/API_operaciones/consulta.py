from API_operaciones.mysql_connection import app
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
import MySQLdb
from flask import jsonify


def consultarTodosFiltro(elementoRelacional, parametrosJSON):
  cur = mysql.cursor()
  if (not pimcBD.tablaExiste(elementoRelacional)):
    raise ValueError("elementoRelacional No Existe")
    return None

  camposBD = pimcBD.obtenerCamposTabla(elementoRelacional)
  argumentosBD = []
  # Inicializamos la consulta
  querry = '''SELECT * FROM ''' + elementoRelacional + ''' WHERE '''
  
  for campo in camposBD:
    if campo in parametrosJSON:
        if isinstance(parametrosJSON[campo],str) :
          querry = querry + str(campo) + ' LIKE %s AND '
          argumentosBD.append("%"+parametrosJSON[campo]+"%")
        else:
          querry = querry + str(campo) + ' = %s AND '
          argumentosBD.append(parametrosJSON[campo])

  if len(argumentosBD) == 0:
    querry = '''SELECT * FROM ''' + elementoRelacional
  else: 
    querry = querry[:-4] #remove the last AND
  try:
    cur.execute(querry, argumentosBD)
    rv = cur.fetchall()
    if (len(rv) != 0):
      columns = cur.description
      result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
      return jsonify(result)
    else:
      return jsonify({})
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
      querry = '''SELECT * FROM %s WHERE %s = %d '''
      try:
        cur.execute(querry % (elementoRelacional, idElementoRelacional, int(idValor)))
        rv = cur.fetchall()
        if (len(rv) != 0):
          columns = cur.description
          result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
          return jsonify(result)
        else:
          return jsonify({})
      except (MySQLdb.Error, MySQLdb.Warning) as e:
        raise ValueError("MYSQL ERROR = ", str(e))
        return None
    else:
      raise ValueError("ID Invalido para elemento relacional")
      return None
  else:
    raise ValueError("ID invalido para elemento relacional")
    return None