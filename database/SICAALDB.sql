CREATE DATABASE sicaal_db;

USE sicaal_db;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  rol VARCHAR(20) DEFAULT 'Cliente' NOT NULL
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
  rut VARCHAR(15) NOT NULL,
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
  estado VARCHAR(50) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  description TEXT,
  dominio_de_la_maquina VARCHAR(100),
  revision_tecnica VARCHAR(100),
  permiso_de_circulacion VARCHAR(100),
  seguro VARCHAR(100),
  documentacion_operador VARCHAR(100),
  foto VARCHAR(100),
  estado_publicacion VARCHAR(10),
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
  Voperador INT (5),
  Vpuntualidad INT (5) NOT NULL,
  Vexperiencia INT (5) NOT NULL,
  Vfallas INT (5) NOT NULL,
  Vestadomaquina INT (5) NOT NULL,
  description TEXT,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_servicio FOREIGN KEY(servicio_id) REFERENCES servicios(id)
);

ALTER TABLE valoraciones
  ADD PRIMARY KEY (id);

ALTER TABLE valoraciones
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 



DESCRIBE proveedor;
DESCRIBE rol;
DESCRIBE valoraciones;
DESCRIBE servicios;

-- Proveedor de prueba
-- insert INTO proveedor (user_id, fono, razon_social, rut, giro, direccion, ubicacion, anos_servicio, proyectos_ejecutados, description) VALUES (4,'+5693333', 'RAZONSOCIAL', 111111111, 'GIRO', 'DIRECCION', 'UBICACION?', 11, 400, 'DKSLFJKDSJFKLDSJFKLSDJFKDSJKL' );
 


--Base de Datos para las regiones y comunas de Chile, y tambien puede ser de otros paises.

 CREATE TABLE `countries` (
  `id_country` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_country`)
);

-- Insertamos a Chile dentro de la tabla. El ID es autoincremental entonces no hace falta especificarlo en el insert.

INSERT INTO `countries`
  (`name`)
VALUES
  ('Chile');
  
-- Creamos la tabla de regiones.

CREATE TABLE `regions` (
  `id_region` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_country` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_region`),
  KEY `FK_regions_countries` (`id_country`),
  CONSTRAINT `FK_regions_countries` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`)
);

-- Insertamos las regiones en el país. Recortemos que el ID de la región es autoincremental.

INSERT INTO `regions`
  (`id_country`,`name`)
