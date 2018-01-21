import os
from werkzeug.utils import secure_filename
from API_operaciones.mysql_connection import app, PIMC_ALLOWED_EXTENSIONS
from API_operaciones.mysql_connection import mysql2 as mysql
from API_operaciones.bd_descripcion import pimcBD
from API_operaciones.consulta import consultarElemento

def allowed_file(filename):
    ''' Esta funcion permite revisar que el archivo tenga
        una extension valida. Solo debemos permitir archivos
        con cierto tipo de extensiones
    '''
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def file_extension_changed(filename, new_filename):
    ''' Esta funcion permite revisar que al cambiar el
        nombre de un archivo no se le cambie la extension
        por seguridad y para que no se pierda la info de
        los archivos
    '''
    return filename.rsplit('.', 1)[1].lower() != \
           new_filename.rsplit('.', 1)[1].lower()

def cargarArchivos(elementoRelacional, parametrosPOST):
    ''' Esta funcion permite cargar archivos de un
        elemento relacional en especifico
    '''
    # check if the post request has the file part
    if not parametrosPOST.files or 'file' not in parametrosPOST.files:
        raise ValueError('No se envió archivo adjunto')
    file = parametrosPOST.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        raise ValueError('Nombre archivo incorrecto')
    if file and allowed_file(file.filename):
        # Revisamos que el elemento exista en la base de datos
        idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
        elementoBD = consultarElemento(elementoRelacional, parametrosPOST.form.to_dict())
        if not elementoBD:
            raise ValueError('Elemento no existente')
        filename = secure_filename(file.filename)
        pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, str(elementoBD[0][idElementoRelacional]), filename)
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

def archivosElementoRelacional(elementoRelacional, parametrosJSON):
    ''' Esta funcion permite revisar los archivos 
    que un elemento relacional tiene. Devuelve una 
    lista con cada uno de los archivos
    '''
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if not elementoBD:
        raise ValueError('Elemento no existente')
    # Obtenemos el nombre del archivo
    idElemento = elementoBD[0][idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, str(idElemento))
    if os.path.exists(pathCompleto):
        listaArchivos = [f for f in os.listdir(pathCompleto) if os.path.isfile(os.path.join(pathCompleto, f))]
        return listaArchivos
    else:
        return [];
    return

def descargarAchivoElementoRelacional(elementoRelacional, parametrosJSON):
    ''' Esta funcion permite descargar los archivos
    de un elemento relacional en especifico. parametrosJSON
    deberia tener un nombre de archivo valido
    '''
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if 'fileName' not in parametrosJSON:
        raise ValueError('Parametros Incorrectos' + str(parametrosJSON))
    if not elementoBD:
        raise ValueError('Elemento no existente')
    # Obtenemos el nombre del archivo
    fileName = secure_filename(parametrosJSON['fileName'])
    idElemento = elementoBD[0][idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'], elementoRelacional, str(idElemento), fileName)
    if os.path.exists(pathCompleto) and os.path.isfile(pathCompleto):
        return {'directorio': os.path.dirname(pathCompleto), 'nombreArchivo': os.path.basename(pathCompleto)}
    raise ValueError('El archivo no existe')

def eliminarArchivoElementoRelacional(elementoRelacional, parametrosJSON):
    ''' Esta funcion permite eliminar un archivo de un
    elemento relacional en especifico. parametrosJSON
    deberia tener un nombre de un archivo valido
    '''
    # Revisamos que el elemento exista en la base de datos
    idElementoRelacional = pimcBD.obtenerTablaId(elementoRelacional)
    elementoBD = consultarElemento(elementoRelacional, parametrosJSON)
    if 'fileName' not in parametrosJSON:
        raise ValueError('Parametros Incorrectos' + str(parametrosJSON))
    if not elementoBD:
        raise ValueError('Elemento no existente')
    # Obtenemos el nombre del archivo
    fileName = secure_filename(parametrosJSON['fileName'])
    idElemento = elementoBD[0][idElementoRelacional]
    pathCompleto = os.path.join(app.config['UPLOAD_FOLDER'],
                                elementoRelacional, str(idElemento), fileName)
    if os.path.exists(pathCompleto) and os.path.isfile(pathCompleto):
        try:
            os.remove(pathCompleto)
        except OSError:
            raise ValueError('Elemento incorrecto')
        return {"status": "Success",
                "message": "Archivo eliminado satisfactoriamente"}
    raise ValueError('El archivo no existe')

def renombrarArchivoElementoRelacional(elemento_relacional, parametros_JSON):
    ''' Esta funcion permite renombrar un archivo de un
    elemento relacional en especifico. parametros_JSON
    deberia tener un nombre de un archivo valido
    '''
    # Revisamos que el elemento exista en la base de datos
    id_elemento_relacional = pimcBD.obtenerTablaId(elemento_relacional)
    elemento_BD = consultarElemento(elemento_relacional, parametros_JSON)
    if 'fileName' not in parametros_JSON:
        raise ValueError('Parametros Incorrectos' + str(parametros_JSON))
    if not elemento_BD:
        raise ValueError('Elemento no existente')
    # Obtenemos el nombre del archivo
    file_name = secure_filename(parametros_JSON['fileName'])
    new_file_name = secure_filename(parametros_JSON['newFileName'])
    id_elemento = elemento_BD[0][id_elemento_relacional]
    path_completo = os.path.join(app.config['UPLOAD_FOLDER'],
                                 elemento_relacional, str(id_elemento), file_name)
    new_path_completo = os.path.join(app.config['UPLOAD_FOLDER'],
                                     elemento_relacional, str(id_elemento), new_file_name)

    # Revisamos que no se cambie la extension del archivo
    if file_extension_changed(file_name, new_file_name):
        raise ValueError('No se puede cambiar la extension de un archivo')

    # renombramos el archivo
    if (os.path.exists(path_completo) and
            os.path.isfile(path_completo) and
            allowed_file(new_file_name)):
        try:
            os.rename(path_completo, new_path_completo)
        except OSError:
            raise ValueError('Elemento incorrecto')
        return {"status": "Success",
                "message": "Archivo renombrado satisfactoriamente"}
    raise ValueError('El archivo no existe')
