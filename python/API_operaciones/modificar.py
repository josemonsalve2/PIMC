from API_operaciones.mysql_connection import app
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
import MySQLdb
from flask import jsonify


def modificarElemento(elementoRelacional, parametrosJSON):
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
  idValor = None
  # Inicializamos la consulta
  querry = '''UPDATE ''' + str(elementoRelacional) + ''' SET '''
  camposBD = pimcBD.obtenerCamposTabla(elementoRelacional)
  argumentosBD = []
  
  for campo in camposBD:
    if campo in parametrosJSON:
      if (campo == idElementoRelacional):
        idValor = parametrosJSON[campo]
      else:
        argumentosBD.append(parametrosJSON[campo])
        querry = querry + str(campo) + ' =  %s , '

  if idValor == None:
    raise ValueError("No se envio llave primaria para modificar")
    return None
  
  if len(argumentosBD) == 0:
    raise ValueError("No se enviaron parametros para modificar")
    return None
  
  # borramos la ultima coma Agregamos ID
  querry = querry[:-2] + " WHERE " + str(idElementoRelacional) + " = %s "
  argumentosBD.append(idValor)
        
  try:
    #Enviamos consulta
    numAffectedRows = cur.execute(querry, tuple(argumentosBD))
    mysql.commit()
    return jsonify(numAffectedRows)
  
  except (MySQLdb.Error, MySQLdb.Warning) as e:
    raise ValueError("MYSQL ERROR ("+querry+") = ", str(e))
    return None