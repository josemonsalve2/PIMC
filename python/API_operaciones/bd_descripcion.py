from sys import stderr

def print_err(*args, **kwargs):
    print(*args, file=stderr, **kwargs)

class bd_descripcion:
  """ Esta clase tiene metodos para revisar 
  que los datos requeridos si existan """
  tablas = []
  descripcionTablas = {}
  idPorTabla = {}
  
  """ Constructor"""
  def __init__(self):
    self.insertarTabla(['Actividades',
                        "ActividadesNotas",
                        "Archivos",
                        "ArchivosNotas",
                        "Documentos",
                        "DocumentosEmisorReceptor",
                        "DocumentosNotas",
                        "DocumentosRefActividades",
                        "DocumentosRefEmbarcacion",
                        "DocumentosRefEventos",
                        "DocumentosRefInstituciones",
                        "DocumentosRefLugares",
                        "DocumentosRefPersonajes",
                        "DocumentosRefTerritorios",
                        "Embarcaciones",
                        "EmbarcacionesBanderas",
                        "EmbarcacionesElementos",
                        "EmbarcacionesNotas", 
                        "EmbarcacionesReparaciones",
                        "EmbarcacionesRutas",
                        "EmbarcacionesRutasBitacora",
                        "EmbarcacionesRutasCarga",
                        "EmbarcacionesRutasEscalas",
                        "EmbarcacionesRutasNotas",
                        "EmbarcacionesRutasPersonal",
                        "EmbarcacionesRutasPersonalAnonimo",
                        "Eventos",
                        "EventosNotas",
                        "Instituciones",
                        "InstitucionesFuncionarios",
                        "InstitucionesPersonajes",
                        "InstitucionesPersonajesNotas", 
                        "Lugares",
                        "LugaresActividades",
                        "LugaresNotas",
                        "Personajes",
                        "PersonajesComisionesTrabajos", "PersonajesNotas",
                        "PersonajesParentescos",
                        "Territorios",
                        "TerritoriosCartografia", "TerritoriosGeografia",
                        "TerritoriosNotas",
                        "TerritoriosPoblacion",
                        "TerritoriosVecinos", "TerritoriosViasComunicacion"])
    
    """ Definiciones llaves primarias"""
    self.insertarIdPrincipalTabla("Actividades", "actividadID")
    self.insertarIdPrincipalTabla("ActividadesNotas", "notaID")
    self.insertarIdPrincipalTabla("Archivos", "archivoID")
    self.insertarIdPrincipalTabla("ArchivosNotas", "notaID")
    self.insertarIdPrincipalTabla("Documentos", "documentoID")
    self.insertarIdPrincipalTabla("DocumentosEmisorReceptor", "origenDestinoID")
    self.insertarIdPrincipalTabla("DocumentosNotas", "notaID")
    self.insertarIdPrincipalTabla("DocumentosRefActividades", "referenciaID")
    self.insertarIdPrincipalTabla("DocumentosRefEmbarcacion", "referenciaID")
    self.insertarIdPrincipalTabla("DocumentosRefEventos", "referenciaID")
    self.insertarIdPrincipalTabla("DocumentosRefInstituciones", "referenciaID")
    self.insertarIdPrincipalTabla("DocumentosRefLugares", "referenciaID")
    self.insertarIdPrincipalTabla("DocumentosRefPersonajes", "referenciaID")
    self.insertarIdPrincipalTabla("DocumentosRefTerritorios", "referenciaID")
    self.insertarIdPrincipalTabla("Embarcaciones", "embarcacionID")
    self.insertarIdPrincipalTabla("EmbarcacionesBanderas", "embarcacionesBanderasID")
    self.insertarIdPrincipalTabla("EmbarcacionesElementos", "elementoID")
    self.insertarIdPrincipalTabla("EmbarcacionesNotas", "notaID")
    self.insertarIdPrincipalTabla("EmbarcacionesReparaciones", "reparacionID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutas", "rutaID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutasBitacora", "entradaID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutasCarga", "cargaID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutasEscalas", "escalaID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutasNotas", "notaID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutasPersonal", "personalID")
    self.insertarIdPrincipalTabla("EmbarcacionesRutasPersonalAnonimo", "personalID")
    self.insertarIdPrincipalTabla("Eventos", "eventoID")
    self.insertarIdPrincipalTabla("EventosNotas", "notaID")
    self.insertarIdPrincipalTabla("Instituciones", "institucionID")
    self.insertarIdPrincipalTabla("InstitucionesFuncionarios", "funcionID")
    self.insertarIdPrincipalTabla("InstitucionesPersonajes", "empleoID")
    self.insertarIdPrincipalTabla("InstitucionesPersonajesNotas", "notaID")
    self.insertarIdPrincipalTabla("Lugares", "lugarID")
    self.insertarIdPrincipalTabla("LugaresActividades", "actividadID")
    self.insertarIdPrincipalTabla("LugaresNotas", "notaID")
    self.insertarIdPrincipalTabla("Personajes", "personajeID")
    self.insertarIdPrincipalTabla("PersonajesComisionesTrabajos", "comisionTrabajoID")
    self.insertarIdPrincipalTabla("PersonajesNotas", "notaID")
    self.insertarIdPrincipalTabla("PersonajesParentescos", "parentescoID")
    self.insertarIdPrincipalTabla("Territorios", "territorioID")
    self.insertarIdPrincipalTabla("TerritoriosCartografia", "cartografiaID")
    self.insertarIdPrincipalTabla("TerritoriosGeografia", "geografiaID")
    self.insertarIdPrincipalTabla("TerritoriosNotas", "notaID")
    self.insertarIdPrincipalTabla("TerritoriosPoblacion", "territorioPoblacionID")
    self.insertarIdPrincipalTabla("TerritoriosVecinos", "relacionID")
    self.insertarIdPrincipalTabla("TerritoriosViasComunicacion", "viasComunicacionID")
    
    """ Definiciones de las bases de datos"""
    self.insertarDescripcion("Actividades", "actividadID")
    self.insertarDescripcion("Actividades", "nombre")
    self.insertarDescripcion("Actividades", "tipo")
    self.insertarDescripcion("Actividades", "descripcion")
    self.insertarDescripcion("Actividades", "personajesInvolucrados")
    self.insertarDescripcion("Actividades", "herramientas")
    self.insertarDescripcion("Actividades", "materiales")
    self.insertarDescripcion("ActividadesNotas", "notaID")
    self.insertarDescripcion("ActividadesNotas", "actividadID")
    self.insertarDescripcion("ActividadesNotas", "nota")
    self.insertarDescripcion("ActividadesNotas", "referencia")
    self.insertarDescripcion("ActividadesNotas", "fechaCreacion")
    self.insertarDescripcion("ActividadesNotas", "fechaHistorica")
    self.insertarDescripcion("ActividadesNotas", "fechaHistFormato")
    self.insertarDescripcion("Archivos", "archivoID")
    self.insertarDescripcion("Archivos", "institucionFondo")
    self.insertarDescripcion("Archivos", "numRefDentroFondo")
    self.insertarDescripcion("Archivos", "titulo")
    self.insertarDescripcion("Archivos", "fechaInicial")
    self.insertarDescripcion("Archivos", "fechaInicialFormato")
    self.insertarDescripcion("Archivos", "fechaFinal")
    self.insertarDescripcion("Archivos", "fechaFinalFormato")
    self.insertarDescripcion("Archivos", "seccion")
    self.insertarDescripcion("Archivos", "fondo")
    self.insertarDescripcion("Archivos", "legajo")
    self.insertarDescripcion("Archivos", "numOrden")
    self.insertarDescripcion("Archivos", "folioInicial")
    self.insertarDescripcion("Archivos", "folioFinal")
    self.insertarDescripcion("Archivos", "numPaginas")
    self.insertarDescripcion("Archivos", "palabrasClaves")
    self.insertarDescripcion("Archivos", "disponibilidad")
    self.insertarDescripcion("ArchivosNotas", "notaID")
    self.insertarDescripcion("ArchivosNotas", "archivoID")
    self.insertarDescripcion("ArchivosNotas", "nota")
    self.insertarDescripcion("ArchivosNotas", "referencia")
    self.insertarDescripcion("ArchivosNotas", "fechaCreacion")
    self.insertarDescripcion("ArchivosNotas", "fechaHistorica")
    self.insertarDescripcion("ArchivosNotas", "fechaHistFormato")
    self.insertarDescripcion("Documentos", "documentoID")
    self.insertarDescripcion("Documentos", "archivoID")
    self.insertarDescripcion("Documentos", "tipoDocumento")
    self.insertarDescripcion("Documentos", "estadoConservacion")
    self.insertarDescripcion("Documentos", "formatoDisponible")
    self.insertarDescripcion("Documentos", "fechaMinima")
    self.insertarDescripcion("Documentos", "fechaMinFormato")
    self.insertarDescripcion("Documentos", "fechaMaxima")
    self.insertarDescripcion("Documentos", "fechaMaxFormato")
    self.insertarDescripcion("Documentos", "sinopsis")
    self.insertarDescripcion("Documentos", "listaTemas")
    self.insertarDescripcion("DocumentosEmisorReceptor", "origenDestinoID")
    self.insertarDescripcion("DocumentosEmisorReceptor", "documentoID")
    self.insertarDescripcion("DocumentosEmisorReceptor", "emitidoPorID")
    self.insertarDescripcion("DocumentosEmisorReceptor", "dirigidoAID")
    self.insertarDescripcion("DocumentosEmisorReceptor", "institucionEmisorID")
    self.insertarDescripcion("DocumentosEmisorReceptor", "institucionReceptorID")
    self.insertarDescripcion("DocumentosEmisorReceptor", "cargoEmisor")
    self.insertarDescripcion("DocumentosEmisorReceptor", "cargoReceptor")
    self.insertarDescripcion("DocumentosEmisorReceptor", "notasEmisor")
    self.insertarDescripcion("DocumentosEmisorReceptor", "notasReceptor")
    self.insertarDescripcion("DocumentosNotas", "notaID")
    self.insertarDescripcion("DocumentosNotas", "documentoID")
    self.insertarDescripcion("DocumentosNotas", "nota")
    self.insertarDescripcion("DocumentosNotas", "tipoNota")
    self.insertarDescripcion("DocumentosNotas", "referencia")
    self.insertarDescripcion("DocumentosNotas", "fechaCreacion")
    self.insertarDescripcion("DocumentosNotas", "fechaHistorica")
    self.insertarDescripcion("DocumentosNotas", "fechaHistFormato")
    self.insertarDescripcion("DocumentosRefActividades", "referenciaID")
    self.insertarDescripcion("DocumentosRefActividades", "documentoID")
    self.insertarDescripcion("DocumentosRefActividades", "actividadID")
    self.insertarDescripcion("DocumentosRefActividades", "referencia")
    self.insertarDescripcion("DocumentosRefActividades", "comentario")
    self.insertarDescripcion("DocumentosRefEmbarcacion", "referenciaID")
    self.insertarDescripcion("DocumentosRefEmbarcacion", "documentoID")
    self.insertarDescripcion("DocumentosRefEmbarcacion", "embarcacionID")
    self.insertarDescripcion("DocumentosRefEmbarcacion", "referencia")
    self.insertarDescripcion("DocumentosRefEmbarcacion", "comentario")
    self.insertarDescripcion("DocumentosRefEventos", "referenciaID")
    self.insertarDescripcion("DocumentosRefEventos", "documentoID")
    self.insertarDescripcion("DocumentosRefEventos", "eventoID")
    self.insertarDescripcion("DocumentosRefEventos", "referencia")
    self.insertarDescripcion("DocumentosRefEventos", "comentario")
    self.insertarDescripcion("DocumentosRefInstituciones", "referenciaID")
    self.insertarDescripcion("DocumentosRefInstituciones", "documentoID")
    self.insertarDescripcion("DocumentosRefInstituciones", "institucionID")
    self.insertarDescripcion("DocumentosRefInstituciones", "referencia")
    self.insertarDescripcion("DocumentosRefInstituciones", "comentario")
    self.insertarDescripcion("DocumentosRefLugares", "referenciaID")
    self.insertarDescripcion("DocumentosRefLugares", "documentoID")
    self.insertarDescripcion("DocumentosRefLugares", "lugarID")
    self.insertarDescripcion("DocumentosRefLugares", "referencia")
    self.insertarDescripcion("DocumentosRefLugares", "comentarios")
    self.insertarDescripcion("DocumentosRefPersonajes", "referenciaID")
    self.insertarDescripcion("DocumentosRefPersonajes", "documentoID")
    self.insertarDescripcion("DocumentosRefPersonajes", "personajeID")
    self.insertarDescripcion("DocumentosRefPersonajes", "referencia")
    self.insertarDescripcion("DocumentosRefPersonajes", "comentarios")
    self.insertarDescripcion("DocumentosRefTerritorios", "referenciaID")
    self.insertarDescripcion("DocumentosRefTerritorios", "documentoID")
    self.insertarDescripcion("DocumentosRefTerritorios", "territorioID")
    self.insertarDescripcion("DocumentosRefTerritorios", "referencia")
    self.insertarDescripcion("DocumentosRefTerritorios", "comentario")
    self.insertarDescripcion("Embarcaciones", "embarcacionID")
    self.insertarDescripcion("Embarcaciones", "nombres")
    self.insertarDescripcion("Embarcaciones", "alias")
    self.insertarDescripcion("Embarcaciones", "categoria")
    self.insertarDescripcion("Embarcaciones", "usos")
    self.insertarDescripcion("Embarcaciones", "lugarConstruccion")
    self.insertarDescripcion("Embarcaciones", "territorioConstruccion")
    self.insertarDescripcion("Embarcaciones", "fechaConstruccion")
    self.insertarDescripcion("Embarcaciones", "fechaConstFormato")
    self.insertarDescripcion("Embarcaciones", "lugarDesercion")
    self.insertarDescripcion("Embarcaciones", "territorioDisercion")
    self.insertarDescripcion("Embarcaciones", "fechaDesercion")
    self.insertarDescripcion("Embarcaciones", "fechaDesercionFormato")
    self.insertarDescripcion("Embarcaciones", "razonDesercion")
    self.insertarDescripcion("Embarcaciones", "manga")
    self.insertarDescripcion("Embarcaciones", "eslora")
    self.insertarDescripcion("Embarcaciones", "puntal")
    self.insertarDescripcion("Embarcaciones", "calado")
    self.insertarDescripcion("Embarcaciones", "capacidadCarga")
    self.insertarDescripcion("Embarcaciones", "capacidadUnidades")
    self.insertarDescripcion("Embarcaciones", "tipo")
    self.insertarDescripcion("EmbarcacionesBanderas", "embarcacionesBanderasID")
    self.insertarDescripcion("EmbarcacionesBanderas", "embarcacionID")
    self.insertarDescripcion("EmbarcacionesBanderas", "bandera")
    self.insertarDescripcion("EmbarcacionesBanderas", "fechaInicio")
    self.insertarDescripcion("EmbarcacionesBanderas", "fechaInicialFormato")
    self.insertarDescripcion("EmbarcacionesBanderas", "fechaFinal")
    self.insertarDescripcion("EmbarcacionesBanderas", "fechaFinalFormato")
    self.insertarDescripcion("EmbarcacionesElementos", "elementoID")
    self.insertarDescripcion("EmbarcacionesElementos", "embarcacionID")
    self.insertarDescripcion("EmbarcacionesElementos", "categoria")
    self.insertarDescripcion("EmbarcacionesElementos", "descripcion")
    self.insertarDescripcion("EmbarcacionesElementos", "cantidad")
    self.insertarDescripcion("EmbarcacionesElementos", "unidades")
    self.insertarDescripcion("EmbarcacionesElementos", "fechaAdicion")
    self.insertarDescripcion("EmbarcacionesElementos", "fechaAdicionFormato")
    self.insertarDescripcion("EmbarcacionesElementos", "fechaRemocion")
    self.insertarDescripcion("EmbarcacionesElementos", "fechaRemocionFormato")
    self.insertarDescripcion("EmbarcacionesNotas", "notaID")
    self.insertarDescripcion("EmbarcacionesNotas", "embarcacionID")
    self.insertarDescripcion("EmbarcacionesNotas", "nota")
    self.insertarDescripcion("EmbarcacionesNotas", "referencia")
    self.insertarDescripcion("EmbarcacionesNotas", "fechaCreacion")
    self.insertarDescripcion("EmbarcacionesNotas", "fechaHistorica")
    self.insertarDescripcion("EmbarcacionesNotas", "fechaHistFormato")
    self.insertarDescripcion("EmbarcacionesReparaciones", "reparacionID")
    self.insertarDescripcion("EmbarcacionesReparaciones", "embarcacionID")
    self.insertarDescripcion("EmbarcacionesReparaciones", "fecha")
    self.insertarDescripcion("EmbarcacionesReparaciones", "lugar")
    self.insertarDescripcion("EmbarcacionesReparaciones", "notaReparacion")
    self.insertarDescripcion("EmbarcacionesRutas", "rutaID")
    self.insertarDescripcion("EmbarcacionesRutas", "embarcacionID")
    self.insertarDescripcion("EmbarcacionesRutas", "fechaSalida")
    self.insertarDescripcion("EmbarcacionesRutas", "fechaSalidaFormato")
    self.insertarDescripcion("EmbarcacionesRutas", "territorioSalidaID")
    self.insertarDescripcion("EmbarcacionesRutas", "lugarSalidaID")
    self.insertarDescripcion("EmbarcacionesRutas", "fechaLlegada")
    self.insertarDescripcion("EmbarcacionesRutas", "fechaLlegadaFormato")
    self.insertarDescripcion("EmbarcacionesRutas", "territorioLlegadaID")
    self.insertarDescripcion("EmbarcacionesRutas", "lugarLlegadaID")
    self.insertarDescripcion("EmbarcacionesRutas", "descripcion")
    self.insertarDescripcion("EmbarcacionesRutasBitacora", "entradaID")
    self.insertarDescripcion("EmbarcacionesRutasBitacora", "rutaID")
    self.insertarDescripcion("EmbarcacionesRutasBitacora", "fecha")
    self.insertarDescripcion("EmbarcacionesRutasBitacora", "fechaFormato")
    self.insertarDescripcion("EmbarcacionesRutasBitacora", "anotacion")
    self.insertarDescripcion("EmbarcacionesRutasCarga", "cargaID")
    self.insertarDescripcion("EmbarcacionesRutasCarga", "rutaID")
    self.insertarDescripcion("EmbarcacionesRutasCarga", "carga")
    self.insertarDescripcion("EmbarcacionesRutasCarga", "cantidad")
    self.insertarDescripcion("EmbarcacionesRutasCarga", "unidades")
    self.insertarDescripcion("EmbarcacionesRutasCarga", "descripcion")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "escalaID")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "rutaID")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "territorioEscalaID")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "lugarEscalaID")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "fechaLlegada")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "fechaLlegadaFormato")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "fechaSalida")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "fechaSalidaFormato")
    self.insertarDescripcion("EmbarcacionesRutasEscalas", "descripcion")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "notaID")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "rutaID")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "nota")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "fechaCreacion")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "fechaHistorica")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "fechaHistFormato")
    self.insertarDescripcion("EmbarcacionesRutasNotas", "referencia")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "personalID")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "RutaID")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "personajeID")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "cargo")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "categoria")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "fechaInicio")
    self.insertarDescripcion("EmbarcacionesRutasPersonal", "fechaFin")
    self.insertarDescripcion("EmbarcacionesRutasPersonalAnonimo", "personalID")
    self.insertarDescripcion("EmbarcacionesRutasPersonalAnonimo", "RutaID")
    self.insertarDescripcion("EmbarcacionesRutasPersonalAnonimo", "tipoPersonal")
    self.insertarDescripcion("EmbarcacionesRutasPersonalAnonimo", "categoria")
    self.insertarDescripcion("EmbarcacionesRutasPersonalAnonimo", "cantidad")
    self.insertarDescripcion("EmbarcacionesRutasPersonalAnonimo", "notas")
    self.insertarDescripcion("Eventos", "eventoID")
    self.insertarDescripcion("Eventos", "fecha")
    self.insertarDescripcion("Eventos", "fechaFormato")
    self.insertarDescripcion("Eventos", "lugarEventoID")
    self.insertarDescripcion("Eventos", "territorioEventoID")
    self.insertarDescripcion("Eventos", "descripcion")
    self.insertarDescripcion("Eventos", "categoriaEvento")
    self.insertarDescripcion("Eventos", "categoriaDocumentacion")
    self.insertarDescripcion("EventosNotas", "notaID")
    self.insertarDescripcion("EventosNotas", "eventoID")
    self.insertarDescripcion("EventosNotas", "nota")
    self.insertarDescripcion("EventosNotas", "referencia")
    self.insertarDescripcion("EventosNotas", "fechaCreacion")
    self.insertarDescripcion("EventosNotas", "fechaHistorica")
    self.insertarDescripcion("EventosNotas", "fechaHistoricaFormato")
    self.insertarDescripcion("Instituciones", "institucionID")
    self.insertarDescripcion("Instituciones", "nombre")
    self.insertarDescripcion("Instituciones", "tipoInstitucion")
    self.insertarDescripcion("Instituciones", "fechaCreacion")
    self.insertarDescripcion("Instituciones", "fechaCreacionFormato")
    self.insertarDescripcion("Instituciones", "fechaTerminacion")
    self.insertarDescripcion("Instituciones", "fechaTerminacionFormato")
    self.insertarDescripcion("Instituciones", "categoria")
    self.insertarDescripcion("Instituciones", "LugarID")
    self.insertarDescripcion("Instituciones", "territorioID")
    self.insertarDescripcion("Instituciones", "funciones")
    self.insertarDescripcion("InstitucionesFuncionarios", "funcionID")
    self.insertarDescripcion("InstitucionesFuncionarios", "institucionID")
    self.insertarDescripcion("InstitucionesFuncionarios", "nombreFuncionario")
    self.insertarDescripcion("InstitucionesFuncionarios", "dependencia")
    self.insertarDescripcion("InstitucionesFuncionarios", "cantidadFuncionarios")
    self.insertarDescripcion("InstitucionesFuncionarios", "funciones")
    self.insertarDescripcion("InstitucionesPersonajes", "empleoID")
    self.insertarDescripcion("InstitucionesPersonajes", "institucionID")
    self.insertarDescripcion("InstitucionesPersonajes", "personajeID")
    self.insertarDescripcion("InstitucionesPersonajes", "funcionarioID")
    self.insertarDescripcion("InstitucionesPersonajes", "fechaInicial")
    self.insertarDescripcion("InstitucionesPersonajes", "tipoEmpleo")
    self.insertarDescripcion("InstitucionesPersonajes", "fechaInicialFormato")
    self.insertarDescripcion("InstitucionesPersonajes", "fechaFinal")
    self.insertarDescripcion("InstitucionesPersonajes", "fechaFinalFormato")
    self.insertarDescripcion("InstitucionesPersonajes", "salario")
    self.insertarDescripcion("InstitucionesPersonajes", "salarioUnidades")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "notaID")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "empleoID")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "nota")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "referencia")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "fechaCreacion")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "fechaHistorica")
    self.insertarDescripcion("InstitucionesPersonajesNotas", "fechaHistFormato")
    self.insertarDescripcion("Lugares", "lugarID")
    self.insertarDescripcion("Lugares", "nombre")
    self.insertarDescripcion("Lugares", "tipoLugar")
    self.insertarDescripcion("Lugares", "categoria")
    self.insertarDescripcion("Lugares", "coordenadas")
    self.insertarDescripcion("Lugares", "fechaInicial")
    self.insertarDescripcion("Lugares", "fechaInicialFormato")
    self.insertarDescripcion("Lugares", "fechaFinal")
    self.insertarDescripcion("Lugares", "fechaFinalFormato")
    self.insertarDescripcion("LugaresActividades", "actividadID")
    self.insertarDescripcion("LugaresActividades", "lugarID")
    self.insertarDescripcion("LugaresActividades", "actividad")
    self.insertarDescripcion("LugaresActividades", "referencia")
    self.insertarDescripcion("LugaresActividades", "fechaInicial")
    self.insertarDescripcion("LugaresActividades", "fechaInicialFormato")
    self.insertarDescripcion("LugaresActividades", "fechaFinal")
    self.insertarDescripcion("LugaresActividades", "fechaFinalFormato")
    self.insertarDescripcion("LugaresNotas", "notaID")
    self.insertarDescripcion("LugaresNotas", "lugarID")
    self.insertarDescripcion("LugaresNotas", "nota")
    self.insertarDescripcion("LugaresNotas", "fechaCreacion")
    self.insertarDescripcion("LugaresNotas", "fechaHistorica")
    self.insertarDescripcion("LugaresNotas", "fechaHistoricaFormato")
    self.insertarDescripcion("LugaresNotas", "referencia")
    self.insertarDescripcion("Personajes", "personajeID")
    self.insertarDescripcion("Personajes", "titulo")
    self.insertarDescripcion("Personajes", "nombre")
    self.insertarDescripcion("Personajes", "ocupacion")
    self.insertarDescripcion("Personajes", "nacionalidad")
    self.insertarDescripcion("Personajes", "categoria")
    self.insertarDescripcion("Personajes", "lugarNacimiento")
    self.insertarDescripcion("Personajes", "Edad")
    self.insertarDescripcion("Personajes", "sexo")
    self.insertarDescripcion("Personajes", "fechaNacimiento")
    self.insertarDescripcion("Personajes", "fechaNacimientoFormato")
    self.insertarDescripcion("Personajes", "fechaFallecimiento")
    self.insertarDescripcion("Personajes", "fechaFallecimientoFormato")
    self.insertarDescripcion("Personajes", "lugarFallecimiento")
    self.insertarDescripcion("Personajes", "enfermedades")
    self.insertarDescripcion("Personajes", "imagenPerfil")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "comisionTrabajoID")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "personajeID")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "comisionTrabajo")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "fechaInicio")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "fechaInicialFormato")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "fechaFinal")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "fechaFinalFormato")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "lugarID")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "territorioID")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "institucionID")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "SolicitorPersonajeID")
    self.insertarDescripcion("PersonajesComisionesTrabajos", "InformacionAddicional")
    self.insertarDescripcion("PersonajesNotas", "notaID")
    self.insertarDescripcion("PersonajesNotas", "personajeID")
    self.insertarDescripcion("PersonajesNotas", "nota")
    self.insertarDescripcion("PersonajesNotas", "fechaCreacion")
    self.insertarDescripcion("PersonajesNotas", "fechaHistorica")
    self.insertarDescripcion("PersonajesNotas", "fechaHistFormato")
    self.insertarDescripcion("PersonajesNotas", "referencia")
    self.insertarDescripcion("PersonajesParentescos", "parentescoID")
    self.insertarDescripcion("PersonajesParentescos", "egoID")
    self.insertarDescripcion("PersonajesParentescos", "parienteID")
    self.insertarDescripcion("PersonajesParentescos", "parentesco")
    self.insertarDescripcion("Territorios", "territorioID")
    self.insertarDescripcion("Territorios", "territorioSuperior")
    self.insertarDescripcion("Territorios", "tipoTerritorio")
    self.insertarDescripcion("Territorios", "nombre")
    self.insertarDescripcion("Territorios", "otrosNombres")
    self.insertarDescripcion("Territorios", "clima")
    self.insertarDescripcion("Territorios", "recursos")
    self.insertarDescripcion("Territorios", "fechaInicial")
    self.insertarDescripcion("Territorios", "fechaInicialFormato")
    self.insertarDescripcion("Territorios", "fechaFinal")
    self.insertarDescripcion("Territorios", "fechaFinalFormato")
    self.insertarDescripcion("TerritoriosCartografia", "cartografiaID")
    self.insertarDescripcion("TerritoriosCartografia", "territorioID")
    self.insertarDescripcion("TerritoriosCartografia", "limiteNorte")
    self.insertarDescripcion("TerritoriosCartografia", "limiteSur")
    self.insertarDescripcion("TerritoriosCartografia", "limiteOriente")
    self.insertarDescripcion("TerritoriosCartografia", "limiteOccidente")
    self.insertarDescripcion("TerritoriosCartografia", "limiteNororiente")
    self.insertarDescripcion("TerritoriosCartografia", "limiteNoroccidente")
    self.insertarDescripcion("TerritoriosCartografia", "limiteSuroriente")
    self.insertarDescripcion("TerritoriosCartografia", "limiteSuroccidente")
    self.insertarDescripcion("TerritoriosCartografia", "map")
    self.insertarDescripcion("TerritoriosCartografia", "fechaInicio")
    self.insertarDescripcion("TerritoriosCartografia", "fechaInicioFormato")
    self.insertarDescripcion("TerritoriosCartografia", "fechaFin")
    self.insertarDescripcion("TerritoriosCartografia", "fechaFinFormato")
    self.insertarDescripcion("TerritoriosGeografia", "geografiaID")
    self.insertarDescripcion("TerritoriosGeografia", "territorioID")
    self.insertarDescripcion("TerritoriosGeografia", "nombre")
    self.insertarDescripcion("TerritoriosGeografia", "tipoGeografia")
    self.insertarDescripcion("TerritoriosGeografia", "coordenadas")
    self.insertarDescripcion("TerritoriosGeografia", "mapa")
    self.insertarDescripcion("TerritoriosNotas", "notaID")
    self.insertarDescripcion("TerritoriosNotas", "territorioID")
    self.insertarDescripcion("TerritoriosNotas", "nota")
    self.insertarDescripcion("TerritoriosNotas", "referencia")
    self.insertarDescripcion("TerritoriosNotas", "fechaCreacion")
    self.insertarDescripcion("TerritoriosNotas", "fechaHistorica")
    self.insertarDescripcion("TerritoriosNotas", "fechaHistFormato")
    self.insertarDescripcion("TerritoriosPoblacion", "territorioPoblacionID")
    self.insertarDescripcion("TerritoriosPoblacion", "territorioID")
    self.insertarDescripcion("TerritoriosPoblacion", "NombrePoblacion")
    self.insertarDescripcion("TerritoriosPoblacion", "cantidad")
    self.insertarDescripcion("TerritoriosPoblacion", "fechaDato")
    self.insertarDescripcion("TerritoriosPoblacion", "fechaDatoFormato")
    self.insertarDescripcion("TerritoriosVecinos", "relacionID")
    self.insertarDescripcion("TerritoriosVecinos", "primerTerritorioID")
    self.insertarDescripcion("TerritoriosVecinos", "segundoTerritorioID")
    self.insertarDescripcion("TerritoriosViasComunicacion", "viasComunicacionID")
    self.insertarDescripcion("TerritoriosViasComunicacion", "territorioID")
    self.insertarDescripcion("TerritoriosViasComunicacion", "nombre")
    self.insertarDescripcion("TerritoriosViasComunicacion", "tipoVia")
    self.insertarDescripcion("TerritoriosViasComunicacion", "coordenadas")
    self.insertarDescripcion("TerritoriosViasComunicacion", "mapa")
    
  
  """ Permite insertar el nombre de una tabla"""
  def insertarTabla(self, nuevasTablas):
    if isinstance(nuevasTablas,list):
      self.tablas.extend(nuevasTablas)
    elif isinstance(nuevasTablas, str):
      self.tablas.append(nuevasTablas)
    else:
      print_err("ERROR parametro nuevasTablas invalido")
    
  
  """ Permite insertar los campos de una tabla"""
  def insertarDescripcion(self, nombreBD, elemento):
    if nombreBD in self.tablas:
      if isinstance(elemento, str):
        if nombreBD not in self.descripcionTablas:
          self.descripcionTablas[nombreBD] = [] 
        self.descripcionTablas[nombreBD].append(elemento)
      else:
        print_err("ERROR parametro elemento es invalido")
    else:
      print_err("ERROR La tabla no existe")
      
      
  
  """ Permite insertar la llave primaria de una talba"""
  def insertarIdPrincipalTabla(self, nombreTabla, nombreID):
    if nombreTabla in self.tablas:
      if isinstance(nombreID, str):
        self.idPorTabla[nombreTabla] = nombreID
      else:
        print_err("ERROR parametro nombrID invalido")
    else:
      print_err("ERROR La tabla no existe")
        
  
  """ Permite obtener todos los campos de la tabla"""
  def obtenerCamposTabla(self, tablaNombre):
    if tablaNombre in self.tablas:
      return self.descripcionTablas[tablaNombre]
    else:
      print_err("ERROR La tabla no existe")
      return None
  
  
  """ Permite revisar si una tabla existe"""
  def tablaExiste(self, tablaNombre):
    if isinstance(tablaNombre, str):
      if tablaNombre in self.tablas:
        return True
      else:
        return False
    else:
      print_err("ERROR, tabla nombre no es un string")
      return None
  
  """ Permite revisar si una tabla cuenta con el campoNombre"""
  def campoExisteEnTabla(self, tablaNombre, campoNombre):
    if tablaNombre in self.tablas:
      if campoNombre in self.descripcionTablas[tablaNombre]:
        return True
      else:
        return False
    else:
      return False
  
  """ Permite obtener el ID de una tabla"""
  def obtenerTablaId(self, tablaNombre):
    if tablaNombre in self.tablas:
      if tablaNombre in self.idPorTabla:
        return self.idPorTabla[tablaNombre]
      else:
        print_err("ERROR La tabla no existe en idPorTabla")
        return None
    else:
      print_err("ERROR La tabla no existe")
      return None

pimcBD = bd_descripcion()
