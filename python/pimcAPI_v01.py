from flask import Flask, make_response, current_app, request
from flask import jsonify
from API_operaciones import mysql_connection
from datetime import timedelta
from functools import update_wrapper
from tools.invalidUsage import InvalidUsage

app = mysql_connection.app
mysql = mysql_connection.mysql

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


@app.route("/PIMC0.1/ConsultaArchivo", methods=['GET'])
def index():
    if request.method == 'GET':
        if len(request.args) == 0:
            try:
                cur = mysql.connection.cursor()
                cur.execute('''SELECT * FROM Archivos''')
                rv = cur.fetchall()
                columns = cur.description
                result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                return jsonify(result)
            except Exception as e:
                return(str(e))
        else:
            try:
                cur = mysql.connection.cursor()
                
                if request.args.get("archivoID"):
                    cur.execute('''SELECT * FROM Archivos WHERE archivoID = %s''',{int(request.args.get("archivoID"))})
                elif request.args.get("archivoTitulo"):
                    cur.execute('''SELECT * FROM Archivos WHERE titulo LIKE %s ''',{str("%"+request.args.get("archivoTitulo")+"%")})
                else:
                    cur.execute('''SELECT * FROM Archivos''')
                rv = cur.fetchall()
                columns = cur.description
                result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                return jsonify(result)
            except Exception as e:
                return(str(e))


              
@app.route("/PIMC0.1/Consulta/<elemento_relacional>", methods=['POST', 'GET'])
def consultarElementoRelacional(elemento_relacional):            
    if request.method == 'GET':
        if len(request.args) == 0:
            raise InvalidUsage('No se enviaron argumentos', status_code=400)
            return
        else:
            try:
                cur = mysql.connection.cursor()
                querry = '''SELECT * FROM ''' + str(elemento_relacional) + ''' WHERE ''' 
                inserted = False
                # we find the keys first
                for col,value in request.args.to_dict().items():
                    inserted = True
                    querry = querry + str(col) + " = " + str(value)+ " AND "
                #Revisamos que si haya una llave primaria para identificar el elemento
                if inserted:
                    querry = querry [:-4]
                    numAffectedRows = cur.execute(querry)
                    rv = cur.fetchall()
                    if (len(rv) != 0):
                        columns = cur.description
                        result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                        return jsonify(result)
                    else:
                        return jsonify({})
                else:
                    raise InvalidUsage('No se enviaron parametros para consultar', status_code=400)
                    return
            except Exception as e:
                return(str(e))



@app.route("/PIMC0.1/Insertar/<elemento_relacional>", methods=['POST', 'GET'])
def insertarElementoRelacional(elemento_relacional):            
    if request.method == 'GET':
        if len(request.args) == 0:
            raise InvalidUsage('No se enviaron argumentos', status_code=400)
            return
        else:
            try:
                cur = mysql.connection.cursor()
                querry = '''INSERT INTO ''' + str(elemento_relacional) + '''('''
                inserted = False
                #Insertamos las columnas
                for col,value in request.args.to_dict().items():
                    if (len(str(value)) != 0):
                        inserted = True
                        querry = querry + str(col) + ","
                querry = querry[:-1] + ") VALUES("
                #Insertamos los valores
                for col,value in request.args.to_dict().items():
                    if (len(str(value)) != 0):
                        querry = querry + str(value) + ","
                querry = querry[:-1] + ")"
                #Revisamos que si haya una llave primaria para identificar el elemento
                if inserted:
                    numAffectedRows = cur.execute(querry)
                    mysql.connection.commit()
                    querry = "SELECT LAST_INSERT_ID()"
                    cur.execute(querry)
                    rv = cur.fetchall()
                    if (len(rv) != 0):
                        columns = cur.description
                        result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                        return jsonify(result)
                    return "-1"
                else:
                    raise InvalidUsage('No se enviaron argumentos', status_code=400)
                    return
            except Exception as e:
                return(str(e))
            

            

            
