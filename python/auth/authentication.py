import sys, os.path
sys.path.append('../')
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp
from API_operaciones import mysql_connection
import hashlib, uuid
import MySQLdb

mysql = mysql_connection.mysql2
app = mysql_connection.app

users_db_table = "_Metadata_usuariosApplicativo"

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

def authenticate(username, password):
    cur = mysql.cursor(MySQLdb.cursors.DictCursor)
    query =  "SELECT * FROM %s WHERE nombreUsuario = %s"
    cur.execute(query, [users_db_table, username])
    rv = cur.fetchone()
    if (rv is not None):
        salt = rv['salt']
        hashedPWD = hashPWD(password, salt)
        if (if rv['verificado'] != 0 && (rv['contrasenna'].encode('utf-8') == hashedPWD.encode('utf-8'))):
            usuario = User(rv['usuarioID'], username, rv['contrasenna'])
            # Actualizamos ultima conexion
            query = "UPDATE %s SET ultimaConexion = CURRENT_TIMESTAMP"
            cur.execute(query, [users_db_table])
            mysql.commit()
            return usuario
        else: 
            return None
    else:
        return None

def identity(payload):
    user_id = payload['identity']
    cur = mysql.cursor(MySQLdb.cursors.DictCursor)
    query =  "SELECT * FROM %s WHERE usuarioID = %s"
    cur.execute(query, [users_db_table, user_id])
    rv = cur.fetchone()
    if (rv is not None):
        usuario = User(user_id, rv['nombreUsuario'], rv['contrasenna'])
        return usuario
    else:
        return None

def create_user(userInfo):
    # Revsisamos que este la informacion requerida
    if (not isinstance(userInfo, dict)):
        raise ValueError("Informacion de usuario incorrecta")
        return None
    if (not userInfo.nombreReal or 
        not userInfo.email or 
        not userInfo.nombreUsuario or 
        not userInfo.contrasenna):
        raise ValueError("No se enviaron todos los valores de la informacion del usuario")
        return None

    # MySQL cursor
    cur = mysql.cursor(MySQLdb.cursors.DictCursor)

    # revisamos que el usuario no exista
    query = "SELECT * FROM %s WHERE nombreUsuario = %s"
    cur.execute(query, [users_db_table, userInfo.nombreUsuario])
    rv = cur.fetchall()
    if (len(rv) != 0):
        raise ValueError("Nombre de usuario ya existe")
        return None
    
    # ejecutamos la consulta para insertar el usuario
    salt = uuid.uuid4().hex
    password = hashPWD(userInfo.contrasenna, salt)
    query = "INSERT INTO %s (nombreReal, email, nombreUsuario, contrasenna, salt) VALUES (%s, %s, %s, %s, %s)"
    numAffectedRows = cur.execute(query, [users_db_table, userInfo.nombreReal, userInfo.email, userInfo.nombreUsuario, password, salt])

    #Revisamos que si haya insercion
    if (numAffectedRows == 0):
        raise ValueError("Algo salio mal al insertar el nuevo usuario")
        return None
    else:
        mysql.commit()
        return True
    
    # This shouldn't be reached. 
    return None

def hashPWD(password, salt):
    return hashlib.sha512((password + salt).encode('utf-8')).hexdigest()

jwt = JWT(app, authenticate, identity)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

@app.route('/register', methods=['POST'])
def creatUsuarioRoute():
    if request.method == 'POST':
        data = request.get_json()
        if data:
            try:
                if create_user(data):
                    return {status: "Success",
                            message: "Usuario creado satisfactoriamente"}
                else:
                    return {status: "Failed",
                            message: "Ocurrio un error creando el usuario"}
            except ValueError as e:
                raise InvalidUsage("ERROR: " + str(e), status_code = 400)
            except Exception as e:
                raise InvalidUsage("ERROR: " + traceback.format_exc(), status_code = 400)
        else:
            raise InvalidUsage("ERROR: Parametros invalidos", status_code = 400)
    else:
        return ""

if __name__ == '__main__':
    app.run()
