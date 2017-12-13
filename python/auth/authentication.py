import sys, os.path
sys.path.append('../')
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp
from API_operaciones import mysql_connection
import MySQLdb

mysql = mysql_connection.mysql2
app = mysql_connection.app

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

def authenticate(username, password):
    cur = mysql.cursor(MySQLdb.cursors.DictCursor)
    query =  "SELECT * FROM _Metadata_usuariosApplicativo WHERE nombreUsuario = %s"
    cur.execute(query, [username])
    rv = cur.fetchone()
    if (rv is not None):
        if (rv['contrasenna'].encode('utf-8') == password.encode('utf-8')):
            usuario = User(rv['usuarioID'], username, rv['contrasenna'])
            return usuario
        else: 
            return None
    else:
        return None

def identity(payload):
    user_id = payload['identity']
    cur = mysql.cursor(MySQLdb.cursors.DictCursor)
    query =  "SELECT * FROM _Metadata_usuariosApplicativo WHERE usuarioID = %s"
    cur.execute(query, [user_id])
    rv = cur.fetchone()
    if (rv is not None):
        usuario = User(user_id, rv['nombreUsuario'], rv['contrasenna'])
        return usuario
    else:
        return None

jwt = JWT(app, authenticate, identity)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

if __name__ == '__main__':
    app.run()