@app.route("/PIMC0.1/Eliminar/<elemento_relacional>", methods=['POST', 'GET'])
def eliminarElementoRelacional(elemento_relacional):            
    if request.method == 'GET':
        if len(request.args) == 0:
            raise InvalidUsage('No se enviaron argumentos', status_code=400)
            return
        else:
            try:
                cur = mysql.connection.cursor()
                querry = '''DELETE FROM ''' + str(elemento_relacional) + ''' WHERE '''
                primaryKey = []
                inserted = False
                # we find the keys first
                for col,value in request.args.to_dict().items():
                    inserted = True
                    if col.startswith("idUnico"):
                        try:
                            querry = querry + value + " = " + request.args.get(value) + " AND "
                        except Exception as e:
                            inserted = False
                            raise InvalidUsage('idUnico es invalido', status_code=400)
                            return
                #Revisamos que si haya una llave primaria para identificar el elemento
                if inserted:
                    querry = querry[:-5]
                    numAffectedRows = cur.execute(querry)
                    mysql.connection.commit()
                    return jsonify(numAffectedRows)
                else:
                    raise InvalidUsage('No se enviaron argumentos', status_code=400)
                    return
            except Exception as e:
                return(str(e))

## TODO Agreagar request.method == POST


@app.route("/PIMC0.1/Modificar/<elemento_relacional>", methods=['POST', 'GET'])
def modificarElementoRelacional(elemento_relacional):
    if request.method == 'GET':
        if len(request.args) == 0:
            raise InvalidUsage('No se enviaron argumentos', status_code=400)
            return
        else:
            try:
                cur = mysql.connection.cursor()
                querry = '''UPDATE ''' + str(elemento_relacional) + ''' SET ''' 
                primaryKey = []
                inserted = False
                # we find the keys first
                for col,value in request.args.to_dict().items():
                    if col.startswith("idUnico"):
                        primaryKey.append(value)
                for col,value in request.args.to_dict().items():            
                    if len(value) != 0 and col not in primaryKey and not col.startswith("idUnico"):
                        inserted = True
                        querry = querry + str(col) + " = " + str(value)+ ", "
                #Revisamos que si hay algun elemento para modificar
                if inserted:
                    #remove the lats two characters
                    querry = querry[:-2] + " WHERE "
                    inserted = False
                    for keyName in primaryKey:
                        inserted = True
                        try:
                            querry = querry + keyName + " = " + request.args.get(keyName) + " AND "
                        except Exception as e:
                            inserted = False
                            return "No se encontro un valor para el idUnico=" + keyName 
                    #removemos el ultimo AND
                    querry = querry[:-5]
                #Revisamos que si haya una llave primaria para identificar el elemento
                if inserted:
                    numAffectedRows = cur.execute(querry)
                    rv = cur.fetchall()
                    mysql.connection.commit()
                    return str(numAffectedRows)
                else:
                    return "No se envio ningun parametro para insertar"
            except Exception as e:
                return(str(e))

## TODO Agreagar request.method == POST


@app.route("/PIMC0.1/Autocompletar/<elemento_relacional>", methods=['POST', 'GET'])
def autocompletarElementoRelacionar(elemento_relacional):
    if request.method == 'GET':
        if len(request.args) == 0:
            raise InvalidUsage('No se enviaron argumentos', status_code=400)
            return
        else:
            try:
                cur = mysql.connection.cursor()
                querry = '''SELECT * FROM ''' + str(elemento_relacional) + " WHERE "
                for col,value in request.args.to_dict().items():            
                    if len(value) != 0:
                        querry = querry + str(col) + " LIKE '%" + str(value)+ "%' OR "
                #removemos el ultimo OR
                querry = querry[:-4]
                cur.execute(querry)
                rv = cur.fetchall()
                if (len(rv) != 0):
                    columns = cur.description
                    result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                    return jsonify(result)
                else:
                    return "0"
            except Exception as e:
                return(str(e))

