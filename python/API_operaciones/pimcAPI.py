from API_operaciones.insertar import insertarNuevoElemento 
from API_operaciones.consulta import consultarElemento 
from API_operaciones.consulta import consultarTodosFiltro
from API_operaciones.eliminar import eliminarElemento
from API_operaciones.modificar import modificarElemento
from API_operaciones.files import cargarArchivo, archivosElementoRelacional, descargarAchivoElementoRelacional

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

    # Definiciones para archivos 
    def cargarArchivo(self, elementoRelacional, parametrosPOST):
        cargarArchivo(elementoRelacional, parametrosPOST)

    def archivosElementoRelacional(self, elementoRelacional, parametrosJSON):
        archivosElementoRelacional(elementoRelacional, parametrosJSON)
    
    def descargarAchivoElementoRelacional(self, elementoRelacional, parametrosJSON):
        descargarAchivoElementoRelacional(elementoRelacional, parametrosJSON)

    def autocompletarConsulta(self):
        return

pimcAPI = pimc()
