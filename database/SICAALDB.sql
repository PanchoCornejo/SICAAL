CREATE DATABASE sicaal_db;

USE sicaal_db;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  rol VARCHAR(20) DEFAULT 'Cliente' NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;



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
  nombre VARCHAR(50) NOT NULL,
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

-- Insertamos las regiones en el pa??s. Recortemos que el ID de la regi??n es autoincremental.

INSERT INTO `regions`
  (`id_country`,`name`)
VALUES
  ('1','Regi??n de Arica y Parinacota'),
  ('1','Regi??n de Tarapac??'),
  ('1','Regi??n de Antofagasta'),
  ('1','Regi??n de Atacama'),
  ('1','Regi??n de Coquimbo'),
  ('1','Regi??n de Valpara??so'),
  ('1','Regi??n Metropolitana de Santiago'),
  ('1',"Regi??n del Libertador General Bernardo O'Higgins"),
  ('1','Regi??n del Maule'),
  ('1','Regi??n de ??uble'),
  ('1','Regi??n del Biob??o'),
  ('1','Regi??n de La Araucan??a'),
  ('1','Regi??n de Los R??os'),
  ('1','Regi??n de Los Lagos'),
  ('1','Regi??n Ays??n del General Carlos Ib????ez del Campo'),
  ('1','Regi??n de Magallanes y de la Ant??rtica Chilena');
  
  -- Finalmente, creamos nuestra tabla de ciudades. La llamaremos de este modo y no "comunas" porque estamos modelando de forma gen??rica.
  
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
-- Recordemos que el ID de la comuna es autoincremental, y el ID de la regi??n tambi??n entonces asumimos que se ha insertado secuencialmente en el paso anterior.

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
	("Cami??a","2","1"),
	("Colchane","2","1"),
	("Huara","2","1"),
	("Pica","2","1"),
	("Antofagasta","3","1"),
	("Mejillones","3","1"),
	("Sierra Gorda","3","1"),
	("Taltal","3","1"),
	("Calama","3","1"),
	("Ollag??e","3","1"),
	("San Pedro de Atacama","3","1"),
	("Tocopilla","3","1"),
	("Mar??a Elena","3","1"),
	("Copiap??","4","1"),
	("Caldera","4","1"),
	("Tierra Amarilla","4","1"),
	("Cha??aral","4","1"),
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
	("Vicu??a","5","1"),
	("Illapel","5","1"),
	("Canela","5","1"),
	("Los Vilos","5","1"),
	("Salamanca","5","1"),
	("Ovalle","5","1"),
	("Combarbal??","5","1"),
	("Monte Patria","5","1"),
	("Punitaqui","5","1"),
	("R??o Hurtado","5","1"),
	("Valpara??so","6","1"),
	("Casablanca","6","1"),
	("Conc??n","6","1"),
	("Juan Fern??ndez","6","1"),
	("Puchuncav??","6","1"),
	("Quintero","6","1"),
	("Vi??a del Mar","6","1"),
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
	("Santa Mar??a","6","1"),
	("Quilpu??","6","1"),
	("Limache","6","1"),
	("Olmu??","6","1"),
	("Villa Alemana","6","1"),
	("Rancagua","8","1"),
	("Codegua","8","1"),
	("Coinco","8","1"),
	("Coltauco","8","1"),
	("Do??ihue","8","1"),
	("Graneros","8","1"),
	("Las Cabras","8","1"),
	("Machal??","8","1"),
	("Malloa","8","1"),
	("Mostazal","8","1"),
	("Olivar","8","1"),
	("Peumo","8","1"),
	("Pichidegua","8","1"),
	("Quinta de Tilcoco","8","1"),
	("Rengo","8","1"),
	("Requ??noa","8","1"),
	("San Vicente","8","1"),
	("Pichilemu","8","1"),
	("La Estrella","8","1"),
	("Litueche","8","1"),
	("Marchihue","8","1"),
	("Navidad","8","1"),
	("Paredones","8","1"),
	("San Fernando","8","1"),
	("Ch??pica","8","1"),
	("Chimbarongo","8","1"),
	("Lolol","8","1"),
	("Nancagua","8","1"),
	("Palmilla","8","1"),
	("Peralillo","8","1"),
	("Placilla","8","1"),
	("Pumanque","8","1"),
	("Santa Cruz","8","1"),
	("Talca","9","1"),
	("Constituci??n","9","1"),
	("Curepto","9","1"),
	("Empedrado","9","1"),
	("Maule","9","1"),
	("Pelarco","9","1"),
	("Pencahue","9","1"),
	("R??o Claro","9","1"),
	("San Clemente","9","1"),
	("San Rafael","9","1"),
	("Cauquenes","9","1"),
	("Chanco","9","1"),
	("Pelluhue","9","1"),
	("Curic??","9","1"),
	("Huala????","9","1"),
	("Licant??n","9","1"),
	("Molina","9","1"),
	("Rauco","9","1"),
	("Romeral","9","1"),
	("Sagrada Familia","9","1"),
	("Teno","9","1"),
	("Vichuqu??n","9","1"),
	("Linares","9","1"),
	("Colb??n","9","1"),
	("Longav??","9","1"),
	("Parral","9","1"),
	("Retiro","9","1"),
	("San Javier","9","1"),
	("Villa Alegre","9","1"),
	("Yerbas Buenas","9","1"),
	("Chill??n","10","1"),
	("Bulnes","10","1"),
	("Chill??n Viejo","10","1"),
	("El Carmen","10","1"),
	("Pemuco","10","1"),
	("Pinto","10","1"),
	("Quill??n","10","1"),
	("San Ignacio","10","1"),
	("Yungay","10","1"),
	("Quirihue","10","1"),
	("Cobquecura","10","1"),
	("Coelemu","10","1"),
	("Ninhue","10","1"),
	("Portezuelo","10","1"),
	("R??nquil","10","1"),
	("Treguaco","10","1"),
	("San Carlos","10","1"),
	("Coihueco","10","1"),
	("??iqu??n","10","1"),
	("San Fabi??n","10","1"),
	("San Nicol??s","10","1"),
	("Concepci??n","11","1"),
	("Coronel","11","1"),
	("Chiguayante","11","1"),
	("Florida","11","1"),
	("Hualqui","11","1"),
	("Lota","11","1"),
	("Penco","11","1"),
	("San Pedro de La Paz","11","1"),
	("Santa Juana","11","1"),
	("Talcahuano","11","1"),
	("Tom??","11","1"),
	("Hualp??n","11","1"),
	("Lebu","11","1"),
	("Arauco","11","1"),
	("Ca??ete","11","1"),
	("Contulmo","11","1"),
	("Curanilahue","11","1"),
	("Los ??lamos","11","1"),
	("Tir??a","11","1"),
	("Los ??ngeles","11","1"),
	("Antuco","11","1"),
	("Cabrero","11","1"),
	("Laja","11","1"),
	("Mulch??n","11","1"),
	("Nacimiento","11","1"),
	("Negrete","11","1"),
	("Quilaco","11","1"),
	("Quilleco","11","1"),
	("San Rosendo","11","1"),
	("Santa B??rbara","11","1"),
	("Tucapel","11","1"),
	("Yumbel","11","1"),
	("Alto Biob??o","11","1"),
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
	("Pitrufqu??n","12","1"),
	("Puc??n","12","1"),
	("Saavedra","12","1"),
	("Teodoro Schmidt","12","1"),
	("Tolt??n","12","1"),
	("Vilc??n","12","1"),
	("Villarrica","12","1"),
	("Cholchol","12","1"),
	("Angol","12","1"),
	("Collipulli","12","1"),
	("Curacaut??n","12","1"),
	("Ercilla","12","1"),
	("Lonquimay","12","1"),
	("Los Sauces","12","1"),
	("Lumaco","12","1"),
	("Pur??n","12","1"),
	("Renaico","12","1"),
	("Traigu??n","12","1"),
	("Victoria","12","1"),
	("Valdivia","13","1"),
	("Corral","13","1"),
	("Lanco","13","1"),
	("Los Lagos","13","1"),
	("M??fil","13","1"),
	("Mariquina","13","1"),
	("Paillaco","13","1"),
	("Panguipulli","13","1"),
	("La Uni??n","13","1"),
	("Futrono","13","1"),
	("Lago Ranco","13","1"),
	("R??o Bueno","13","1"),
	("Puerto Montt","14","1"),
	("Calbuco","14","1"),
	("Cocham??","14","1"),
	("Fresia","14","1"),
	("Frutillar","14","1"),
	("Los Muermos","14","1"),
	("Llanquihue","14","1"),
	("Maull??n","14","1"),
	("Puerto Varas","14","1"),
	("Castro","14","1"),
	("Ancud","14","1"),
	("Chonchi","14","1"),
	("Curaco de V??lez","14","1"),
	("Dalcahue","14","1"),
	("Puqueld??n","14","1"),
	("Queil??n","14","1"),
	("Quell??n","14","1"),
	("Quemchi","14","1"),
	("Quinchao","14","1"),
	("Osorno","14","1"),
	("Puerto Octay","14","1"),
	("Purranque","14","1"),
	("Puyehue","14","1"),
	("R??o Negro","14","1"),
	("San Juan de la Costa","14","1"),
	("San Pablo","14","1"),
	("Chait??n","14","1"),
	("Futaleuf??","14","1"),
	("Hualaihu??","14","1"),
	("Palena","14","1"),
	("Coyhaique","15","1"),
	("Lago Verde","15","1"),
	("Ays??n","15","1"),
	("Cisnes","15","1"),
	("Guaitecas","15","1"),
	("Cochrane","15","1"),
	("O'Higgins","15","1"),
	("Tortel","15","1"),
	("Chile Chico","15","1"),
	("R??o Ib????ez","15","1"),
	("Punta Arenas","16","1"),
	("Laguna Blanca","16","1"),
	("R??o Verde","16","1"),
	("San Gregorio","16","1"),
	("Cabo de Hornos","16","1"),
	("Ant??rtica","16","1"),
	("Porvenir","16","1"),
	("Primavera","16","1"),
	("Timaukel","16","1"),
	("Natales","16","1"),
	("Torres del Paine","16","1"),
	("Santiago","7","1"),
	("Cerrillos","7","1"),
	("Cerro Navia","7","1"),
	("Conchal??","7","1"),
	("El Bosque","7","1"),
	("Estaci??n Central","7","1"),
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
	("Maip??","7","1"),
	("??u??oa","7","1"),
	("Pedro Aguirre Cerda","7","1"),
	("Pe??alol??n","7","1"),
	("Providencia","7","1"),
	("Pudahuel","7","1"),
	("Quilicura","7","1"),
	("Quinta Normal","7","1"),
	("Recoleta","7","1"),
	("Renca","7","1"),
	("San Joaqu??n","7","1"),
	("San Miguel","7","1"),
	("San Ram??n","7","1"),
	("Vitacura","7","1"),
	("Puente Alto","7","1"),
	("Pirque","7","1"),
	("San Jos?? de Maipo","7","1"),
	("Colina","7","1"),
	("Lampa","7","1"),
	("Til Til","7","1"),
	("San Bernardo","7","1"),
	("Buin","7","1"),
	("Calera de Tango","7","1"),
	("Paine","7","1"),
	("Melipilla","7","1"),
	("Alhu??","7","1"),
	("Curacav??","7","1"),
	("Mar??a Pinto","7","1"),
	("San Pedro","7","1"),
	("Talagante","7","1"),
	("El Monte","7","1"),
	("Isla de Maipo","7","1"),
	("Padre Hurtado","7","1"),
	("Pe??aflor","7","1");
	
