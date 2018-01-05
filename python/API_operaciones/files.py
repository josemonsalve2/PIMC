import os
from werkzeug.utils import secure_filename
from API_operaciones.mysql_connection import app, PIMC_ALLOWED_EXTENSIONS
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
from API_operaciones.consulta import consultarElemento

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def cargarArchivos(elementoRelacional, parametrosPOST):
    # check if the post request has the file part
    if not parametrosPOST.files or 'file' not in parametrosPOST.files:
        raise ValueError('No se envió archivo adjunto')
        return
    file = parametrosPOST.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        raise ValueError('Nombre archivo incorrecto')
        return
    if file and allowed_file(file.filename):
        # Revisamos que el elemento exista en la base de datos
        idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
        elementoBD = consultarElemento(elementoRelacional, parametrosPOST.get_json())
        if not elementoBD:
            raise ValueError('Elemento no existente')
            return
        filename = secure_filename(file.filename)
        pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, elementoBD[idElementoRelacional], filename)
        # Creamos los folderes si es necesario
        directory = os.path.dirname(pathCompleto)
        if not os.path.exists(directory):
            os.makedirs(directory)
        # Guardamos el archivo en la base de datos
        file.save(pathCompleto)
        return {"status": "Success",
                "message": "Archivo agregado satisfactoriamente"}
    else:
        raise ValueError('Nombre archivo incorrecto')
        return

''' Esta funcion permite revisar los archivos 
que un elemento relacional tiene. Devuelve una 
lista con cada uno de los archivos
'''
def archivosElementoRelacional(elementoRelacional, parametrosJSON):
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if not elementoBD:
        raise ValueError('Elemento no existente')
        return
    # Obtenemos el nombre del archivo
    idElemento = elementoBD[idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, idElemento)
    if not os.path.exists(pathCompleto):
        listaArchivos = [f for f in os.listdir(pathCompleto) if os.path.isfile(os.path.join(pathCompleto, f))]
        return listaArchivos
    raise ValueError('El archivo no existe')
    return

''' Esta funcion permite descargar los archivos
de un elemento relacional en especifico. parametrosJSON
deberia tener un nombre de archivo valido
'''

def descargarAchivoElementoRelacional(elementoRelacional, parametrosJSON):
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if not elementoBD:
        raise ValueError('Elemento no existente')
        return
    # Obtenemos el nombre del archivo
    fileName = secure_filename(parametrosJSON.fileName)
    idElemento = elementoBD[idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, idElemento, fileName)
    if not os.path.exists(pathCompleto):
        return open(pathCompleto)
    raise ValueError('El archivo no existe')
    return
