-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2015 at 11:50 AM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `babyrus`
--

-- --------------------------------------------------------

--
-- Table structure for table `classification`
--

CREATE TABLE IF NOT EXISTS `classification` (
  `classificationid` bigint(20) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`classificationid`),
  UNIQUE KEY `classification_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `classification`
--

INSERT INTO `classification` (`classificationid`, `enabled`, `name`) VALUES
(1, 1, 'Color'),
(2, 1, 'Collection'),
(3, 1, 'Product Type');

-- --------------------------------------------------------

--
-- Table structure for table `classificationtype`
--

CREATE TABLE IF NOT EXISTS `classificationtype` (
  `classificationtypeid` bigint(20) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `classificationid` bigint(20) NOT NULL,
  PRIMARY KEY (`classificationtypeid`),
  UNIQUE KEY `classificationtype_name_key` (`name`),
  KEY `fkeb0d9060b531e5a7` (`classificationid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `classificationtype`
--

INSERT INTO `classificationtype` (`classificationtypeid`, `enabled`, `name`, `classificationid`) VALUES
(1, 1, 'BLISS', 2),
(2, 1, 'MONTANA', 2),
(3, 1, 'CHANTAL', 2);

-- --------------------------------------------------------

--
-- Table structure for table `color`
--

CREATE TABLE IF NOT EXISTS `color` (
  `colorid` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`colorid`),
  UNIQUE KEY `color_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `guestshippingdetail`
--

CREATE TABLE IF NOT EXISTS `guestshippingdetail` (
  `guestshippingdetailid` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `emailid` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `guestfirstname` varchar(255) DEFAULT NULL,
  `guestlastname` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `repfirstname` varchar(255) DEFAULT NULL,
  `replastname` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `approverid` bigint(20) NOT NULL,
  `orderid` bigint(20) NOT NULL,
  PRIMARY KEY (`guestshippingdetailid`),
  KEY `fk41580f776d6225f7` (`orderid`),
  KEY `fk41580f77e8753f40` (`approverid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `munire_comply_users`
--