CREATE TABLE `CServicio` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_servicio` int(10) unsigned NOT NULL,
  `id_ciudad` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CServicio_servicio` (`id_servicio`),
  KEY `FK_CServicio_ciudad` (`id_ciudad`),
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
  empresanombre VARCHAR(100) NOT NULL,
  contactonombre VARCHAR(100) NOT NULL,
  numero VARCHAR(50) NOT NULL,
  ubicacion VARCHAR(100) NOT NULL,
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
	("D??mperes articulados"),
	("D??mperes r??gidos"),
	("Excavadoras"),
	("Excavadoras de ataque frontal el??ctricas con cable"),
	("Excavadoras de miner??a hidr??ulicas"),
	("Excavadoras de ruedas"),
	("Extendedoras de aglomerado de asfalto"),
	("Hojas de empuje"),
	("Manipuladoras de materiales"),
	("Manipuladoras telesc??picas"),
	("Motoniveladoras"),
	("M??quinas forestales"),
	("Mototra??llas"),
	("Palas de cadenas"),
	("Palas de cadenas compactas y cargadoras compactas todo terreno"),
	("Palas de ruedas"),
	("Perfiladoras de pavimentos en fr??o"),
	("Perforadoras"),
	("Recicladoras de pavimentos"),
	("Recogedoras transportadoras de troncos"),
	("Retropalas"),
	("Taladoras"),
	("Taladoras apiladoras"),
	("Tiendetubos"),
	("Trabajos subterr??neos: tajos largos"),
	("Trabajos subterr??neos: roca dura");



CREATE TABLE Clientes (
	id INT(11) NOT NULL,
	telefono VARCHAR(25) NOT NULL,
	correo VARCHAR(100) NOT NULL,
	PRIMARY KEY (ID)
);  


		
CREATE TABLE Soliservicio (
  id INT(11) NOT NULL,
  user_request INT(11) NOT NULL,
  servicio INT(11) NOT NULL
);

ALTER TABLE Soliservicio
  ADD PRIMARY KEY (id);

ALTER TABLE Soliservicio
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
