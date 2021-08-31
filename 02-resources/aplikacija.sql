-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.26 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for aplikacija
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aplikacija`;

-- Dumping structure for table aplikacija.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL DEFAULT '0',
  `password_hash` varchar(255) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.administrator: ~5 rows (approximately)
=======
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.administrator: ~7 rows (approximately)
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `created_at`) VALUES
	(1, 'marko1234', '$2b$11$8ha1Z4VzpFo1bXBPjwjmEOnP0AAnxEq2zDPjJDgg4YbvvfHZfPWwe', '2021-07-21 20:30:41'),
	(2, 'drugi admin', 'adsjadsjadsjadsadsj', '2021-07-21 22:01:26'),
	(3, 'Marko', 'FD0F8BCCEACA95FF42FA62D2F909D693DD9F42ADA1D508108DE0004F9B96B8786A050BDAC4F5015954782F81F5873CA3B86B507BC876470E9EF2AD60FAD37763', '2021-07-22 18:32:16'),
	(7, 'marko123', '$2b$11$z6MeK6RB8mLis3jOuc913.MwsXWlQJuAsQcvmWv.JBQEAgVNzMtJW', '2021-08-09 21:24:54'),
<<<<<<< HEAD
	(9, 'administrador123', '$2b$11$udn4odAcUGuOrULAePPO7eO4U.wgPG2PAO7KVLGGmC02xqrArTZke', '2021-08-19 21:57:50');
=======
	(9, 'administrador123', '$2b$11$udn4odAcUGuOrULAePPO7eO4U.wgPG2PAO7KVLGGmC02xqrArTZke', '2021-08-19 21:57:50'),
	(10, 'a1', '$2b$11$3HevR0mJcs9rP29l7AhMtuYcanUCWdbukvqeooRRdWgQ2wDBJAbRK', '2021-08-21 16:20:37'),
	(12, 'a1daa', '$2b$11$hKURTiuuS7g4nRmThYixpOieeSsXxXFQLbq2jJbgWUgVt8BU6BJ5e', '2021-08-21 16:22:01');
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table aplikacija.cart
DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.cart: ~0 rows (approximately)
=======
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.cart: ~6 rows (approximately)
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
DELETE FROM `cart`;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`) VALUES
	(1, 1, '2021-08-20 20:28:15'),
	(2, 12, '2021-08-20 21:04:01'),
<<<<<<< HEAD
	(3, 12, '2021-08-20 21:05:50');
=======
	(3, 12, '2021-08-20 21:05:50'),
	(5, 13, '2021-08-21 15:26:35'),
	(6, 13, '2021-08-21 16:07:05'),
	(7, 13, '2021-08-21 16:13:50');
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

