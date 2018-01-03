from API_operaciones.mysql_connection import app
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
import MySQLdb


def eliminarElemento(elementoRelacional, parametrosJSON):
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
      querry = '''DELETE FROM %s WHERE %s = %d '''
      try:
        numEntradasBorradas = cur.execute(querry % (elementoRelacional, idElementoRelacional, int(idValor)))
        mysql.commit()
        return numEntradasBorradas
      except (MySQLdb.Error, MySQLdb.Warning) as e:
        raise ValueError("MYSQL ERROR = ", str(e))
        return None
    else:
      raise ValueError("ID Invalido para elemento relacional")
      return None
  else:
    raise ValueError("ID invalido para elemento relacional")
    return None
