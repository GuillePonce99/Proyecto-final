<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">PROYECTO FINAL ECOMMERCE - CODERHOUSE</h1>

  <p align="center">
    Proyecto de backend - Ecommerce - Coderhouse!
    <br />
    <a href="https://github.com/GuillePonce99/Proyecto-final"><strong>Documentacion »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenido</summary>
  <ol>
    <li>
      <a href="#intalacion">Instalacion</a>
      <ul>
        <li><a href="#requisitos">Requisitos</a></li>
      </ul>
    </li>
    <li><a href="#Estructura">Estructura</a></li>
    <li><a href="#variables">Variables</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## Instalacion

Pasos para clonar e instalar el proyecto:

- Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/GuillePonce99/Proyecto-final
```

- Navega al directorio del proyecto:

```bash
cd Proyecto-final
```

- Instala las dependencias del proyecto ejecutando el siguiente comando:

```bash
npm install
```

- Configura la conexión a la base de datos MongoDB y todas las variables de entorno. (Ver [Variables de entorno](#env))

- Asegúrate de tener MongoDB en ejecución , la URL de conexión correcta y todas las variables de entorno configuradas.

- Inicia la aplicación con el siguiente comando:

```bash
npm start
```

Esto iniciará el servidor Node.js y estará escuchando en el puerto especificado en el archivo `.env`.

- Accede a la aplicación en tu navegador web ingresando la siguiente URL:

```
http://localhost:<PORT>
```

Asegúrate de reemplazar `<PORT>` con el número de puerto especificado en el archivo `.env`.

- Ahora podrás utilizar la vista de Login en la aplicación.


## Estructura

El proyecto sigue la siguiente estructura de directorios:

- `src/controllers`: Capa de controlador.

- `src/config`: Configuración de la aplicación.

- `src/dao`: Configuración de persistencia de datos.

- `src/img`: Imagenes utilizadas para la creacion HTML de nodemailer.

- `src/docs`: Documentación.

- `public`: Archivos públicos de la aplicación, como estilos CSS, imágenes y scripts JavaScript.

- `src/repositories`: Capas de acceso de datos.

- `src/routes`: Definición de rutas de la aplicación.

- `src/utils`: Archivos relacionados con la configuración de las utilidades reutilizables.

- `src/views`: Todas las vistas del proyecto.

- `test/supertest`: Test de funcionalidades.

- `src/app.js`: Punto de entrada principal para la ejecución de la aplicación.

- `errors.log`: Registro de errores.

## Variables de entorno <a name="env"></a>

| Variable               | Descripción                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `PORT`                 | Puerto de la aplicación. Valores sugeridos: [8080, 3000]      |
| `COOKIE_KEY`           | Nombre de la cookie key.                                      |
| `GITHUB_CLIENT_ID`     | ID de cliente de API de autenticación de Github.              |
| `GITHUB_CLIENT_SECRET` | Clave o secreto de API de autenticación de Github.            |
| `GITHUB_CALLBACK_URL`  | URL de devolución de llamada de Github.                       |
| `MAILER_SERVICE`       | Tipo de servicio utilizado para correo electronico.           |
| `MAILER_USER`          | Usuario de Nodemailer para correo electrónico.                |
| `MAILER_PASSWORD`      | Usuario utilizado para realizar la conexion a mongo Atlas.    |
| `MONGO_PASSWORD`       | Contraseña utilizado para realizar la conexion a mongo Atlas. |
| `MONGO_USER`           | Usuario utilizado para realizar la conexion a mongo Atlas.    |
| `MONGO_URI`            | URL de conexión a MongoDB para entorno de producción (Atlas). |
| `MONGO_DB`             | Nombre de la base de datos en MongoDB.                        |
| `MP_ACCESS_TOKEN`      | Clave de acceso (api) de MercadoPago.                         |
| `ADMIN_EMAIL`          | Email de admin utilizado para la gestion de usuarios.         |
| `ADMIN_PASSWORD`       | Contraseña de admin utilizado para la gestion de usuarios.    |

El proyecto cuenta con un archivo llamado .env.example con todas las definiciones de las variables de entorno para ser customizadas. Luego de completar la información se deben guardar tres archivos con los siguientes nombres:

- .env.dev (desarrollo)
- .env.prod (producción)

## Requisitos

Asegúrate de tener los siguientes requisitos instalados en tu entorno de desarrollo:

- Node.js
- MongoDB


## Configuración del Entorno y Persistencia de datos.

- El servidor se configura utilizando el gestor de comandos Commander para especificar el ambiente de ejecución y el tipo de persistencia.

- Los ejemplos de comandos disponibles son:

  ```bash
  node .src/app.js -n or -persistence <option> // MONGO or MEMORY
  ```

  ```bash
  node .src/app.js -p or --port <port> 
  ```

  ```bash
  node .src/app.js -e or --environment <environment> // DEV,PROD or PRODUCTION

  ```



### Credenciales de Admin :

#### Email:

```
admin@coder.com
```

#### Password:

```
admin
```


## Testing

Realización de módulos de testing para el proyecto principal.
Incluye 3 (tres) tests desarrollados para:

- Router de products.
- Router de carts.
- Router de sessions.

<small>Directorio/s de referencia</small>

- `/test/supertest.test.js`: Configuración del supertest.


### Comando para ejecutar el test:

```bash
npm test
```

## Enlace al sitio activo

- [Deploy en Railway](https://proyecto-final-backend-production-33d4.up.railway.app/) (Funcionalidad Front-end básica)

