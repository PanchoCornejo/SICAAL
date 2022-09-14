CREATE DATABASE sicaal_db;

USE sicaal_db;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

INSERT INTO users (id, username, password, fullname, rol) 
  VALUES (1, 'kiwix', 'kiwix', 'Pancho Cornejo', 'Admin');

SELECT * FROM users;

-- Tabla de Proveedores
CREATE TABLE proveedor (
  id INT(11) NOT NULL,
  user_id INT(11),
  fono VARCHAR(25) NOT NULL,
  razon_social VARCHAR(50) NOT NULL,
  rut INT(11) NOT NULL,
  giro VARCHAR(50) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(100),
  anos_servicio INT(11) NOT NULL,
  proyectos_ejecutados INT(11) NOT NULL,
  description TEXT,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE proveedor
  ADD PRIMARY KEY (id);

ALTER TABLE proveedor
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

-- Tabla de Roles
CREATE TABLE rol (
  id INT(11) NOT NULL,
  user_id INT(11),
  nombre VARCHAR(25) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_userR FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE rol
  ADD PRIMARY KEY (id);

ALTER TABLE rol
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 

-- Tabla de Servicios
CREATE TABLE servicios (
  id INT(11) NOT NULL,
  user_id INT(11),
  proveedor_id INT(11),
  nombre VARCHAR(50) NOT NULL,
  marca VARCHAR(50) NOT NULL,
  ano INT(11) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  horometro VARCHAR(100) NOT NULL,
  operador VARCHAR(5) NOT NULL,
  region VARCHAR(50) NOT NULL,
  ciudades VARCHAR(255) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  description TEXT,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_userS FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT fk_proveedor FOREIGN KEY(proveedor_id) REFERENCES proveedor(id)
);

ALTER TABLE servicios
  ADD PRIMARY KEY (id);

ALTER TABLE servicios
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 

-- Tabla de Valoraciones
CREATE TABLE valoraciones (
  id INT(11) NOT NULL,
  servicio_id INT(11),
  valoracion INT(5) NOT NULL,
  description TEXT,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_servicio FOREIGN KEY(servicio_id) REFERENCES servicios(id)
);

ALTER TABLE valoraciones
  ADD PRIMARY KEY (id);

ALTER TABLE valoraciones
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 

-- Tabla de Solicitudes
CREATE TABLE solicitudes (
  id INT(11) NOT NULL,
  servicio_id INT(11),
  estado VARCHAR(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_servicioS FOREIGN KEY(servicio_id) REFERENCES servicios(id)
);

ALTER TABLE solicitudes
  ADD PRIMARY KEY (id);

ALTER TABLE solicitudes
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 

DESCRIBE proveedor;
DESCRIBE rol;
DESCRIBE valoraciones;
DESCRIBE servicios;
DESCRIBE solicitudes;