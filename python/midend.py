from flask import Flask
from flask import jsonify
from flask_mysqldb import MySQL
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

app = Flask(__name__)

# MySQL configurations
#app.config['MYSQL_USER'] = 'historia_patria_app'
#app.config['MYSQL_PASSWORD'] = ':;:4A4d9FYET6B1C8L4'
app.config['MYSQL_USER']='root'
app.config['MYSQL_PASSWORD']='J053m4nu3lm'
app.config['MYSQL_DB'] = 'HistoriaPatriaDB'
app.config['MYSQL_HOST'] = 'localhost'
mysql = MySQL(app)

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



@app.route("/PIMC0.1/ConsultaArchivo", methods=['POST', 'GET'])
@crossdomain(origin='*')
def index():
    #For POST Methond
    if request.method == 'POST':
        #si no se ha enviado un dato de  un archivo
        if len(request.form) == 0:
            try:
                cur = mysql.connection.cursor()
                cur.execute('''SELECT * FROM Archivos''')
                rv = cur.fetchall()
                columns = cur.description
                result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                return jsonify(result)
            except Exception as e:
                return(str(e))
        #si se esta pidiendo algo
        else:
            try:
                cur = mysql.connection.cursor()
                if request.form["archivoID"]:
                    cur.execute('''SELECT * FROM Archivos WHERE archivoID = %s''',{int(request.form["archivoID"])})
                elif request.form["archivoTitulo"]:
                    cur.execute('''SELECT * FROM Archivos WHERE titulo LIKE %s ''',{str("%"+request.args.get("archivoTitulo")+"%")})
                else:
                    cur.execute('''SELECT * FROM Archivos''')
                rv = cur.fetchall()
                columns = cur.description
                result = [{columns[index][0]:column for index, column in enumerate(value)} for value in rv]
                return jsonify(result)
            except Exception as e:
                return(str(e))
    elif request.method == 'GET':
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

@app.route("/hello")
def hello():
    return "Hello blablabla"

if __name__ == "__main__":
#   app.run(host= '0.0.0.0')
    app.run()
