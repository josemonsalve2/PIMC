from API_operaciones.insertar import insertarNuevoElemento 
from API_operaciones.consulta import consultarElemento 
from API_operaciones.consulta import consultarTodosFiltro
from API_operaciones.consulta import consultarTodosFiltroAvanzado
from API_operaciones.eliminar import eliminarElemento
from API_operaciones.modificar import modificarElemento
from API_operaciones.files import\
    cargarArchivos,\
    archivosElementoRelacional,\
    descargarAchivoElementoRelacional,\
    eliminarArchivoElementoRelacional,\
    renombrarArchivoElementoRelacional

class pimc:
    def insertarNuevoElemento(self, elementoRelacional, parametrosJSON):
        insertarNuevoElemento(elementoRelacional, parametrosJSON)

    def consultarElemento(self, elementoRelacional, parametrosJSON):
        consultarElemento(elementoRelacional, parametrosJSON)

    def consultarTodosFiltro(self, elementoRelacional, parametrosJSON):
        consultarTodosFiltro(elementoRelacional, parametrosJSON)

    def consultarTodosFiltroAvanzado(self, elementoRelacional, parametrosJSON):
        consultarTodosFiltroAvanzado(elementoRelacional, parametrosJSON)
    
    def eliminarElemento(self, elementoRelacional, parametrosJSON):
        eliminarElemento(elementoRelacional, parametrosJSON)

    def modificarElemento(self, elementoRelacional, parametrosJSON):
        modificarElemento(elementoRelacional, parametrosJSON)

    # Definiciones para archivos 
    def cargarArchivos(self, elementoRelacional, parametrosPOST):
        cargarArchivos(elementoRelacional, parametrosPOST)

    def archivosElementoRelacional(self, elementoRelacional, parametrosJSON):
        archivosElementoRelacional(elementoRelacional, parametrosJSON)
    
    def descargarAchivoElementoRelacional(self, elementoRelacional, parametrosJSON):
        descargarAchivoElementoRelacional(elementoRelacional, parametrosJSON)
    
    def eliminarArchivoElementoRelacional(self, elementoRelacional, parametrosJSON):
        eliminarArchivoElementoRelacional(elementoRelacional, parametrosJSON)
    
    def renombrarArchivoElementoRelacional(self, elementoRelacional, parametrosJSON):
        renombrarArchivoElementoRelacional(elementoRelacional, parametrosJSON)

    def autocompletarConsulta(self):
        return

pimcAPI = pimc()