CREATE TABLE IF NOT EXISTS `munire_comply_users` (
  `uname` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `munire_comply_users`
--

INSERT INTO `munire_comply_users` (`uname`, `password`) VALUES
('vijay', '123');

-- --------------------------------------------------------

--
-- Table structure for table `ordercomment`
--

CREATE TABLE IF NOT EXISTS `ordercomment` (
  `ordercommentid` bigint(20) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `createdon` timestamp NOT NULL,
  `commentby` bigint(20) NOT NULL,
  `orderid` bigint(20) NOT NULL,
  PRIMARY KEY (`ordercommentid`),
  KEY `fk777e1f515c724796` (`commentby`),
  KEY `fk777e1f516d6225f7` (`orderid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orderdetail`
--

CREATE TABLE IF NOT EXISTS `orderdetail` (
  `orderdetailid` bigint(20) NOT NULL,
  `factorycode` varchar(255) NOT NULL,
  `lastmodified` timestamp NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `ponumber` varchar(255) NOT NULL,
  `productiondate` timestamp NOT NULL,
  `purchasedon` timestamp NOT NULL,
  `quantity` int(11) NOT NULL,
  `shippedquantity` int(11) NOT NULL,
  `orderid` bigint(20) NOT NULL,
  `problemtypeid` bigint(20) NOT NULL,
  `productid` bigint(20) NOT NULL,
  `productpartid` bigint(20) NOT NULL,
  `shippingtypeid` bigint(20) NOT NULL,
  PRIMARY KEY (`orderdetailid`),
  KEY `fkaa2f011f4757493f` (`productpartid`),
  KEY `fkaa2f011f6d6225f7` (`orderid`),
  KEY `fkaa2f011fab8d5cf9` (`productid`),
  KEY `fkaa2f011fe526796d` (`problemtypeid`),
  KEY `fkaa2f011ffad7d54b` (`shippingtypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `problemtype`
--

CREATE TABLE IF NOT EXISTS `problemtype` (
  `problemtypeid` bigint(20) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`problemtypeid`),
  UNIQUE KEY `problemtype_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `problemtype`
--

INSERT INTO `problemtype` (`problemtypeid`, `enabled`, `name`) VALUES
(1, 1, 'Drawers'),
(2, 1, 'Missing Knobs');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `productid` bigint(20) NOT NULL,
  `archived` tinyint(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `lastmodified` timestamp NOT NULL,
  `name` varchar(255) NOT NULL,
  `skn` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  PRIMARY KEY (`productid`),
  UNIQUE KEY `product_code_key` (`code`),
  UNIQUE KEY `product_name_key` (`name`),
  UNIQUE KEY `product_skn_key` (`skn`),
  UNIQUE KEY `product_sku_key` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productid`, `archived`, `code`, `description`, `enabled`, `lastmodified`, `name`, `skn`, `sku`) VALUES
(1, 0, '2711-CN', 'BLISS FLAT TOP CRIB CHESTNUT', 1, '2012-09-20 18:30:00', 'BLISS FLAT TOP CRIB CHESTNUT', '274906', '274906'),
(22, 0, '2711-ESP', 'BLISS FLAT TOP CRIB ESPRESSO', 1, '2012-09-20 18:30:00', 'BLISS FLAT TOP CRIB ESPRESSO', '271017', '271017');

-- --------------------------------------------------------

--
-- Table structure for table `productandparts`
--

CREATE TABLE IF NOT EXISTS `productandparts` (
  `enabled` tinyint(1) NOT NULL,
  `productid` bigint(20) NOT NULL,
  `productpartid` bigint(20) NOT NULL,
  PRIMARY KEY (`productid`,`productpartid`),
  KEY `fk93cbc9384757493f` (`productpartid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productclassification`
--

CREATE TABLE IF NOT EXISTS `productclassification` (
  `enabled` tinyint(1) DEFAULT NULL,
  `classificationtypeid` bigint(20) NOT NULL,
  `productid` bigint(20) NOT NULL,
  PRIMARY KEY (`classificationtypeid`,`productid`),
  KEY `fk_product_id` (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productorder`
--

CREATE TABLE IF NOT EXISTS `productorder` (
  `orderid` bigint(20) NOT NULL,
  `createdon` timestamp NOT NULL,
  `lastmodified` timestamp NOT NULL,
  `shippingmode` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `staffid` bigint(20) NOT NULL,
  `storeid` bigint(20) NOT NULL,
  PRIMARY KEY (`orderid`),
  KEY `fk_staff_id` (`staffid`),
  KEY `store_storeid` (`storeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productpart`
--

CREATE TABLE IF NOT EXISTS `productpart` (
  `productpartid` bigint(20) NOT NULL,
  `archived` tinyint(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `lastmodified` timestamp NULL DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `shippingtypeid` bigint(20) NOT NULL,
  PRIMARY KEY (`productpartid`),
  UNIQUE KEY `productpart_code_key` (`code`),
  KEY `fk_shippingtype_id` (`shippingtypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shippingtype`
--

CREATE TABLE IF NOT EXISTS `shippingtype` (
  `shippingtypeid` bigint(20) NOT NULL,
  `daystaken` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`shippingtypeid`),
  UNIQUE KEY `shippingtype_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE IF NOT EXISTS `staff` (
  `staffid` bigint(20) NOT NULL,
  `archived` tinyint(1) DEFAULT NULL,
  `emailid` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `firstname` varchar(255) NOT NULL,
  `initial` varchar(255) DEFAULT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `storeid` bigint(20) NOT NULL,
  PRIMARY KEY (`staffid`),
  KEY `store_id` (`storeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stafflogin`
--

CREATE TABLE IF NOT EXISTS `stafflogin` (
  `loginname` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `lastmodified` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `staffid` bigint(20) NOT NULL,
  PRIMARY KEY (`loginname`),
  KEY `fk_staff_staffid` (`staffid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE IF NOT EXISTS `store` (
  `storeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '0',
  `city` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `emailid` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `fax` varchar(255) DEFAULT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`storeid`),
  UNIQUE KEY `store_code_key` (`code`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`storeid`, `address`, `archived`, `city`, `code`, `country`, `emailid`, `enabled`, `fax`, `lastmodified`, `name`, `phone`, `state`, `zipcode`) VALUES
(1, NULL, 0, NULL, '123456', NULL, NULL, 1, NULL, '2015-12-10 07:39:04', 'test', NULL, NULL, NULL),
(2, NULL, 0, NULL, '123', NULL, NULL, 1, NULL, '2015-12-10 07:40:48', 'test2', NULL, NULL, NULL),
(4, NULL, 0, NULL, '12345', NULL, NULL, 1, NULL, '2015-12-10 07:41:53', 'test3', NULL, NULL, NULL),
(5, NULL, 0, NULL, '1234', NULL, NULL, 1, NULL, '2015-12-10 07:44:20', 'qwe', NULL, NULL, NULL),
(6, NULL, 0, NULL, '789', NULL, NULL, 1, NULL, '2015-12-10 07:45:12', 'xc', NULL, NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classificationtype`
--
ALTER TABLE `classificationtype`
  ADD CONSTRAINT `fkeb0d9060b531e5a7` FOREIGN KEY (`classificationid`) REFERENCES `classification` (`classificationid`);

--
-- Constraints for table `guestshippingdetail`
--
ALTER TABLE `guestshippingdetail`
  ADD CONSTRAINT `fk41580f776d6225f7` FOREIGN KEY (`orderid`) REFERENCES `productorder` (`orderid`),
  ADD CONSTRAINT `fk41580f77e8753f40` FOREIGN KEY (`approverid`) REFERENCES `staff` (`staffid`);

--
-- Constraints for table `ordercomment`
--
ALTER TABLE `ordercomment`
  ADD CONSTRAINT `fk777e1f515c724796` FOREIGN KEY (`commentby`) REFERENCES `staff` (`staffid`),
  ADD CONSTRAINT `fk777e1f516d6225f7` FOREIGN KEY (`orderid`) REFERENCES `productorder` (`orderid`);

--
-- Constraints for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `fkaa2f011f4757493f` FOREIGN KEY (`productpartid`) REFERENCES `productpart` (`productpartid`),
  ADD CONSTRAINT `fkaa2f011f6d6225f7` FOREIGN KEY (`orderid`) REFERENCES `productorder` (`orderid`),
  ADD CONSTRAINT `fkaa2f011fab8d5cf9` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`),
  ADD CONSTRAINT `fkaa2f011fe526796d` FOREIGN KEY (`problemtypeid`) REFERENCES `problemtype` (`problemtypeid`),
  ADD CONSTRAINT `fkaa2f011ffad7d54b` FOREIGN KEY (`shippingtypeid`) REFERENCES `shippingtype` (`shippingtypeid`);

--
-- Constraints for table `productandparts`
--
ALTER TABLE `productandparts`
  ADD CONSTRAINT `fk93cbc9384757493f` FOREIGN KEY (`productpartid`) REFERENCES `productpart` (`productpartid`),
  ADD CONSTRAINT `fk93cbc938ab8d5cf9` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`);

--
-- Constraints for table `productclassification`
--
ALTER TABLE `productclassification`
  ADD CONSTRAINT `fk_classificationtype_id` FOREIGN KEY (`classificationtypeid`) REFERENCES `classificationtype` (`classificationtypeid`),
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`);

--
-- Constraints for table `productorder`
--
ALTER TABLE `productorder`
  ADD CONSTRAINT `store_storeid` FOREIGN KEY (`storeid`) REFERENCES `store` (`storeid`),
  ADD CONSTRAINT `fk_staff_id` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`);

--
-- Constraints for table `productpart`
--
ALTER TABLE `productpart`
  ADD CONSTRAINT `fk_shippingtype_id` FOREIGN KEY (`shippingtypeid`) REFERENCES `shippingtype` (`shippingtypeid`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `store_id` FOREIGN KEY (`storeid`) REFERENCES `store` (`storeid`);

--
-- Constraints for table `stafflogin`
--
ALTER TABLE `stafflogin`
  ADD CONSTRAINT `fk_staff_staffid` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
