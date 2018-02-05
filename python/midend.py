import traceback
from API_operaciones import mysql_connection
from tools.invalidUsage import InvalidUsage
import pimcAPI_v01
import pimcAPI_v02

app = mysql_connection.app

@app.errorhandler(InvalidUsage)
@pimcAPI_v01.crossdomain(origin='*')
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
  
  
if __name__ == "__main__":
#   app.run(host= '0.0.0.0')
    app.run(threaded=True)
