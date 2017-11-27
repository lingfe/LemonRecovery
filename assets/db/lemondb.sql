
/*柠檬数据库*/
CREATE DATABASE lemondb;

USE lemondb;

/*1.预约表*/
DROP TABLE IF EXISTS `lemonRecovery`;

CREATE TABLE `lemonRecovery` (
  `id` VARCHAR(32) NOT NULL COMMENT '预约表id标识',
  `personalId` VARCHAR(255) NOT NULL COMMENT '用户id',
  `doorTime` VARCHAR(255) NOT NULL COMMENT '上门时间',
  `yuyueAdress` VARCHAR(255) NOT NULL COMMENT '预约地点',
  `adressInfo` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `cellYou` VARCHAR(255) NOT NULL COMMENT '对您称呼',
  `phone` VARCHAR(255) NOT NULL COMMENT '联系电话',
  `state` INT(11) DEFAULT '0' COMMENT '预约状态,0=未处理,1=已处理,2=不处理,3=已取消',
  
  `cdate` DATETIME DEFAULT NULL COMMENT '创建时间',
  `mdate` DATETIME DEFAULT NULL COMMENT '最后修改时间',
  `creator` VARCHAR(32) DEFAULT NULL COMMENT '创建人',
  `uman` VARCHAR(32) DEFAULT NULL COMMENT '修改人',
  `df` INT(11) DEFAULT '0' COMMENT '是否删除',
  `version` INT(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*2.申领旧衣表*/
DROP TABLE IF EXISTS applyOldclothes;
CREATE TABLE applyOldclothes(
	
	id VARCHAR(32) NOT NULL COMMENT '申领旧衣表id标识',
	`personalId` VARCHAR(255) NOT NULL COMMENT '用户id',
	contactPeople VARCHAR(255) NOT NULL COMMENT '联系人',
	phone VARCHAR(255) NOT NULL COMMENT '联系电话',
	`adressInfo` VARCHAR(255) NOT NULL COMMENT '详细地址',
	applyReason VARCHAR(255) NOT NULL COMMENT '申请原因',
	demandExplain VARCHAR(255) NOT NULL COMMENT '需求说明',
	`state` INT(11) DEFAULT '0' COMMENT '申领旧衣状态,0..',
	
  `cdate` DATETIME DEFAULT NULL COMMENT '创建时间',
  `mdate` DATETIME DEFAULT NULL COMMENT '最后修改时间',
  `creator` VARCHAR(32) DEFAULT NULL COMMENT '创建人',
  `uman` VARCHAR(32) DEFAULT NULL COMMENT '修改人',
  `df` INT(11) DEFAULT '0' COMMENT '是否删除',
  `version` INT(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;


/*3.可兑换商品表*/
DROP TABLE IF EXISTS convertibleCommodity;
CREATE TABLE convertibleCommodity(
	id VARCHAR(32) NOT NULL COMMENT '可兑换商品表id标识',
	imgUrl VARCHAR(255) NOT NULL COMMENT '商品图片',
	title VARCHAR(255) NOT NULL COMMENT '商品标题',
	integral INT(11) NOT NULL COMMENT '积分',
	surplus INT(11) NOT NULL COMMENT '剩余(件/个/份)',
	`state` INT(11) DEFAULT '0' COMMENT '可兑换商品状态,0..',
	
  `cdate` DATETIME DEFAULT NULL COMMENT '创建时间',
  `mdate` DATETIME DEFAULT NULL COMMENT '最后修改时间',
  `creator` VARCHAR(32) DEFAULT NULL COMMENT '创建人',
  `uman` VARCHAR(32) DEFAULT NULL COMMENT '修改人',
  `df` INT(11) DEFAULT '0' COMMENT '是否删除',
  `version` INT(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;


/*4.兑换订单表*/
DROP TABLE IF EXISTS convertibleOrder;
CREATE TABLE convertibleOrder(
	id VARCHAR(32) NOT NULL COMMENT '兑换订单表id标识',
	`personalId` VARCHAR(255) NOT NULL COMMENT '用户id',
	contactPeople VARCHAR(255) NOT NULL COMMENT '联系人',
	phone VARCHAR(255) NOT NULL COMMENT '联系电话',
	`adressInfo` VARCHAR(255) NOT NULL COMMENT '详细地址',
	imgUrl VARCHAR(255) NOT NULL COMMENT '商品图片',
	title VARCHAR(255) NOT NULL COMMENT '商品标题',
	integral INT(11) NOT NULL COMMENT '积分',
	totalIntegral INT(11) NOT NULL COMMENT '合计积分',
	number INT(11) NOT NULL COMMENT '兑换数量',
	`state` INT(11) DEFAULT '0' COMMENT '兑换订单状态,0=已提交,1=已完成,2..',

  `cdate` DATETIME DEFAULT NULL COMMENT '创建时间',
  `mdate` DATETIME DEFAULT NULL COMMENT '最后修改时间',
  `creator` VARCHAR(32) DEFAULT NULL COMMENT '创建人',
  `uman` VARCHAR(32) DEFAULT NULL COMMENT '修改人',
  `df` INT(11) DEFAULT '0' COMMENT '是否删除',
  `version` INT(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;



/*5.回收纪录表*/
DROP TABLE IF EXISTS recyclingRecords;
CREATE TABLE recyclingRecords(
	id  VARCHAR(32) NOT NULL COMMENT '回收纪录表id标识',
	`personalId` VARCHAR(255) NOT NULL COMMENT '用户id',
	lemonIntegral INT(11) DEFAULT '0' COMMENT '柠檬积分',
	usedClothes INT(11) DEFAULT '0' COMMENT '旧衣服(斤)',
	wastePaper INT(11) DEFAULT '0' COMMENT '废纸(斤)',
	other INT(11) DEFAULT '0'  COMMENT '其他(斤)',
	`state` INT(11) DEFAULT '0' COMMENT '回收纪录表状态,0..',
	collector VARCHAR(255) COMMENT '收集员编号',

  `cdate` DATETIME DEFAULT NULL COMMENT '创建时间',
  `mdate` DATETIME DEFAULT NULL COMMENT '最后修改时间',
  `creator` VARCHAR(32) DEFAULT NULL COMMENT '创建人',
  `uman` VARCHAR(32) DEFAULT NULL COMMENT '修改人',
  `df` INT(11) DEFAULT '0' COMMENT '是否删除',
  `version` INT(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*6.我的贡献表*/
DROP TABLE IF EXISTS `myContribution`;
CREATE TABLE `myContribution` (
  `id` VARCHAR(32) NOT NULL COMMENT '我的贡献表id标识',
  `personalId` VARCHAR(255) NOT NULL COMMENT '用户id',
  `resourceContribution` FLOAT DEFAULT '0' COMMENT '资源贡献(斤)',
  `lemonIntegral` INT(11) DEFAULT '0' COMMENT '柠檬积分',
  `cityRanking` INT(11) DEFAULT '0' COMMENT '城市排名',
  `usedClothes` FLOAT DEFAULT '0' COMMENT '旧衣服(斤)',
  `wastePaper` FLOAT DEFAULT '0' COMMENT '废纸(斤)',
  `other` FLOAT DEFAULT '0' COMMENT '其他(斤)',
  `state` INT(11) DEFAULT '0' COMMENT '我的贡献表状态,0..',
  `cdate` DATETIME DEFAULT NULL COMMENT '创建时间',
  `mdate` DATETIME DEFAULT NULL COMMENT '最后修改时间',
  `creator` VARCHAR(32) DEFAULT NULL COMMENT '创建人',
  `uman` VARCHAR(32) DEFAULT NULL COMMENT '修改人',
  `df` INT(11) DEFAULT '0' COMMENT '是否删除',
  `version` INT(11) DEFAULT '0' COMMENT '数据版本',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
