import os
from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename
from API_operaciones.mysql_connection import app, PIMC_ALLOWED_EXTENSIONS
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
from API_operaciones.consulta import consultarElemento

import MySQLdb
from flask import jsonify

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def cargarArchivo(elementoRelacional, parametrosPOST):
    # check if the post request has the file part
    if 'file' not in parametrosPOST.files:
        raise InvalidUsage('No se envió archivo adjunto', status_code=400)
        return
    file = parametrosPOST.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        raise InvalidUsage('Nombre archivo incorrecto', status_code=400)
        return
    if file and allowed_file(file.filename):
        # Revisamos que el elemento exista en la base de datos
        idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
        elementoBD = consultarElemento(elementoRelacional, parametrosPOST)
        if not elementoBD:
            raise InvalidUsage('Elemento no existente', status_code=400)
            return
        filename = secure_filename(file.filename)
        pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, elementoBD[idElementoRelacional], filename)
        # Creamos los folderes si es necesario
        directory = os.path.dirname(pathCompleto)
        if not os.path.exists(directory):
            os.makedirs(directory)
        # Guardamos el archivo en la base de datos
        file.save(pathCompleto)
        return jsonify({"status": "Success",
                        "message": "Archivo agregado satisfactoriamente"})
    else:
        raise InvalidUsage('Nombre archivo incorrecto', status_code=400)
        return

''' Esta funcion permite revisar los archivos 
que un elemento relacional tiene. Devuelve una 
lista con cada uno de los archivos
'''
def archivosElementoRelacional(elementoRelacional, parametrosJSON)
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if not elementoBD:
        raise InvalidUsage('Elemento no existente', status_code=404)
        return
    # Obtenemos el nombre del archivo
    idElemento = elementoBD[idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, idElemento)
    if not os.path.exists(pathCompleto):
        listaArchivos = [f for f in os.listdir(pathCompleto) if os.path.isfile(os.path.join(pathCompleto, f))]
        return listaArchivos
    raise InvalidUsage('El archivo no existe', status_code=404)
    return

''' Esta funcion permite descargar los archivos
de un elemento relacional en especifico. parametrosJSON
deberia tener un nombre de archivo valido
'''

def descargarAchivoElementoRelaconal(elementoRelacional, parametrosJSON)
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if not elementoBD:
        raise InvalidUsage('Elemento no existente', status_code=400)
        return
    # Obtenemos el nombre del archivo
    fileName = secure_filename(parametrosJSON.fileName)
    idElemento = elementoBD[idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, idElemento, fileName)
    if not os.path.exists(pathCompleto):
        return file(pathCompleto)
    raise InvalidUsage('El archivo no existe', status_code=404)
    return
