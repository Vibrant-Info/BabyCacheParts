module.exports=function(app,passport,connection){
	var date = new Date();
	app.post('/addPart',function(req,res){
		connection.query("SELECT `code` FROM `productpart` WHERE `code` = '"+req.body.code+"'",function(err,rows){
			if(rows.length > 0){
				fnpart_link_item(req.body.code);
				res.send("1");
			}else{
				connection.query("INSERT INTO `productpart` (`archived`,`code`,`description`,`enabled`,`name`,`shippingtypeid`) VALUES ('false','"+req.body.code+"','"+req.body.name+"','1','"+req.body.name+"', '3')",function(err,result){			
					if(result.affectedRows == 1){
						fnpart_link_item(req.body.code);
						res.send("0");
					}				
				});
			}			
		});		
	});
	
	function fnpart_link_item(partcode){
		var temp_message = '';
		var str_temp = '';
		var item_display = '';
		
		var arr_partcode = partcode.split('-');
		
		if(arr_partcode[1] != '')
			str_temp = arr_partcode[1];
		else
			str_temp = '';
		
		var product_code_count = str_temp.length;
		var part_is = arr_partcode[0];
		
		if(str_temp[product_code_count - 1] == 'D'){
			item_display = 1;
			part_collection = str_temp.substring(0,product_code_count - 3);
			part_item = str_temp.substring(product_code_count - 3, product_code_count - 1);
			if(arr_partcode[2] != '')
				part_color = arr_partcode[2];
			else 
				part_color = '';
		}else{
			part_collection = str_temp.substring(0,product_code_count - 2);
			part_item = str_temp.substring(product_code_count - 2, product_code_count);
			if(arr_partcode[2] != '')
				part_color = arr_partcode[2];
			else 
				part_color = '';
		}
		if(part_is == 'P'){
			var sql_condition = '';
			if(part_item >= '80' && part_item <= '89' && part_color == 'ALL') {
				sql_condition += " AND (LOWER(code) LIKE LOWER('"+part_collection+"__-%') OR LOWER(code) LIKE LOWER('"+part_collection+"__D-%'))";
			}
			else if(part_item >= '80' && part_item <= '89') {
				sql_condition += " AND (LOWER(code) LIKE LOWER('"+part_collection+"__-"+part_color+"') OR LOWER(code) LIKE LOWER('"+part_collection+"__D-"+part_color+"'))";
			}else if(part_color == 'ALL') {
				sql_condition += " AND (LOWER(code) LIKE LOWER('"+part_collection+part_item+"-%') OR LOWER(code) LIKE LOWER('"+part_collection+part_item+"D-%'))";
			}
			else {
				sql_condition += " AND (LOWER(code) = LOWER('"+part_collection+part_item+"-"+part_color+"') OR LOWER(code) = LOWER('"+part_collection+part_item+"D-"+part_color+"'))";
			}
			
			var q  = connection.query("SELECT * FROM `product` WHERE 1=1"+sql_condition+" ORDER BY LOWER(code) ASC",function(err,arr_item){
				console.log(q.sql);
				if(arr_item.length > 0){
					console.log("entering")
					connection.query("SELECT * FROM productpart WHERE LOWER(code)=LOWER('"+partcode+"') ORDER BY LOWER(code) ASC",function(err,arr_part){				
						if(arr_part.length > 0){	
							for(var i_item=0; i_item < arr_item.length; i_item++) {								
								if(arr_item[i_item].enabled == '0') {
									console.log("Enabled entered");
									var arr_partcode_temp = arr_part[0]['code'].split('-');
									var str_temp = '';
									if(arr_partcode_temp[1] != '')
										str_temp = arr_partcode_temp[1];
									else
										str_temp = '';
									var product_code_count = str_temp.length;											
									var part_is_temp = arr_partcode_temp[0];
									
									if(str_temp[product_code_count - 1] == 'D'){
										item_display = 1;
										part_collection_temp = str_temp.substring(0,product_code_count - 3);
										part_item_temp = str_temp.substring(product_code_count - 3, product_code_count - 1);
										if(arr_partcode_temp[2] != '')
											part_color_temp = arr_partcode_temp[2];
										else 
											part_color_temp = '';
									}else{
										part_collection_temp = str_temp.substring(0,product_code_count - 2);
										part_item_temp = str_temp.substring(product_code_count - 2, product_code_count);
										if(arr_partcode_temp[2] != '')
											part_color_temp = arr_partcode_temp[2];
										else 
											part_color_temp = '';
									}
									
									if(!(part_item_temp >= '80' && part_item_temp <= '89')) {
										connection.query("UPDATE `product` SET enabled = '1' WHERE productid = '"+arr_item[i_item]['productid']+"'",function(err,result_update){
											
										});
									}
								}
								/* Checking and Associating Item & Part in Database */
								connection.query("SELECT * FROM productandparts WHERE productid='"+arr_item[i_item]['productid']+"' AND productpartid='"+arr_part[0]['productpartid']+"' ORDER BY productid ASC",function(err,arr_productandpart){			
									if(arr_productandpart.length > 0){
										connection.query("SELECT * FROM product WHERE productid='"+arr_productandpart[0]['productid']+"' ORDER BY LOWER(code) ASC",function(err,arr_item_temp){
											if(arr_item_temp.length > 0)
												console.log("...already associated with "+arr_item_temp[0]['code']+" : "+arr_item_temp[0]['name']+"");
											else
												console.log("...already associated with unknown item");
										});
									
									}else{
										connection.query("INSERT INTO `productandparts` (enabled,productid,productpartid) VALUES ('1','"+arr_item[i_item].productid+"','"+arr_part[0]['productpartid']+"')",function(err,obj_productpart){
											if(obj_productpart.affectedRows == 1){
												console.log("...associated with "+arr_item[i_item]['code']+" : "+arr_item[i_item]['name']+"");		
											}else{
												console.log("...unable to associate with "+arr_item[i_item]['code']+" : "+arr_item[i_item]['name']+"")
											}
										})
									}
									
								});
							}
						}
						//res.send("1");
					});
				}
			});
		}
		
	}

	app.post('/addProduct',function(req,res){		
		//var date = new Date();
		connection.query("SELECT * FROM product WHERE LOWER(code)=LOWER('"+req.body.code+"') ORDER BY LOWER(code) ASC",function(err,rows1){
			console.log("enter1");
			if(rows1.length > 0){
				fnitem_link_part(req.body.code);
				res.send("1");				
			}else{
				connection.query("SELECT * FROM product WHERE LOWER(name)=LOWER('"+req.body.name+"') ORDER BY LOWER(name) ASC",function(err,rows2){
					console.log("enter2");
					if(rows2.length > 0){
						res.send("2");
					}else{
						connection.query("SELECT * FROM product WHERE LOWER(skn)=LOWER('"+req.body.sku+"') ORDER BY LOWER(skn) ASC",function(err,rows3){
							console.log("enter3");
							if(rows3.length > 0){
								res.send("3");
							}else {
								connection.query("INSERT INTO `product` (`archived`,`lastmodified`,`code`,`description`,`enabled`, `name`,`sku`,`skn`) VALUES ('false',NOW(),'"+req.body.code+"','"+req.body.name+"','1','"+req.body.name+"','"+req.body.sku+"','"+req.body.sku+"')",function(err,result){
										var obj_item = result.insertId;
										if(result.affectedRows == 1){
											//res.send("0");
											connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.product+"') AND classificationid!=2 ORDER BY LOWER(name) ASC",function(err,rows){
												if(rows.length>0){											
													//res.send("nothing");											
												}else{													
												/* Checking and Adding Classification Type - Product Type to Database */
													connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.product+"') AND classificationid=2 ORDER BY LOWER(name) ASC",function(err,rows13){
														var item_product_id = 0;	
														if(rows13.length == 0){		
															connection.query("INSERT INTO classificationtype(`enabled`,`name`,`classificationid`) VALUES ('1','"+req.body.product+"','2')",function(err,result1){
																item_product_id = result1.insertId;
																if(result1.affectedRows == 1){
																	console.log("classificationtype data Prod Added");
																	addProdCls(item_product_id);
																}		
																else
																	console.log("Error: classificationtype data Not prod Added");
															});
														}else{
															if(rows13[0].classificationtypeid > 0){
																item_product_id = rows13[0].classificationtypeid;
																addProdCls(item_product_id)
															}
															else 
																item_product_id = 0;
														}
											/* Adding Item Classification Type - Collection to Database */	
														function addProdCls(item_product_id){
															if(obj_item > 0 && item_product_id > 0){
																console.log("Add Item to classification type");
																connection.query("SELECT * FROM productclassification WHERE classificationtypeid ='"+item_product_id+"' AND productid = '"+obj_item+"' ORDER BY productid ASC",function(err,rows14){
																	if(rows14.length >0)
																		console.log("productclassification data already there");
																	else{
																	var q = connection.query("INSERT INTO `productclassification` (`enabled`,`classificationtypeid`,`productid`) VALUES ('1','"+item_product_id+"','"+obj_item+"')",function(err,resultProdClassi){
																		console.log(q.sql);
																		if(resultProdClassi.affectedRows == 1)
																			console.log("productclassification data Added");
																		else
																			console.log("Error: productclassification data Not Added");																	
																	});
																	}
																});
															}
														}
														
													});												
												}												
												
											});
											/* Checking Classification Type - Color with All Type */
											connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+ req.body.color+"') AND classificationid!=1 ORDER BY LOWER(name) ASC",function(err,rows15){
												if(rows15.length >0)
													console.log("classificationtype data already there");
												else{
													connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+ req.body.color+"') AND classificationid = 1 ORDER BY LOWER(name) ASC",function(err,rows16){
														var item_color_id = 0;
														console.log(rows16);
														console.log(rows16.length);
														
														if(rows16.length == 0){
															connection.query("INSERT INTO `classificationtype` (`enabled`,`name`,`classificationid`) VALUES ('1','"+req.body.color+"','1')",function(err,resultColor){
																item_color_id = resultColor.insertId;
																console.log("dsfdfdsfdsfsdfsd   "+item_color_id);
																if(resultColor.affectedRows == 1){
																	addColor(item_color_id);
																	console.log("classificationtype data Added");
																}
																else
																	console.log("Error: classificationtype data Not Added");																	
															});
														}else{
															if(rows16[0].classificationtypeid > 0){
																item_color_id = rows16[0].classificationtypeid;						
																addColor(item_color_id);
															}				
															else 
																item_color_id = 0;
														}
														
														console.log("dfdfdsff"+obj_item);
														
														/* Adding Item Classification Type - Color to Database */
														function addColor(item_color_id){
															if(obj_item > 0  && item_color_id > 0 ){
															
															console.log("Add Item to classification type to color");
															connection.query("SELECT * FROM productclassification WHERE classificationtypeid='"+item_color_id+"' AND productid='"+obj_item+"' ORDER BY productid ASC",function(err,rows17){
																if(rows17.length >0)
																	console.log("productclassification data already there");
																else{
																connection.query("INSERT INTO `productclassification` (`enabled`,`classificationtypeid`,`productid`) VALUES ('1','"+item_color_id+"','"+obj_item+"')",function(err,resultProdClassiColor){
																	
																	if(resultProdClassiColor.affectedRows == 1)
																		console.log("productclassification Color data Added");
																	else
																		console.log("Error: productclassification color data Not Added");																	
																});
																}
															});
														}
													}
														
													});
												}
											});
											////////
											/* Checking Classification Type - Product Type with All Type*/
											connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+ req.body.item+"') AND classificationid!=3 ORDER BY LOWER(name) ASC",function(err,rows18){
												if(rows18.length >0)
													console.log("classificationtype data already there");
												else{
													connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+ req.body.item+"') AND classificationid = 3 ORDER BY LOWER(name) ASC",function(err,rows18){
														var item_item_id = 0;
														if(rows18.length == 0){
															connection.query("INSERT INTO `classificationtype` (`enabled`,`name`,`classificationid`) VALUES ('1','"+req.body.item+"','3')",function(err,resultItem){
																item_item_id = resultItem.insertId;
																if(resultItem.affectedRows == 1){
																	console.log("classificationtype data Added");
																	addItemCls(item_item_id);
																}	
																else
																	console.log("Error: classificationtype data Not Added");																	
															});
														}else{
															if(rows16[0].classificationtypeid > 0){
																item_item_id = rows16[0].classificationtypeid;
																addItemCls(item_item_id);
															}														
															else 
																item_item_id = 0;
														} 
														
														/* Adding Item Classification Type - Color to Database */
														function addItemCls(item_item_id){
															if(obj_item > 0 && item_item_id > 0){
																console.log("Add Item to classification type to color");
																connection.query("SELECT * FROM productclassification WHERE classificationtypeid='"+item_item_id+"' AND productid='"+obj_item+"' ORDER BY productid ASC",function(err,rows17){
																	if(rows17.length >0)
																		console.log("productclassification data already there");
																	else{
																	connection.query("INSERT INTO `productclassification` (`enabled`,`classificationtypeid`,`productid`) VALUES ('1','"+item_item_id+"','"+obj_item+"')",function(err,resultProdClassiColor){
																		if(resultProdClassiColor.affectedRows == 1)
																			console.log("productclassification Color data Added");
																		else
																			console.log("Error: productclassification color data Not Added");																	
																	});
																	}
																});
															}
														}
														
													});
												}
											});
											res.send("0");
										}
										if(err)
											return err;										
									});								
							}								
						});
					}	
				});
			}	
		});
	
			
			
	});
	app.post('/searchClassification',function(req,res){
		var WHERE = " 1 = 1";
		if(req.body.types != undefined)
			WHERE += " AND `classificationid` = '" + req.body.types+"'";
		if(req.body.name != undefined)
			WHERE += " AND `name` LIKE '%" + req.body.name+"%'";
		if(req.body.check != undefined){
			if(req.body.check != 2)
				WHERE += " AND `enabled` = '"+ req.body.check+"'";
			else 
				WHERE += " AND `enabled` IN (1,0)";
		}
		connection.query("SELECT * FROM `classificationtype` WHERE"+ WHERE+ "",function(err,rows){		
			
			if(err)
				return err;	
			res.send(rows);
		}); 
	});
	app.put('/chgeSts',function(req,res){	
		 connection.query("UPDATE `classificationtype` SET  `enabled` ="+req.body.val+" WHERE `classificationtypeid` = "+req.body.id+"",function(err,result){
			if(err)
				return err;	
			res.send(result);
		}); 
	});

	
	function fnitem_link_part(itemcode){
		console.log(itemcode);
		var arr_itemcode = itemcode.split('-');
		
		if(arr_itemcode[0].length > 0)
			str_temp = arr_itemcode[0];
		else 
			str_temp = '';
		
		var item_display = 0;
		var item_collection = '';
		var item_item = '';
		var item_color = '';
		var product_code_count = str_temp.length;
		
		if(str_temp[product_code_count - 1] == 'D'){
			item_display = 1;
			item_collection = str_temp.substring(0,product_code_count - 3);
			item_item = str_temp.substring(product_code_count - 3, product_code_count - 1);
			if(arr_itemcode[1] != '')
				item_color = arr_itemcode[1];
			else 
				item_color = '';
		}else{
			item_collection = str_temp.substring(0,product_code_count - 2);
			item_item = str_temp.substring(product_code_count - 2, product_code_count);
			if(arr_itemcode[1] != '')
				item_color = arr_itemcode[1];
			else 
				item_color = '';
		}
		var i_partids=[];
		connection.query("SELECT * FROM `productpart` WHERE (LOWER(code) LIKE LOWER('P-"+item_collection+item_item+"-"+item_color+"-%') OR LOWER(code) LIKE LOWER('P-"+item_collection+item_item+"-ALL-%') OR LOWER(code) LIKE LOWER('P-"+item_collection+"8_-"+item_color+"-%') OR LOWER(code) LIKE LOWER('P-"+item_collection+"8_-ALL-%')) ORDER BY LOWER(code) ASC",function(err,rows18){
			var i=0;
			for(var i_part=0; i_part<rows18.length; i_part++){
				i_partids.push(rows18[i_part]);
				i++;
				if(i == rows18.length){
					
					product_function(i_partids,itemcode);
				}
			}
				
		});		
	}
	function product_function(rows18,itemcode){
		var id;
		var prod_id;		
		
		connection.query("SELECT * FROM product WHERE LOWER(code)=LOWER('"+itemcode+"') ORDER BY LOWER(code) ASC",function(err,rows19){	
			prod_id  = rows19[0].productid;
			sts  = rows19[0].enabled;
				if(rows19.length > 0){
				for(var i_part=0; i_part<rows18.length; i_part++){
					id = rows18[i_part].productpartid;				
							
					connection.query("SELECT * FROM productandparts WHERE productid='"+prod_id+"' AND productpartid='"+id+"' ORDER BY productid ASC",function(err,row20){
						console.log(row20);
						if(row20.length > 0){
							connection.query("SELECT * FROM productpart WHERE productpartid='"+row20[0]['productpartid']+"' ORDER BY LOWER(code) ASC",function(err,row21){
								if(row21.length > 0)
									console.log("Already associated with some other Part");
								else
									console.log("Already associated with Unknown Part");
							});
							
							/* if(row20[0]['enabled'] == 0){
								var arr_partcode_temp = rows18[i_part]['code'].split('-');
								var str_temp = '';
								if(arr_partcode_temp[1] != '')
									str_temp = arr_partcode_temp[1];
								else 
									str_temp = '';
								var product_code_count = str_temp.length;
								var part_is_temp = arr_partcode_temp[0];
								
								if(str_temp[product_code_count - 1] == 'D'){
									item_display = 1;
									item_collection = str_temp.substring(0,product_code_count - 3);
									item_item = str_temp.substring(product_code_count - 3, product_code_count - 1);
									if(arr_itemcode[1] != '')
										item_color = arr_itemcode[1];
									else 
										item_color = '';
								}else{
									item_collection = str_temp.substring(0,product_code_count - 2);
									item_item = str_temp.substring(product_code_count - 2, product_code_count);
									if(arr_itemcode[1] != '')
										item_color = arr_itemcode[1];
									else 
										item_color = '';
								}
							} */
							
						}else{
							var part_item_collection = '';
							var part_item_item = '';
							var part_item_color = '';
							
							connection.query("INSERT INTO `productandparts` VALUES ('1', '"+prod_id+"', '"+id+"')",function(err,resultPaP){
								if(resultPaP.affectedRows == 1){
									if(sts == 0){
										if(row20[0]['enabled'] == 0){
											var arr_partcode_temp = rows18[i_part]['code'].split('-');
											var str_temp = '';
											if(arr_partcode_temp[1] != '')
												str_temp = arr_partcode_temp[1];
											else 
												str_temp = '';
											var product_code_count = str_temp.length;
											var part_is_temp = arr_partcode_temp[0];
											
											if(str_temp[product_code_count - 1] == 'D'){
												item_display = 1;
												part_item_collection = str_temp.substring(0,product_code_count - 3);
												part_item_item = str_temp.substring(product_code_count - 3, product_code_count - 1);
												if(arr_itemcode[1] != '')
													part_item_color = arr_itemcode[1];
												else 
													part_item_color = '';
											}else{
												part_item_collection = str_temp.substring(0,product_code_count - 2);
												part_item_item = str_temp.substring(product_code_count - 2, product_code_count);
												if(arr_itemcode[1] != '')
													part_item_color = arr_itemcode[1];
												else 
													part_item_color = '';
											}
											
											if(!(part_item_temp >= '80' && part_item_temp <= '89')) {
												connection.query("UPDATE `product` SET `enabled` = '1' WHERE `productid` = '"+prod_id+"'",function(err,resultUP){
													if(resultUP.affectedRows == 1){
														console.log("'"+prod_id+"' was enabled");
													}
												});
												
											}
											
										} 
									}
								}
							});
						}					
					});
					
				}
			
			}
		});				
	}
	app.get('/getProdCodes',function(req,res){
		connection.query("SELECT `code`,`sku` FROM `product`",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getClassificationType',function(req,res){			
		connection.query("SELECT `name` FROM `classificationtype` WHERE `classificationid` = '1'",function(err,Ccolor){
			if(err)
				return err;
			else{
				connection.query("SELECT `name` FROM `classificationtype` WHERE `classificationid` = '2'",function(err,Ccollection){
					if(err)
						return err;
					else
					{
						connection.query("SELECT `name` FROM `classificationtype` WHERE `classificationid` = '3'",function(err,Cprod){
						if(err)
							return err;
						
							var classification = {color: Ccolor, collection: Ccollection, prod: Cprod};							
							res.send(classification);						
						});
					}
				});				
			}		
		});
	});
 app.post('/getProducts',function(req,res){
		var prod_item=req.body;
		var productids=[];
		var prid=[];
		var conditions="1=1";
		var classifications=[];
		var products=[];
		var productid1=[];
		var productid2=[];
		var productid3=[];
		var productid4=[];
		var pp1=[];
		var pp2=[];
		var pp3=[];
		var pp4=[];
		var pp5=[];
		var pp6=[];
		var pp7=[];
		
		if(prod_item.skn != undefined)
			conditions += " AND `skn` = '" + prod_item.skn.sku +"'";
		if(prod_item.model != undefined)
			conditions += " AND `code` ='" + prod_item.model.code +"'";	
		if(prod_item.prname != undefined)
			conditions += " AND `name` LIKE '%" + prod_item.prname +"%'";
		if(prod_item.prdesc != undefined)
			conditions += " AND `description` LIKE '%" + prod_item.prdesc +"%'";
		if(prod_item.check != undefined){
			if(prod_item.check != 2)
				conditions += " AND `enabled` = '"+ prod_item.check+"'";
			else 
				conditions += " AND `enabled` IN (1,0)";
		}
		if(prod_item.skn != undefined || prod_item.model != undefined || prod_item.prname != undefined ||  prod_item.prdesc != undefined || prod_item.check != undefined){
			connection.query('SELECT * FROM product where '+ conditions,function(err,rows){				;
				if(err)
					return err;			
				if(rows.length>0){
					connection.query("SELECT p.*,(SELECT `name` FROM `classificationtype` AS ct,`productclassification` AS pc WHERE ct.`classificationtypeid` = pc.`classificationtypeid` AND `classificationid` = '1' AND pc.productid = '"+ rows[0].productid+"' ) AS color,(SELECT `name` FROM `classificationtype` AS ct,`productclassification` AS pc WHERE ct.`classificationtypeid` = pc.`classificationtypeid` AND `classificationid` = '2' AND pc.productid = '"+ rows[0].productid+"' ) AS style,(SELECT `name` FROM `classificationtype` AS ct,`productclassification` AS pc WHERE ct.`classificationtypeid` = pc.`classificationtypeid` AND `classificationid` = '3' AND pc.productid = '"+ rows[0].productid+"' ) AS type FROM `productclassification` AS pcla, `product` AS p WHERE pcla.productid = '"+ rows[0].productid+"' AND p.productid = '"+ rows[0].productid+"' LIMIT 0,1",function(err,fProd){					
						res.send(fProd);
					})
						
				}
				else{
					res.send("0");
				}
				
			});
	
		}
		if(prod_item.typename!=undefined || prod_item.stylename!=undefined || prod_item.colorname!=undefined ){
			if(prod_item.typename!=undefined){
				var class3 = {id: '3', name: prod_item.typename.name};
					classifications.push(class3);
				/* var a1=connection.query("SELECT classificationtypeid as 'pr_typeid' FROM classificationtype WHERE classificationid=3 and name='"+prod_item.typename.name+"'",function(err,rows){
					console.log(a1.sql);
					if(err)
						return err;
					else{
						classificationid(rows[0].pr_typeid,2);
						
					}
				}); */
			}
			if(prod_item.stylename!=undefined){
				var class2 = {id: '2', name: prod_item.stylename.name};
					classifications.push(class2);
				/* var a2=connection.query("SELECT classificationtypeid as 'pr_styleid' FROM classificationtype WHERE classificationid=2 and name='"+prod_item.stylename.name+"'",function(err,rows2){
					console.log(a2.sql);
					if(err)
						return err;
					else{
						
							classificationid(rows2[0].pr_styleid,2);
						
					}
				}); */
			}
			if(prod_item.colorname!=undefined){
				var class1 = {id: '1', name: prod_item.colorname.name};
				classifications.push(class1);
				/* var a3=	connection.query("SELECT classificationtypeid as 'pr_colorid' FROM classificationtype WHERE classificationid=1 and name='"+prod_item.colorname.name+"'",function(err,rows3){
					console.log(a3.sql);
					if(err)
						return err;
					else{
				
							classificationid(rows3[0].pr_styleid,2);
						
					}
				}); */
			}
			getClassifications(classifications);

		}
		function getClassifications(classificationtypes){
			var b=0;
			for(var i=0;i<classificationtypes.length;i++){
				var a3=connection.query("SELECT classificationtypeid,classificationid FROM classificationtype WHERE classificationid='"+classificationtypes[i].id+"' and name='"+classificationtypes[i].name+"'",function(err,rows3){
					console.log(a3.sql);
					console.log(rows3);
					if(err)
						return err;
					else{
						
							
							productids.push(rows3);
							b++;
							if(b == classificationtypes.length){
								classificationid(productids);
							}
							//classificationid(rows3[0].pr_styleid);
						
					}
				}); 
			}
		}
		
		
	function classificationid(id){
		var b=0;
		console.log(id.length);
		for(var i=0;i<id.length;i++){
			console.log(id[i][0].classificationtypeid);
			 var a=connection.query("SELECT productid from productclassification WHERE classificationtypeid="+id[i][0].classificationtypeid,function(err,rows4){
				
				if(err){
					return err;
				}
				else{	
					prid.push(rows4);
					b++;
					if(b == id.length){
					getProduct(prid);
					}
				}
			});
		
	}
	}
	function getProduct(ids,id){
		console.log("ids");
		console.log(ids);
		
		var a=0;
		var b=0;
		 for(var i=0;i<ids.length;i++){
			 if(i==0){
			  productid1.push(ids[i]);
			 } 
			 if(i==1){
				 productid2.push(ids[i]);
			 } if(i==2){
				  productid3.push(ids[i]);
			 }
		 }
		
		if(productid1.length>0){
		 while(a<1){
			 if(productid1[0][b]=== undefined){
				break;
			 }
			 else
			 {
			
			 pp1.push((productid1[0][b].productid));
			  b++;
			 }
			}
		}
		if(productid2.length>0){
			b=0;
			while(a<1){
				
				 if(productid2[0][b]===undefined){
					 break;
				 } 
				 else
				 {
					pp1.push(productid2[0][b].productid);
					b++;
				}
			}
		}
		if(productid3.length>0){
		b=0;
			while(a<1){
				 
				 if(productid3[0][b]===undefined){
					 break;
				 }
				 else{
					 pp1.push(productid3[0][b].productid);
					b++;
				 }
			}
		}
		b=0;
		var finalProduct=[];
		
		for(var i=0;i<pp1.length;i++){
			var q= connection.query("SELECT p.*,(SELECT `name` FROM `classificationtype` AS ct,`productclassification` AS pc WHERE ct.`classificationtypeid` = pc.`classificationtypeid` AND `classificationid` = '1' AND pc.productid = '"+ pp1[i]+"' ) AS color,(SELECT `name` FROM `classificationtype` AS ct,`productclassification` AS pc WHERE ct.`classificationtypeid` = pc.`classificationtypeid` AND `classificationid` = '2' AND pc.productid = '"+ pp1[i]+"' ) AS style,(SELECT `name` FROM `classificationtype` AS ct,`productclassification` AS pc WHERE ct.`classificationtypeid` = pc.`classificationtypeid` AND `classificationid` = '3' AND pc.productid = '"+ pp1[i]+"' ) AS type FROM `productclassification` AS pcla, `product` AS p WHERE pcla.productid = '"+ pp1[i]+"' AND p.productid = '"+ pp1[i]+"' LIMIT 0,1",function(err,rows){
				
				console.log(rows);
				if(err)
					return err;
				
				if(rows.length>0){
					finalProduct.push(rows);
					b++;
					if(b == pp1.length){
						res.send(finalProduct);
					}
				}
				else{
					res.send("0");
				}
				
			});
		}
	
	}
		
	}); 
	
	app.post('/updateProduct',function(req,res){
	
		var arr_item_current = fnget_item(req.body.productid);
		
		function fnget_item(prod_id){
			var WHERE;
			var type ='id';
			var returnArray = {};
			
			if(type == 'id')
				WHERE = "product.productid=" +prod_id+ " ORDER BY code ASC";
			else
				WHERE = "product.code='" +prod_id+ "' ORDER BY code ASC";
			connection.query("SELECT product.*, COALESCE((SELECT classificationtype.name FROM classificationtype WHERE COALESCE((SELECT 1 FROM productclassification WHERE productclassification.classificationtypeid = classificationtype.classificationtypeid AND productclassification.productid = product.productid LIMIT 1), 0) = 1 AND classificationtype.classificationid = 2 LIMIT 1), '---') AS type_product, COALESCE((SELECT classificationtype.name FROM classificationtype WHERE COALESCE((SELECT 1 FROM productclassification WHERE productclassification.classificationtypeid = classificationtype.classificationtypeid AND productclassification.productid = product.productid LIMIT 1), 0) = 1 AND classificationtype.classificationid = 1 LIMIT 1), '---') AS type_color, COALESCE((SELECT classificationtype.name FROM classificationtype WHERE COALESCE((SELECT 1 FROM productclassification WHERE productclassification.classificationtypeid = classificationtype.classificationtypeid AND productclassification.productid = product.productid LIMIT 1), 0) = 1 AND classificationtype.classificationid = 3 LIMIT 1), '---') AS type_item FROM product WHERE "+WHERE+"",function(err,collections){			
					
					if(collections.length > 0){								
							connection.query("SELECT * FROM product WHERE productid!='" +req.body.productid+"' AND LOWER(code)=LOWER('"+req.body.code+"') ORDER BY LOWER(code) ASC",function(err,rows1){			
								if(rows1.length > 0){
									fnitem_link_part(req.body.code);
									res.send("1");				
								}else{
									connection.query("SELECT * FROM product WHERE productid!='" +req.body.productid+"' AND LOWER(name)=LOWER('"+req.body.name+"') ORDER BY LOWER(name) ASC",function(err,rows2){
										console.log("enter2");
										if(rows2.length > 0){
											res.send("2");
										}else{
											connection.query("SELECT * FROM product WHERE productid!='" +req.body.productid+"' AND (LOWER(skn)=LOWER('"+req.body.sku+"') OR LOWER(sku)=LOWER('"+req.body.sku+"')) ORDER BY LOWER(skn) ASC, LOWER(sku) ASC",function(err,rows3){
												console.log("enter3");
												if(rows3.length > 0){
													res.send("3");
												}else {
													connection.query("UPDATE `product` SET `code` ='"+req.body.code+"',`description` ='"+req.body.name+"', `lastmodified` =NOW(),`name` ='"+req.body.name+"', `skn` ='"+req.body.sku+"', `sku` ='"+req.body.sku+"' WHERE `productid` = '"+req.body.productid+"'  ",function(err,UpdateProd){
														if(UpdateProd.affectedRows == 1){
															if(req.body.style != collections[0].type_product || req.body.color != collections[0].type_color || req.body.type != collections[0].type_item){
																connection.query("DELETE FROM `productclassification` WHERE productid='"+prod_id+"'",function(err,resultDel){
																	if(resultDel.affectedRows > 0){
																		console.log(resultDel);
																		/* Checking Classification Type - Collection with All Type */
																		connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.style+"') AND classificationid!=2 ORDER BY LOWER(name) ASC",function(err,arr_item_check_product_all){
																			if(arr_item_check_product_all.length > 0){
																				console.log("classification type is associated with different type, other than collection - "+req.body.style);
																			}else{
																				var item_product_id = 0
																				/* Checking and Adding Classification Type - Collection to Database */
																				connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.style+"') AND classificationid=2 ORDER BY LOWER(name) ASC",function(err,arr_item_check_product){
																					console.log(arr_item_check_product);
																					if(arr_item_check_product.length == 0){
																						connection.query("INSERT INTO `classificationtype` (enabled, name, classificationid)VALUES ('1','"+req.body.style+"','2')",function(err,item_product_id){
																							if(item_product_id.affectedRows > 0)
																								console.log("New classification type is added as collection"+req.body.style);																								
																							else
																								console.log("Faild to classification type is added as collection"+req.body.style);
																						});
																					}else{
																						if(arr_item_check_product.length > 0)
																							item_product_id = arr_item_check_product[0].classificationtypeid;
																						else
																							item_product_id = 0;
																					}
																					/* Adding Item Classification Type - Collection to Database */
																					if(prod_id > 0 && item_product_id > 0){
																						connection.query("SELECT * FROM productclassification WHERE classificationtypeid='"+item_product_id+"' AND productid='"+prod_id+"' ORDER BY productid ASC",function(err,arr_item_check_productclassification){
																							if(arr_item_check_productclassification.length > 0)
																								console.log("item was already added to collection"+req.body.style);
																							else{
																								connection.query("INSERT INTO `productclassification` (enabled,classificationtypeid,productid) VALUES ('1','"+item_product_id+"','"+prod_id+"')",function(err,item_productclassification_id){
																									if(item_productclassification_id.affectedRows >0){
																										if( req.body.style != collections[0].type_product)
																											console.log("item is added to collection - "+req.body.style);
																									}else{
																										console.log("item failed to add in collection - "+req.body.style);
																									}	
																								});
																							}
																						});
																					}
																				});
																			}
																			
																		});
																		/* Checking Classification Type - Color with All Type */
																		connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.color+"') AND classificationid!=1 ORDER BY LOWER(name) ASC",function(err,arr_item_check_product_all){
																			if(arr_item_check_product_all.length > 0)
																				console.log("classification type is associated with different type, other than color - "+req.body.color);
																			else{
																				var item_color_id = 0
																				/* Checking and Adding Classification Type - Color to Database */
																				connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.color+"') AND classificationid=1 ORDER BY LOWER(name) ASC",function(err,arr_item_check_color){
																					console.log(arr_item_check_color);
																					if(arr_item_check_color.length == 0){
																						connection.query("INSERT INTO `classificationtype` (enabled, name, classificationid)VALUES ('1','"+req.body.color+"','1')",function(err,item_color_id){
																							if(item_color_id.affectedRows > 0)
																								console.log("New classification type is added as collection"+req.body.color);																								
																							else
																								console.log("Faild to classification type is added as collection"+req.body.color);
																						});
																					}else{
																						if(arr_item_check_color.length > 0)
																							item_color_id = arr_item_check_color[0].classificationtypeid;
																						else
																							item_color_id = 0;
																					}
																					/* Adding Item Classification Type - Collection to Database */
																					if(prod_id > 0 && item_color_id > 0){
																						connection.query("SELECT * FROM productclassification WHERE classificationtypeid='"+item_color_id+"' AND productid='"+prod_id+"' ORDER BY productid ASC",function(err,arr_item_check_productclassification){
																							if(arr_item_check_productclassification.length > 0)
																								console.log("item was already added to collection"+req.body.color);
																							else{
																								connection.query("INSERT INTO `productclassification` (enabled,classificationtypeid,productid) VALUES ('1','"+item_color_id+"','"+prod_id+"')",function(err,item_productclassification_id){
																									if(item_productclassification_id.affectedRows >0){
																										if( req.body.color != collections[0].type_product)
																											console.log("item is added to collection - "+req.body.color);
																									}else{
																										console.log("item failed to add in collection - "+req.body.color);
																									}	
																								});
																							}
																						});
																					}
																				});
																			}
																		});
																// START OF PRODUCT TYPE
																		/* Checking Classification Type - Color with All Type */
																		connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.type+"') AND classificationid!=3 ORDER BY LOWER(name) ASC",function(err,arr_item_check_product_all){
																			if(arr_item_check_product_all.length > 0)
																				console.log("classification type is associated with different type, other than color - "+req.body.type);
																			else{
																				var item_item_id = 0
																				/* Checking and Adding Classification Type - Type to Database */
																				connection.query("SELECT * FROM classificationtype WHERE LOWER(name)=LOWER('"+req.body.type+"') AND classificationid=3 ORDER BY LOWER(name) ASC",function(err,arr_item_check_item){
																					console.log(arr_item_check_item);
																					if(arr_item_check_item.length == 0){
																						connection.query("INSERT INTO `classificationtype` (enabled, name, classificationid)VALUES ('1','"+req.body.type+"','3')",function(err,item_item_id){
																							if(item_item_id.affectedRows > 0)
																								console.log("New classification type is added as collection"+req.body.type);																								
																							else
																								console.log("Faild to classification type is added as collection"+req.body.type);
																						});
																					}else{
																						if(arr_item_check_item.length > 0)
																							item_item_id = arr_item_check_item[0].classificationtypeid;
																						else
																							item_item_id = 0;
																					}
																					/* Adding Item Classification Type - Collection to Database */
																					if(prod_id > 0 && item_item_id > 0){
																						connection.query("SELECT * FROM productclassification WHERE classificationtypeid='"+item_item_id+"' AND productid='"+prod_id+"' ORDER BY productid ASC",function(err,arr_item_check_productclassification){
																							if(arr_item_check_productclassification.length > 0)
																								console.log("item was already added to collection"+req.body.type);
																							else{
																								connection.query("INSERT INTO `productclassification` (enabled,classificationtypeid,productid) VALUES ('1','"+item_item_id+"','"+prod_id+"')",function(err,item_productclassification_id){
																									if(item_productclassification_id.affectedRows >0){
																										if( req.body.type != collections[0].type_product)
																											console.log("item is added to collection - "+req.body.type);
																									}else{
																										console.log("item failed to add in collection - "+req.body.type);
																									}	
																								});
																							}
																						});
																					}
																				});
																			}
																		});
																		
																		// END OF PRODUCT TYPE
																		
																	}
																	
																});
															}
															console.log("---------------------");
															console.log(req.body.code);
															console.log(collections[0].code);
															if(req.body.code != collections[0].code){
																console.log("Item Change to"+req.body.code);
																connection.query("DELETE FROM `productandparts` WHERE productid = '"+prod_id+"'",function(err,resultsDel){																
																	if(resultsDel.affectedRows > 0){
																		fnitem_link_part(req.body.code);
																	}
																});
															}
														}
													});
													
												}
												res.send("0");
											});	
										}
									});
								}
							});
					}	
					else
						return returnArray;
			});
			
		}
		function fnitem_link_part(itemcode){
			console.log("function call");
			var arr_itemcode = itemcode.split('-');
			
			if(arr_itemcode[0].length > 0)
				str_temp = arr_itemcode[0];
			else 
				str_temp = '';
			
			var item_display = 0;
			var item_collection = '';
			var item_item = '';
			var item_color = '';
			var product_code_count = str_temp.length;
			
			if(str_temp[product_code_count - 1] == 'D'){
				item_display = 1;
				item_collection = str_temp.substring(0,product_code_count - 3);
				item_item = str_temp.substring(product_code_count - 3, product_code_count - 1);
				if(arr_itemcode[1] != '')
					item_color = arr_itemcode[1];
				else 
					item_color = '';
			}else{
				item_collection = str_temp.substring(0,product_code_count - 2);
				item_item = str_temp.substring(product_code_count - 2, product_code_count);
				if(arr_itemcode[1] != '')
					item_color = arr_itemcode[1];
				else 
					item_color = '';
			}
			var i_partids=[];
			connection.query("SELECT * FROM `productpart` WHERE (LOWER(code) LIKE LOWER('P-"+item_collection+item_item+"-"+item_color+"-%') OR LOWER(code) LIKE LOWER('P-"+item_collection+item_item+"-ALL-%') OR LOWER(code) LIKE LOWER('P-"+item_collection+"8_-"+item_color+"-%') OR LOWER(code) LIKE LOWER('P-"+item_collection+"8_-ALL-%')) ORDER BY LOWER(code) ASC",function(err,rows18){
				var i=0;
				for(var i_part=0; i_part<rows18.length; i_part++){
					i_partids.push(rows18[i_part]);
					i++;
					if(i == rows18.length){
						
						product_function(i_partids,itemcode);
					}
				}
					
			});		
		}
	});
	
	app.put('/chgeStsProduct',function(req,res){
		console.log(req);
		var arr_item_current = fnget_item(req.body.val, req.body.id);
		
		function fnget_item(sts_val, prod_id){
			var WHERE;
			var type ='id';
			var returnArray = {};
			
			if(type == 'id')
				WHERE = "product.productid=" +prod_id+ " ORDER BY code ASC";
			else
				WHERE = "product.code='" +prod_id+ "' ORDER BY code ASC";
			connection.query("SELECT product.*, COALESCE((SELECT classificationtype.name FROM classificationtype WHERE COALESCE((SELECT 1 FROM productclassification WHERE productclassification.classificationtypeid = classificationtype.classificationtypeid AND productclassification.productid = product.productid LIMIT 1), 0) = 1 AND classificationtype.classificationid = 2 LIMIT 1), '---') AS type_product, COALESCE((SELECT classificationtype.name FROM classificationtype WHERE COALESCE((SELECT 1 FROM productclassification WHERE productclassification.classificationtypeid = classificationtype.classificationtypeid AND productclassification.productid = product.productid LIMIT 1), 0) = 1 AND classificationtype.classificationid = 1 LIMIT 1), '---') AS type_color, COALESCE((SELECT classificationtype.name FROM classificationtype WHERE COALESCE((SELECT 1 FROM productclassification WHERE productclassification.classificationtypeid = classificationtype.classificationtypeid AND productclassification.productid = product.productid LIMIT 1), 0) = 1 AND classificationtype.classificationid = 3 LIMIT 1), '---') AS type_item FROM product WHERE "+WHERE+"",function(err,collections){	
			
				console.log(collections);
				if(collections.length > 0){
					connection.query("UPDATE `product` SET  `enabled` ="+sts_val+" WHERE `productid` = "+prod_id+"",function(err,result){			
						if(result.affectedRows == 1){
							console.log("Updated Successfully");
							res.send("0");
						}else
							console.log("Unable to Update");						
					});
				}else
					console.log("Unable to locate ClassificationId");
			});
		}	
 
	});
}