-- Dumping structure for table aplikacija.cart_profile
DROP TABLE IF EXISTS `cart_profile`;
CREATE TABLE IF NOT EXISTS `cart_profile` (
  `cart_profile_id` int unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int unsigned NOT NULL DEFAULT '0',
  `profile_id` int unsigned NOT NULL DEFAULT '0',
  `height` double(10,2) unsigned NOT NULL DEFAULT '0.00',
  `width` double(10,2) unsigned NOT NULL DEFAULT '0.00',
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_profile_id`),
<<<<<<< HEAD
  UNIQUE KEY `uq_cart_profile_cart_id_profile_id` (`cart_id`,`profile_id`),
  KEY `fk_cart_profile_profile_id` (`profile_id`),
  CONSTRAINT `fk_cart_profile_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_profile_profile_id` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.cart_profile: ~0 rows (approximately)
DELETE FROM `cart_profile`;
/*!40000 ALTER TABLE `cart_profile` DISABLE KEYS */;
INSERT INTO `cart_profile` (`cart_profile_id`, `cart_id`, `profile_id`, `height`, `width`, `quantity`) VALUES
	(1, 1, 3, 100.00, 100.00, 7);
=======
  UNIQUE KEY `uq_cart_profile_cart_id_profile_id_height_width` (`cart_id`,`profile_id`,`height`,`width`) USING BTREE,
  KEY `fk_cart_profile_profile_id` (`profile_id`),
  CONSTRAINT `fk_cart_profile_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_profile_profile_id` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.cart_profile: ~7 rows (approximately)
DELETE FROM `cart_profile`;
/*!40000 ALTER TABLE `cart_profile` DISABLE KEYS */;
INSERT INTO `cart_profile` (`cart_profile_id`, `cart_id`, `profile_id`, `height`, `width`, `quantity`) VALUES
	(1, 1, 3, 100.00, 100.00, 7),
	(2, 5, 3, 100.00, 100.00, 7),
	(3, 5, 4, 2.00, 2.00, 2),
	(5, 5, 1, 12.00, 12.00, 6),
	(7, 5, 1, 12.00, 123.00, 9),
	(17, 6, 3, 123.00, 200.00, 4),
	(18, 7, 1, 10.00, 9.00, 2);
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
/*!40000 ALTER TABLE `cart_profile` ENABLE KEYS */;

-- Dumping structure for table aplikacija.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '0',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `image_path` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_image_path` (`image_path`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.category: ~6 rows (approximately)
DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `description`, `image_path`) VALUES
	(1, 'kategorija1', 'das kategorija', 'dsajhkdsaj'),
	(4, 'kategorija2', 'druga kategorija', '/'),
	(5, 'qwesasasart', 'dsadsa', 'ksaksa.jpg'),
	(7, 'dasd', 'mafdasdasadsd', 'dsadsa.png'),
	(9, 'ddasasd', 'mafdaasadsd', 'dsadsa.jpg'),
	(11, 'dda1sd', 'mafdaasadsd', 'dsasa.jpg');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table aplikacija.manufacturer
DROP TABLE IF EXISTS `manufacturer`;
CREATE TABLE IF NOT EXISTS `manufacturer` (
  `manufacturer_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`manufacturer_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.manufacturer: ~3 rows (approximately)
DELETE FROM `manufacturer`;
/*!40000 ALTER TABLE `manufacturer` DISABLE KEYS */;
INSERT INTO `manufacturer` (`manufacturer_id`, `name`, `created_at`) VALUES
	(1, 'marko1234', '2021-07-22 19:54:31'),
	(2, 'metalac', '2021-07-22 19:54:43'),
	(3, 'alu alu', '2021-07-22 19:55:18');
/*!40000 ALTER TABLE `manufacturer` ENABLE KEYS */;

-- Dumping structure for table aplikacija.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int unsigned NOT NULL DEFAULT '0',
  `first_name` varchar(50) NOT NULL DEFAULT '0',
  `last_name` varchar(64) NOT NULL DEFAULT '0',
  `address` varchar(128) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.order: ~0 rows (approximately)
=======
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.order: ~5 rows (approximately)
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
DELETE FROM `order`;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` (`order_id`, `cart_id`, `first_name`, `last_name`, `address`, `created_at`) VALUES
	(1, 1, 'dsaads', 'dsadsa', 'dsadsa', '2021-08-20 20:28:51'),
<<<<<<< HEAD
	(3, 2, '0dsadsa', 'dsadsa', 'dsadsa', '2021-08-20 21:05:45');
=======
	(3, 2, '0dsadsa', 'dsadsa', 'dsadsa', '2021-08-20 21:05:45'),
	(4, 5, '0', '0', '0', '2021-08-21 16:05:55'),
	(5, 6, '0', '0', '0', '2021-08-21 16:08:04'),
	(6, 7, 'Stefan', 'as', 'asas', '2021-08-21 16:14:10');
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

-- Dumping structure for table aplikacija.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_profile_id` (`profile_id`),
  CONSTRAINT `fk_photo_profile_id` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

<<<<<<< HEAD
-- Dumping data for table aplikacija.photo: ~2 rows (approximately)
=======
-- Dumping data for table aplikacija.photo: ~1 rows (approximately)
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
DELETE FROM `photo`;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `profile_id`, `image_path`) VALUES
	(33, 1, 'static/uploads/2021/80/108c5341-cbf0-4645-ab71-950d749abb5aScreenshot1.png');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table aplikacija.profile
DROP TABLE IF EXISTS `profile`;
CREATE TABLE IF NOT EXISTS `profile` (
  `profile_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `description` varchar(255) DEFAULT '0',
  `price_per_unit_area` double(10,2) NOT NULL,
  `manufacturer_id` int unsigned NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  `status` enum('available','visible','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_profile_manufacturer_id` (`manufacturer_id`),
  KEY `fk_profile_category_id` (`category_id`),
  CONSTRAINT `fk_profile_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_profile_manufacturer_id` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturer` (`manufacturer_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.profile: ~3 rows (approximately)
DELETE FROM `profile`;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` (`profile_id`, `name`, `description`, `price_per_unit_area`, `manufacturer_id`, `category_id`, `status`, `created_at`) VALUES
	(1, 'prozor-pvc', 'mnogo dobar prozor', 200.00, 1, 1, 'available', '2021-07-22 20:09:22'),
	(3, 'francuski metal', 'metal stvarrno', 1500.98, 3, 1, 'available', '2021-07-22 20:10:50'),
	(4, 'nenenene', 'lelelele', 5000.00, 3, 1, 'hidden', '2021-08-13 17:39:09');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;

-- Dumping structure for table aplikacija.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '0',
  `password_hash` varchar(255) NOT NULL DEFAULT '0',
  `created_ad` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `qu_user_username` (`username`),
  UNIQUE KEY `uq_use_email` (`email`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.user: ~7 rows (approximately)
=======
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table aplikacija.user: ~9 rows (approximately)
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `username`, `password_hash`, `created_ad`, `email`) VALUES
	(1, 'marko1', 'adsldasnkldnkas', '2021-07-22 19:58:15', 'marko.milenkovic.17@singimail.rs'),
	(2, 'djole', 'adsknjadsads', '2021-07-22 19:58:38', NULL),
	(4, 'NAJBOLJI user', '$2b$11$FB0Hcsg530G.hlmJjuHLSuMS4fqSRdMnI5Y/Zq2EFWO9i/qBfUWre', '2021-08-19 19:08:06', NULL),
	(5, 'najjaci user', '$2b$11$ktbD7eH2VzUOkUQc/QFSbeMwAMJYYtCffnasv.rFpBy4XMNgDosMW', '2021-08-19 20:03:29', NULL),
	(7, 'user123433214321', '$2b$11$nuxcQWuDTo5WaaektoIWK.x48MfVkNUUsoGHucXaozh/f17Z4nd1K', '2021-08-19 20:04:38', NULL),
	(8, 'usdas21', '$2b$11$6PhZn.HOIT39shCq3FtdyOtnMyNxEiS6nL4WHux5DOjkGuh7JfkiK', '2021-08-19 20:05:56', 'nwsa@dsa.rs'),
	(10, 'udsafg3451', '$2b$11$Ki/KRroWE5c3boANCUBug.x08raE9tbGXPoIqwoqx12WHAgmH3f7W', '2021-08-19 20:07:56', 'nfajkbfdsajkb@sa.rs'),
<<<<<<< HEAD
	(12, 'nneki user broj r2', '$2b$11$EUmxCoE7ftJu1x0apr1VNOQ0FfEeWbEYMVb7jTk8/ARmYmt2y87RC', '2021-08-19 20:08:30', 'nassda@adsa.rs');
=======
	(12, 'nneki user broj r2', '$2b$11$EUmxCoE7ftJu1x0apr1VNOQ0FfEeWbEYMVb7jTk8/ARmYmt2y87RC', '2021-08-19 20:08:30', 'nassda@adsa.rs'),
	(13, 'ja', '$2b$11$Mh40qnEHzioi62MfcKTFV.FOIX308UvQIHM73aU4WVWkyVAgtel/O', '2021-08-21 15:08:34', 'as@as.as');
>>>>>>> 271b5e0c102fac545f290ae0de49b833739a973d
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
