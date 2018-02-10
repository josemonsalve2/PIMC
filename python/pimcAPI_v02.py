import traceback
from flask import Flask, request, jsonify, send_from_directory
from flask_jwt import JWT, jwt_required, current_identity
from API_operaciones import mysql_connection
from API_operaciones import pimcAPI
from auth import authentication
from tools.invalidUsage import InvalidUsage

pimc = pimcAPI.pimcAPI
jwt = authentication.jwt
app = mysql_connection.app

@app.route("/PIMC0.2/Insertar/<elemento_relacional>", methods=['POST'])
def insertarElementoRelacionalPIMC0_2(elemento_relacional):
  if request.method == 'POST':
    data = request.get_json()
    if data:
      try: 
        return jsonify(pimcAPI.insertarNuevoElemento(elemento_relacional, data))
      except ValueError as e:
        raise InvalidUsage("ERROR: " + str(e), status_code = 400)
      except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
    else:
      raise InvalidUsage('No se enviaron argumentos', status_code = 400)
  else:
    return ""
     
    
@app.route("/PIMC0.2/Consulta/<elemento_relacional>", methods=['GET'])
def consultarElementoRelacionalPIMC0_2(elemento_relacional):
  if request.method == 'GET':
    data = request.args.to_dict()
    if data:
      try: 
        return jsonify(pimcAPI.consultarElemento(elemento_relacional, data))
      except ValueError as e:
        raise InvalidUsage("ERROR: " + str(e), status_code = 400)
      except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
    else:
      raise InvalidUsage('No se enviaron argumentos', status_code = 400)
  else:
    return ""
  
@app.route("/PIMC0.2/Eliminar/<elemento_relacional>", methods=['DELETE'])
def eliminarElementoRelacionalPIMC0_2(elemento_relacional):
  if request.method == 'DELETE':
    data = request.args.to_dict()
    if data:
      try: 
        return jsonify(pimcAPI.eliminarElemento(elemento_relacional, data))
      except ValueError as e:
        raise InvalidUsage("ERROR: " + str(e), status_code = 400)
      except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
    else:
      raise InvalidUsage('No se enviaron argumentos', status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/Modificar/<elemento_relacional>", methods=['POST'])
def modificarElementoRelacionalPIMC0_2(elemento_relacional):
  if request.method == 'POST':
    data = request.get_json()
    if data:
      try: 
        return jsonify(pimcAPI.modificarElemento(elemento_relacional, data))
      except ValueError as e:
        raise InvalidUsage("ERROR: " + str(e), status_code = 400)
      except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
    else:
      raise InvalidUsage('No se enviaron argumentos', status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/ConsultarTodos/<elemento_relacional>", methods=['GET'])
def consultarTodosFiltroPIMC0_2(elemento_relacional):
  if request.method == 'GET':
    data = request.args.to_dict() 
    if not data:
      data = {}
    try:
      return jsonify(pimcAPI.consultarTodosFiltro(elemento_relacional, data))
    except ValueError as e:
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/ConsultarTodosAvanzado/<elemento_relacional>", methods=['POST'])
def consultarTodosFiltroAvanzaodPIMC0_2(elemento_relacional):
  if request.method == 'POST':
    data = request.get_json()
    if not data:
      data = {}
    try:
      return jsonify(pimcAPI.consultarTodosFiltroAvanzado(elemento_relacional, data))
    except ValueError as e:
      print("HEREEEE")
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/cargarArchivos/<elemento_relacional>", methods=['POST'])
def cargarArchivosPIMC0_2(elemento_relacional):
  if request.method == 'POST':
    data = request
    try:
      if not data:
        raise ValueError("No se envio ningun archivo")
      return jsonify(pimcAPI.cargarArchivos(elemento_relacional, data))
    except ValueError as e:
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/listaArchivos/<elemento_relacional>", methods=['GET'])
def listaArchivosPIMC0_2(elemento_relacional):
  if request.method == 'GET':
    data = request.args.to_dict() 
    if not data:
      data = {}
    try:
      return jsonify(pimcAPI.archivosElementoRelacional(elemento_relacional, data))
    except ValueError as e:
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/descargarArchivo/<elemento_relacional>", methods=['GET'])
def descargarArchivosPIMC0_2(elemento_relacional):
  if request.method == 'GET':
    data = request.args.to_dict() 
    if not data:
      data = {}
    try:
      archivoAEnviar = pimcAPI.descargarAchivoElementoRelacional(elemento_relacional, data)
      return send_from_directory(archivoAEnviar['directorio'], archivoAEnviar['nombreArchivo'], as_attachment=True)
    except ValueError as e:
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/eliminarArchivo/<elemento_relacional>", methods=['GET'])
def eliminarArchivosPIMC0_2(elemento_relacional):
  if request.method == 'GET':
    data = request.args.to_dict() 
    if not data:
      data = {}
    try:
      return jsonify(pimcAPI.eliminarArchivoElementoRelacional(elemento_relacional, data))
    except ValueError as e:
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

@app.route("/PIMC0.2/renombrarArchivo/<elemento_relacional>", methods=['GET'])
def renombrarArchivosPIMC0_2(elemento_relacional):
  if request.method == 'GET':
    data = request.args.to_dict() 
    if not data:
      data = {}
    try:
      return jsonify(pimcAPI.renombrarArchivoElementoRelacional(elemento_relacional, data))
    except ValueError as e:
      raise InvalidUsage("ERROR: " + str(e), status_code = 400)
    except Exception as e:
        raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
  else:
    return ""