VALUES
  ('1','Región de Arica y Parinacota'),
  ('1','Región de Tarapacá'),
  ('1','Región de Antofagasta'),
  ('1','Región de Atacama'),
  ('1','Región de Coquimbo'),
  ('1','Región de Valparaíso'),
  ('1','Región Metropolitana de Santiago'),
  ('1',"Región del Libertador General Bernardo O'Higgins"),
  ('1','Región del Maule'),
  ('1','Región de Ñuble'),
  ('1','Región del Biobío'),
  ('1','Región de La Araucanía'),
  ('1','Región de Los Ríos'),
  ('1','Región de Los Lagos'),
  ('1','Región Aysén del General Carlos Ibáñez del Campo'),
  ('1','Región de Magallanes y de la Antártica Chilena');
  
  -- Finalmente, creamos nuestra tabla de ciudades. La llamaremos de este modo y no "comunas" porque estamos modelando de forma genérica.
  
  CREATE TABLE `cities` (
  `id_city` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_region` int(10) unsigned NOT NULL,
  `id_country` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_city`),
  KEY `FK_cities_regions` (`id_region`),
  KEY `FK_cities_countries` (`id_country`),
  CONSTRAINT `FK_cities_countries` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`),
  CONSTRAINT `FK_cities_regions` FOREIGN KEY (`id_region`) REFERENCES `regions` (`id_region`)
) ;

-- Poblamos nuestra tabla con las comunas, las cuales son 346. 
-- Recordemos que el ID de la comuna es autoincremental, y el ID de la región también entonces asumimos que se ha insertado secuencialmente en el paso anterior.

INSERT INTO `cities`
  (`name`,`id_region`,`id_country`)
VALUES
	("Arica","1","1"),
	("Camarones","1","1"),
	("Putre","1","1"),
	("General Lagos","1","1"),
	("Iquique","2","1"),
	("Alto Hospicio","2","1"),
	("Pozo Almonte","2","1"),
	("Camiña","2","1"),
	("Colchane","2","1"),
	("Huara","2","1"),
	("Pica","2","1"),
	("Antofagasta","3","1"),
	("Mejillones","3","1"),
	("Sierra Gorda","3","1"),
	("Taltal","3","1"),
	("Calama","3","1"),
	("Ollagüe","3","1"),
	("San Pedro de Atacama","3","1"),
	("Tocopilla","3","1"),
	("María Elena","3","1"),
	("Copiapó","4","1"),
	("Caldera","4","1"),
	("Tierra Amarilla","4","1"),
	("Chañaral","4","1"),
	("Diego de Almagro","4","1"),
	("Vallenar","4","1"),
	("Alto del Carmen","4","1"),
	("Freirina","4","1"),
	("Huasco","4","1"),
	("La Serena","5","1"),
	("Coquimbo","5","1"),
	("Andacollo","5","1"),
	("La Higuera","5","1"),
	("Paihuano","5","1"),
	("Vicuña","5","1"),
	("Illapel","5","1"),
	("Canela","5","1"),
	("Los Vilos","5","1"),
	("Salamanca","5","1"),
	("Ovalle","5","1"),
	("Combarbalá","5","1"),
	("Monte Patria","5","1"),
	("Punitaqui","5","1"),
	("Río Hurtado","5","1"),
	("Valparaíso","6","1"),
	("Casablanca","6","1"),
	("Concón","6","1"),
	("Juan Fernández","6","1"),
	("Puchuncaví","6","1"),
	("Quintero","6","1"),
	("Viña del Mar","6","1"),
	("Isla de Pascua","6","1"),
	("Los Andes","6","1"),
	("Calle Larga","6","1"),
	("Rinconada","6","1"),
	("San Esteban","6","1"),
	("La Ligua","6","1"),
	("Cabildo","6","1"),
	("Papudo","6","1"),
	("Petorca","6","1"),
	("Zapallar","6","1"),
	("Quillota","6","1"),
	("La Calera","6","1"),
	("Hijuelas","6","1"),
	("La Cruz","6","1"),
	("Nogales","6","1"),
	("San Antonio","6","1"),
	("Algarrobo","6","1"),
	("Cartagena","6","1"),
	("El Quisco","6","1"),
	("El Tabo","6","1"),
	("Santo Domingo","6","1"),
	("San Felipe","6","1"),
	("Catemu","6","1"),
	("Llay-Llay","6","1"),
	("Panquehue","6","1"),
	("Putaendo","6","1"),
	("Santa María","6","1"),
	("Quilpué","6","1"),
	("Limache","6","1"),
	("Olmué","6","1"),
	("Villa Alemana","6","1"),
	("Rancagua","8","1"),
	("Codegua","8","1"),
	("Coinco","8","1"),
	("Coltauco","8","1"),
	("Doñihue","8","1"),
	("Graneros","8","1"),
	("Las Cabras","8","1"),
	("Machalí","8","1"),
	("Malloa","8","1"),
	("Mostazal","8","1"),
	("Olivar","8","1"),
	("Peumo","8","1"),
	("Pichidegua","8","1"),
	("Quinta de Tilcoco","8","1"),
	("Rengo","8","1"),
	("Requínoa","8","1"),
	("San Vicente","8","1"),
	("Pichilemu","8","1"),
	("La Estrella","8","1"),
	("Litueche","8","1"),
	("Marchihue","8","1"),
	("Navidad","8","1"),
	("Paredones","8","1"),
	("San Fernando","8","1"),
	("Chépica","8","1"),
	("Chimbarongo","8","1"),
	("Lolol","8","1"),
	("Nancagua","8","1"),
	("Palmilla","8","1"),
	("Peralillo","8","1"),
	("Placilla","8","1"),
	("Pumanque","8","1"),
	("Santa Cruz","8","1"),
	("Talca","9","1"),
	("Constitución","9","1"),
	("Curepto","9","1"),
	("Empedrado","9","1"),
	("Maule","9","1"),
	("Pelarco","9","1"),
	("Pencahue","9","1"),
	("Río Claro","9","1"),
	("San Clemente","9","1"),
	("San Rafael","9","1"),
	("Cauquenes","9","1"),
	("Chanco","9","1"),
	("Pelluhue","9","1"),
	("Curicó","9","1"),
	("Hualañé","9","1"),
	("Licantén","9","1"),
	("Molina","9","1"),
	("Rauco","9","1"),
	("Romeral","9","1"),
	("Sagrada Familia","9","1"),
	("Teno","9","1"),
	("Vichuquén","9","1"),
	("Linares","9","1"),
	("Colbún","9","1"),
	("Longaví","9","1"),
	("Parral","9","1"),
	("Retiro","9","1"),
	("San Javier","9","1"),
	("Villa Alegre","9","1"),
	("Yerbas Buenas","9","1"),
	("Chillán","10","1"),
	("Bulnes","10","1"),
	("Chillán Viejo","10","1"),
	("El Carmen","10","1"),
	("Pemuco","10","1"),
	("Pinto","10","1"),
	("Quillón","10","1"),
	("San Ignacio","10","1"),
	("Yungay","10","1"),
	("Quirihue","10","1"),
	("Cobquecura","10","1"),
	("Coelemu","10","1"),
	("Ninhue","10","1"),
	("Portezuelo","10","1"),
	("Ránquil","10","1"),
	("Treguaco","10","1"),
	("San Carlos","10","1"),
	("Coihueco","10","1"),
	("Ñiquén","10","1"),
	("San Fabián","10","1"),
	("San Nicolás","10","1"),
	("Concepción","11","1"),
	("Coronel","11","1"),
	("Chiguayante","11","1"),
	("Florida","11","1"),
	("Hualqui","11","1"),
	("Lota","11","1"),
	("Penco","11","1"),
	("San Pedro de La Paz","11","1"),
	("Santa Juana","11","1"),
	("Talcahuano","11","1"),
	("Tomé","11","1"),
	("Hualpén","11","1"),
	("Lebu","11","1"),
	("Arauco","11","1"),
	("Cañete","11","1"),
	("Contulmo","11","1"),
	("Curanilahue","11","1"),
	("Los Álamos","11","1"),
	("Tirúa","11","1"),
	("Los Ángeles","11","1"),
	("Antuco","11","1"),
	("Cabrero","11","1"),
	("Laja","11","1"),
	("Mulchén","11","1"),
	("Nacimiento","11","1"),
	("Negrete","11","1"),
	("Quilaco","11","1"),
	("Quilleco","11","1"),
	("San Rosendo","11","1"),
	("Santa Bárbara","11","1"),
	("Tucapel","11","1"),
	("Yumbel","11","1"),
	("Alto Biobío","11","1"),
	("Temuco","12","1"),
	("Carahue","12","1"),
	("Cunco","12","1"),
	("Curarrehue","12","1"),
	("Freire","12","1"),
	("Galvarino","12","1"),
	("Gorbea","12","1"),
	("Lautaro","12","1"),
	("Loncoche","12","1"),
	("Melipeuco","12","1"),
	("Nueva Imperial","12","1"),
	("Padre Las Casas","12","1"),
	("Perquenco","12","1"),
	("Pitrufquén","12","1"),
	("Pucón","12","1"),
	("Saavedra","12","1"),
	("Teodoro Schmidt","12","1"),
	("Toltén","12","1"),
	("Vilcún","12","1"),
	("Villarrica","12","1"),
	("Cholchol","12","1"),
	("Angol","12","1"),
	("Collipulli","12","1"),
	("Curacautín","12","1"),
	("Ercilla","12","1"),
	("Lonquimay","12","1"),
	("Los Sauces","12","1"),
	("Lumaco","12","1"),
	("Purén","12","1"),
	("Renaico","12","1"),
	("Traiguén","12","1"),
	("Victoria","12","1"),
	("Valdivia","13","1"),
	("Corral","13","1"),
	("Lanco","13","1"),
	("Los Lagos","13","1"),
	("Máfil","13","1"),
	("Mariquina","13","1"),
	("Paillaco","13","1"),
	("Panguipulli","13","1"),
	("La Unión","13","1"),
	("Futrono","13","1"),
	("Lago Ranco","13","1"),
	("Río Bueno","13","1"),
	("Puerto Montt","14","1"),
	("Calbuco","14","1"),
	("Cochamó","14","1"),
	("Fresia","14","1"),
	("Frutillar","14","1"),
	("Los Muermos","14","1"),
	("Llanquihue","14","1"),
	("Maullín","14","1"),
	("Puerto Varas","14","1"),
	("Castro","14","1"),
	("Ancud","14","1"),
	("Chonchi","14","1"),
	("Curaco de Vélez","14","1"),
	("Dalcahue","14","1"),
	("Puqueldón","14","1"),
	("Queilén","14","1"),
	("Quellón","14","1"),
	("Quemchi","14","1"),
	("Quinchao","14","1"),
	("Osorno","14","1"),
	("Puerto Octay","14","1"),
	("Purranque","14","1"),
	("Puyehue","14","1"),
	("Río Negro","14","1"),
	("San Juan de la Costa","14","1"),
	("San Pablo","14","1"),
	("Chaitén","14","1"),
	("Futaleufú","14","1"),
	("Hualaihué","14","1"),
	("Palena","14","1"),
	("Coyhaique","15","1"),
	("Lago Verde","15","1"),
	("Aysén","15","1"),
	("Cisnes","15","1"),
	("Guaitecas","15","1"),
	("Cochrane","15","1"),
	("O'Higgins","15","1"),
	("Tortel","15","1"),
	("Chile Chico","15","1"),
	("Río Ibáñez","15","1"),
	("Punta Arenas","16","1"),
	("Laguna Blanca","16","1"),
	("Río Verde","16","1"),
	("San Gregorio","16","1"),
	("Cabo de Hornos","16","1"),
	("Antártica","16","1"),
	("Porvenir","16","1"),
	("Primavera","16","1"),
	("Timaukel","16","1"),
	("Natales","16","1"),
	("Torres del Paine","16","1"),
	("Santiago","7","1"),
	("Cerrillos","7","1"),
	("Cerro Navia","7","1"),
	("Conchalí","7","1"),
	("El Bosque","7","1"),
	("Estación Central","7","1"),
	("Huechuraba","7","1"),
	("Independencia","7","1"),
	("La Cisterna","7","1"),
	("La Florida","7","1"),
	("La Granja","7","1"),
	("La Pintana","7","1"),
	("La Reina","7","1"),
	("Las Condes","7","1"),
	("Lo Barnechea","7","1"),
	("Lo Espejo","7","1"),
	("Lo Prado","7","1"),
	("Macul","7","1"),
	("Maipú","7","1"),
	("Ñuñoa","7","1"),
	("Pedro Aguirre Cerda","7","1"),
	("Peñalolén","7","1"),
	("Providencia","7","1"),
	("Pudahuel","7","1"),
	("Quilicura","7","1"),
	("Quinta Normal","7","1"),
	("Recoleta","7","1"),
	("Renca","7","1"),
	("San Joaquín","7","1"),
	("San Miguel","7","1"),
	("San Ramón","7","1"),
	("Vitacura","7","1"),
	("Puente Alto","7","1"),
	("Pirque","7","1"),
	("San José de Maipo","7","1"),
	("Colina","7","1"),
	("Lampa","7","1"),
	("Til Til","7","1"),
	("San Bernardo","7","1"),
	("Buin","7","1"),
	("Calera de Tango","7","1"),
	("Paine","7","1"),
	("Melipilla","7","1"),
	("Alhué","7","1"),
	("Curacaví","7","1"),
	("María Pinto","7","1"),
	("San Pedro","7","1"),
	("Talagante","7","1"),
	("El Monte","7","1"),
	("Isla de Maipo","7","1"),
	("Padre Hurtado","7","1"),
	("Peñaflor","7","1");
	
CREATE TABLE `CServicio` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_servicio` int(10) unsigned NOT NULL,
  `id_ciudad` int(10) unsigned NOT NULL,
  `id_region` int(10) unsigned NOT NULL,
  `id_country` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CServicio_servicio` (`id_servicio`),
  KEY `FK_CServicio_ciudad` (`id_ciudad`),
  KEY `FK_CServicio_region` (`id_region`),
  KEY `FK_CServicio_countries` (`id_country`),
  CONSTRAINT `FK_CServicio_countries` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id_country`),
  CONSTRAINT `FK_CServicio_region` FOREIGN KEY (`id_region`) REFERENCES `regions` (`id_region`),
  CONSTRAINT `FK_CServicio_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `cities` (`id_city`)
);


CREATE TABLE Orden (
  id INT(11) NOT NULL,
  user_id INT(11) NOT NULL,
  servicio_id INT(11) NOT NULL,
  valoracion_id INT(11),
  description TEXT,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_userO FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT fk_servicioO FOREIGN KEY(servicio_id) REFERENCES servicios(id),
  CONSTRAINT fk_valoracionO FOREIGN KEY(valoracion_id) REFERENCES valoraciones(id)
);

ALTER TABLE Orden
  ADD PRIMARY KEY (id);

ALTER TABLE Orden
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 


CREATE TABLE Sproveedor (
  id INT(11) NOT NULL,
  empresanombre VARCHAR(50) NOT NULL,
  contactonombre VARCHAR(50) NOT NULL,
  numero VARCHAR(50) NOT NULL,
  ubicacion VARCHAR(50) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

ALTER TABLE Sproveedor
  ADD PRIMARY KEY (id);

ALTER TABLE Sproveedor
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 


CREATE TABLE categoria (
  id INT(11) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

ALTER TABLE categoria
  ADD PRIMARY KEY (id);

ALTER TABLE categoria
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 

INSERT INTO `categoria`
  (`nombre`)
VALUES
	("Cargadoras compactas"),
	("Cargadores forestales de pluma recta"),
	("Compactadores"),
	("Dragalinas"),
	("Dúmperes articulados"),
	("Dúmperes rígidos"),
	("Excavadoras"),
	("Excavadoras de ataque frontal eléctricas con cable"),
	("Excavadoras de minería hidráulicas"),
	("Excavadoras de ruedas"),
	("Extendedoras de aglomerado de asfalto"),
	("Hojas de empuje"),
	("Manipuladoras de materiales"),
	("Manipuladoras telescópicas"),
	("Motoniveladoras"),
	("Máquinas forestales"),
	("Mototraíllas"),
	("Palas de cadenas"),
	("Palas de cadenas compactas y cargadoras compactas todo terreno"),
	("Palas de ruedas"),
	("Perfiladoras de pavimentos en frío"),
	("Perforadoras"),
	("Recicladoras de pavimentos"),
	("Recogedoras transportadoras de troncos"),
	("Retropalas"),
	("Taladoras"),
	("Taladoras apiladoras"),
	("Tiendetubos"),
	("Trabajos subterráneos: tajos largos"),
	("Trabajos subterráneos: roca dura");




CREATE TABLE subcategoria (
  id INT(11) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

ALTER TABLE subcategoria
  ADD PRIMARY KEY (id);

ALTER TABLE subcategoria
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; 