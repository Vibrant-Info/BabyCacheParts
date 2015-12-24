-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2015 at 01:26 PM
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
  `classificationid` bigint(20) NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`classificationid`),
  UNIQUE KEY `classification_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `classificationtype`
--

CREATE TABLE IF NOT EXISTS `classificationtype` (
  `classificationtypeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `classificationid` bigint(20) NOT NULL,
  PRIMARY KEY (`classificationtypeid`),
  KEY `fkeb0d9060b531e5a7` (`classificationid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `color`
--

CREATE TABLE IF NOT EXISTS `color` (
  `colorid` int(11) NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`colorid`),
  UNIQUE KEY `color_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `guestshippingdetail`
--

CREATE TABLE IF NOT EXISTS `guestshippingdetail` (
  `guestshippingdetailid` bigint(20) NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ordercomment`
--

CREATE TABLE IF NOT EXISTS `ordercomment` (
  `ordercommentid` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `createdon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `commentby` bigint(20) NOT NULL,
  `orderid` bigint(20) NOT NULL,
  PRIMARY KEY (`ordercommentid`),
  KEY `fk777e1f515c724796` (`commentby`),
  KEY `fk777e1f516d6225f7` (`orderid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `orderdetail`
--

CREATE TABLE IF NOT EXISTS `orderdetail` (
  `orderdetailid` bigint(20) NOT NULL AUTO_INCREMENT,
  `factorycode` varchar(255) NOT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(255) DEFAULT NULL,
  `ponumber` varchar(255) NOT NULL,
  `productiondate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `purchasedon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  KEY `fkaa2f011ffad7d54b` (`shippingtypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `problemtype`
--

CREATE TABLE IF NOT EXISTS `problemtype` (
  `problemtypeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`problemtypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `productid` bigint(20) NOT NULL AUTO_INCREMENT,
  `archived` tinyint(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `skn` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  PRIMARY KEY (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `productandparts`
--

CREATE TABLE IF NOT EXISTS `productandparts` (
  `enabled` tinyint(1) NOT NULL AUTO_INCREMENT,
  `productid` bigint(20) NOT NULL,
  `productpartid` bigint(20) NOT NULL,
  PRIMARY KEY (`enabled`),
  KEY `fk93cbc9384757493f` (`productpartid`),
  KEY `fk93cbc938ab8d5cf9` (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `productclassification`
--

CREATE TABLE IF NOT EXISTS `productclassification` (
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `classificationtypeid` bigint(20) NOT NULL,
  `productid` bigint(20) NOT NULL,
  PRIMARY KEY (`enabled`),
  KEY `fkb7434e956d326bbb` (`classificationtypeid`),
  KEY `fkb7434e95ab8d5cf9` (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productorder`
--

CREATE TABLE IF NOT EXISTS `productorder` (
  `orderid` bigint(20) NOT NULL AUTO_INCREMENT,
  `createdon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shippingmode` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `staffid` bigint(20) NOT NULL,
  `storeid` bigint(20) NOT NULL,
  PRIMARY KEY (`orderid`),
  KEY `fk3d5977bf4474009b` (`staffid`),
  KEY `fk3d5977bf453ef05d` (`storeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `productpart`
--

CREATE TABLE IF NOT EXISTS `productpart` (
  `productpartid` bigint(20) NOT NULL AUTO_INCREMENT,
  `archived` tinyint(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `lastmodified` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `shippingtypeid` bigint(20) NOT NULL,
  PRIMARY KEY (`productpartid`),
  KEY `fka7f3d62fad7d54b` (`shippingtypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `shippingtype`
--

CREATE TABLE IF NOT EXISTS `shippingtype` (
  `shippingtypeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `daystaken` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`shippingtypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE IF NOT EXISTS `staff` (
  `staffid` bigint(20) NOT NULL AUTO_INCREMENT,
  `archived` tinyint(1) DEFAULT NULL,
  `emailid` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `firstname` varchar(255) NOT NULL,
  `initial` varchar(255) DEFAULT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastname` varchar(255) NOT NULL,
  `storeid` bigint(20) NOT NULL,
  PRIMARY KEY (`staffid`),
  KEY `fk4c7d2c0453ef05d` (`storeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `stafflogin`
--

CREATE TABLE IF NOT EXISTS `stafflogin` (
  `loginname` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `lastmodified` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) NOT NULL,
  `staffid` bigint(20) NOT NULL,
  PRIMARY KEY (`loginname`),
  KEY `fk8550e4894474009b` (`staffid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE IF NOT EXISTS `store` (
  `storeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `emailid` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `lastmodified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`storeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
  ADD CONSTRAINT `fk41580f77e8753f40` FOREIGN KEY (`approverid`) REFERENCES `staff` (`staffid`),
  ADD CONSTRAINT `fk41580f776d6225f7` FOREIGN KEY (`orderid`) REFERENCES `productorder` (`orderid`);

--
-- Constraints for table `ordercomment`
--
ALTER TABLE `ordercomment`
  ADD CONSTRAINT `fk777e1f516d6225f7` FOREIGN KEY (`orderid`) REFERENCES `productorder` (`orderid`),
  ADD CONSTRAINT `fk777e1f515c724796` FOREIGN KEY (`commentby`) REFERENCES `staff` (`staffid`);

--
-- Constraints for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `fkaa2f011ffad7d54b` FOREIGN KEY (`shippingtypeid`) REFERENCES `shippingtype` (`shippingtypeid`),
  ADD CONSTRAINT `fkaa2f011f4757493f` FOREIGN KEY (`productpartid`) REFERENCES `productpart` (`productpartid`),
  ADD CONSTRAINT `fkaa2f011f6d6225f7` FOREIGN KEY (`orderid`) REFERENCES `productorder` (`orderid`),
  ADD CONSTRAINT `fkaa2f011fab8d5cf9` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`);

--
-- Constraints for table `productandparts`
--
ALTER TABLE `productandparts`
  ADD CONSTRAINT `fk93cbc938ab8d5cf9` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`),
  ADD CONSTRAINT `fk93cbc9384757493f` FOREIGN KEY (`productpartid`) REFERENCES `productpart` (`productpartid`);

--
-- Constraints for table `productclassification`
--
ALTER TABLE `productclassification`
  ADD CONSTRAINT `fkb7434e95ab8d5cf9` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`),
  ADD CONSTRAINT `fkb7434e956d326bbb` FOREIGN KEY (`classificationtypeid`) REFERENCES `classificationtype` (`classificationtypeid`);

--
-- Constraints for table `productorder`
--
ALTER TABLE `productorder`
  ADD CONSTRAINT `fk3d5977bf453ef05d` FOREIGN KEY (`storeid`) REFERENCES `store` (`storeid`),
  ADD CONSTRAINT `fk3d5977bf4474009b` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`);

--
-- Constraints for table `productpart`
--
ALTER TABLE `productpart`
  ADD CONSTRAINT `fka7f3d62fad7d54b` FOREIGN KEY (`shippingtypeid`) REFERENCES `shippingtype` (`shippingtypeid`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk4c7d2c0453ef05d` FOREIGN KEY (`storeid`) REFERENCES `store` (`storeid`);

--
-- Constraints for table `stafflogin`
--
ALTER TABLE `stafflogin`
  ADD CONSTRAINT `fk8550e4894474009b` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
