# PATRIMONIO INMATERIAL MARÍTIMO COLOMBIANO

Visita nuestra página en www.monsalvediaz.com/PIMC

Usando [Bootstrap](getbootstrap.com/) con el tema [Flatly](https://bootswatch.com/flatly/).

## Utlidades: 

- [Gulp](http://gulpjs.com/)
- [Sass](http://sass-lang.com/guide/)
- [CSSnano](https://github.com/ben-eb/cssnano)

NOTA: Estas utilidades solo se requieren si se desea editar el CSS. 

### Para instalarlas: 

1. Instalar [Node.js](https://nodejs.org/es/). Se recomienda usar [NVM](https://github.com/creationix/nvm) para instalar, manejar versiones y evitar dolores de cabeza.

2. Instalar gulp: `$ npm install gulp -g`

3. `$ cd PIMC/ && npm install` 

4. Para compilar CSS, ingresar en una terminal a la carpeta raíz del proyecto (donde está el archivo gulpfile.js) y ejecutar: `$ gulp`. 
La herramienta vigilará los cambios realizados en archivos Sass, html y javascript, compilará el css automáticamente y recargará la aplicación automáticamente al hacer cualquier cambio en estos tipos de archivos. Para salir, terminar la tarea con `Ctrl + C`.

6. También se puede compilar manualmente, previamente instalado [Sass](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#using_sass) (ver enlace para más detalles).

