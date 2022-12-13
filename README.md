# APP SICAAL

### Como usar la APP web de Sicaal:

1.-Como primer paso, se deberá instalar Node JS, junto con MySQL.

2.-Clonar el repositorio GitHub.

```git clone https://github.com/PanchoCornejo/SICAAL.git  ```

Una vez clonado, ingresar a la carpeta SICAAL e ingresar el siguiente comando

```npm i  ```

Dicho comando, instalará las dependecias necesarias para su correcto funcionamiento.

3.-Crear base de datos, para esto entratas en la Carpeta database->sicaal_db.sql la cual se copiara el codigo en Mysql y pegara para crear manualmente la base de datos.

4.-Para modificar la contraseña de ingreso a la base de datos primero deberan entrar en los siguientes archivos para cambiar el usuario y contraseña para poder ingresar a la base de datos desde el programa: src/views/keys.js y src/views/database.js , donde se cambia por tu usuario y contraseña correspondiente.

![Cambiar Usuario y Constraseña](https://cdn.discordapp.com/attachments/1011352576932970546/1051016264937648179/image.png)

5.- Luego la App estara lista para ejecutarse por primera vez utilizando el comando:

```npm run dev ```

6.- Para poder tener la primera cuenta de Administrador , que es la cual crea las demas cuentas de proveedores y admins deberas entrar dentro de la ruta de  ```localhost:4000/signup```  o ```sicaal.cl/signup``` a la cual no podran acceder ya que esta bloqueada a solo usuarios de rol "Administrador" por lo cual debemos ver el siguiente paso.

7.- Dentro del codigo entraremos a src\routes\authentication.js donde buscaremos el metodo Get y Post de la ruta /signup, en la cual quitaremos el requisito de si esadministrador lo cual veremos como "siadmin". 


![Quitar isAdmin](https://media.discordapp.net/attachments/1011352576932970546/1051017926989336616/image.png)

8.- Crearemos una cuenta de Administrador.


![Crear cuenta Admin](https://cdn.discordapp.com/attachments/1011352576932970546/1051018465118519377/image.png)

9.- Restableceremos en src\routes\authentication.js la condicion de si es ADMINISTRADOR ya que sin esta tendremos problemas de vulnerabiliad dentro de nuestra app WEB

10.- Listo! Nuestra APP esta listo para ser usada

### Te Invitamos a ver los videos tutoriales de como utilizar la APP WEB con los distintos perfiles de:

#### Administrador:


#### Proveedores:


#### Clientes:


