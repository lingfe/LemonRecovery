/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.6.37 : Database - dahuodb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`dahuodb` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `dahuodb`;

/*Table structure for table `myContribution` */

DROP TABLE IF EXISTS `myContribution`;

CREATE TABLE `myContribution` (
  `id` varchar(32) NOT NULL COMMENT '我的贡献表id标识',
  `personalId` varchar(255) NOT NULL COMMENT '用户id',
  `resourceContribution` float DEFAULT '0' COMMENT '资源贡献(斤)',
  `lemonIntegral` int(11) DEFAULT '0' COMMENT '柠檬积分',
  `cityRanking` int(11) DEFAULT '0' COMMENT '城市排名',
  `usedClothes` float DEFAULT '0' COMMENT '旧衣服(斤)',
  `wastePaper` float DEFAULT '0' COMMENT '废纸(斤)',
  `other` float DEFAULT '0' COMMENT '其他(斤)',
  `state` int(11) DEFAULT '0' COMMENT '我的贡献表状态,0..',
  `cdate` datetime DEFAULT NULL COMMENT '创建时间',
  `mdate` datetime DEFAULT NULL COMMENT '最后修改时间',
  `creator` varchar(32) DEFAULT NULL COMMENT '创建人',
  `uman` varchar(32) DEFAULT NULL COMMENT '修改人',
  `df` int(11) DEFAULT '0' COMMENT '是否删除',
  `version` int(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `myContribution` */

LOCK TABLES `myContribution` WRITE;

insert  into `myContribution`(`id`,`personalId`,`resourceContribution`,`lemonIntegral`,`cityRanking`,`usedClothes`,`wastePaper`,`other`,`state`,`cdate`,`mdate`,`creator`,`uman`,`df`,`version`) values ('7c0eda18b16848419676241154c37f8e','20029ae4dd50400a88a7771eb95ac82e',0,0,0,0,0,0,0,'2017-11-10 14:57:22','2017-11-10 14:57:22','20029ae4dd50400a88a7771eb95ac82e','20029ae4dd50400a88a7771eb95ac82e',0,0);

UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
