from API_operaciones.insertar import insertarNuevoElemento 
from API_operaciones.consulta import consultarElemento 
from API_operaciones.consulta import consultarTodosFiltro
from API_operaciones.eliminar import eliminarElemento
from API_operaciones.modificar import modificarElemento
#from API_operaciones.autocompletar import autocompletar

class pimc:
    def insertarNuevoElemento(self, elementoRelacional, parametrosJSON):
        insertarNuevoElemento(elementoRelacional, parametrosJSON)

    def consultarElemento(self, elementoRelacional, parametrosJSON):
        consultarElemento(elementoRelacional, parametrosJSON)

    def consultarTodosFiltro(self, elementoRelacional, parametrosJSON):
        consultarTodosFiltro(elementoRelacional, parametrosJSON)

    def eliminarElemento(self, elementoRelacional, parametrosJSON):
        eliminarElemento(elementoRelacional, parametrosJSON)

    def modificarElemento(self, elementoRelacional, parametrosJSON):
        modificarElemento(elementoRelacional, parametrosJSON)

    def autocompletarConsulta(self):
        return

pimcAPI = pimc()
