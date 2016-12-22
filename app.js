	 var express   =    require("express");
	 var bodyParser =    require("body-parser");
	 var mysql     =    require('mysql');
	 var app       =    express();
	 var dateFormat = require('dateformat');
	 var jsonParser = bodyParser.json();
	 var urlencodedParser = bodyParser.urlencoded({ extended: true });
	 var crypto = require('crypto');

	 var fs = require('fs');
	
	 
	 //app.use(bodyParser.urlencoded({ extended: true }));
	 
	 app.use(express.static('C:/Program Files/nodejs/site' + '/public'));

	 
	 
	 
	 var pool      =    mysql.createPool({
		 connectionLimit : 1000, //important
		 host     : 'localhost',
		 user     : 'root',
		 password : '',
		 database : 'serval_admin',
		 debug    :  false
	 });
	 
	 function handle_database(req,res) {
		 
		 
		  
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
	 
			 //console.log('connected as id ' + connection.threadId);
			 //console.log('req ==== ' + req.body.username+ " "+ req.body.password);
			 
			  connection.query('select * from users where username=? and password=?', [req.body.username,req.body.password], function(err, rows){
				
				 if(!err) {
					 if(rows.length>0){
						 
				console.log(rows);
					 connection.release();
					 return res.redirect('home.html');
					 
					 
					 }
					 else{
						 connection.release();
						 return res.redirect('index.html');
						 
					 }
					 
					 
				 }           
			 });
	  
			 connection.on('error', function(err) {      
				   connection.release();
				   res.json({"code" : 100, "status" : "Error in connection database"});
				   return;     
			 });
			 
			 //connection.release();
	   });
	 }
	 
	 
	 
	 function insert_users_database(req,res){
		 
		 
		
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
	 
			 //console.log('connected as id ' + connection.threadId);
			 //console.log('req ==== ' + req.body.username+ " "+ req.body.password);
			 
			
			
			//console.log(req.body.sender);

			 
			  connection.query('select * from user_data where sender=?', [req.body.sender], function(err, rows){
				 
				 if(!err) {
					 if(rows.length>0){
						 
						connection.release();
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('data exist'));
						res.end();
					 
					 }
					 else{
						 
						 //console.log(req.body.uuid);
						 
						  connection.query('INSERT into user_data(id,name,date,image,description,sender,public_key) values (?,?,?,?,?,?,?)',[req.body.uuid,req.body.name,req.body.date,req.body.image,req.body.description,req.body.sender,req.body.public_key],function(err,rows){
							 
							 if(!err){
								
									//console.log("came in success");
									connection.release();
									res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('success'));
						res.end();
									
							 }else{
								 connection.release();
								 res.writeHead(100, { 'Content-Type': 'application/json' });
								 res.write(JSON.stringify('insert unsuccessful'));
								 res.end();
							 }
							 
							 
						 }); 
						
					 }
					 
					 
				 }           
			 });
			 
			 
			 //connection.release();
	  
			 connection.on('error', function(err) {     
				   connection.release();			 
				   res.json({"code" : 100, "status" : "Error in connection database"});
				   return;     
			 });
	   }); 
		
		
		
		 
		 
		 
	 }
	 
	 
	 function insert_sensor_data(req,res) {
		 
		 
		  
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
	 
			 //console.log('connected as id ' + connection.threadId);
			 //console.log('req ==== ' + req.body.uuid);
			 
			 connection.query('select * from sensor_data where date=?', [req.body.created], function(err, rows){
				 
				 if(!err) {
					 
					 if(rows.length>0){
						 
						 connection.release();
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('data exist'));
						res.end();
						 
					 }
					 else{
						 
							connection.query('INSERT into sensor_data(id,date,latitude,longitude,sender) values (?,?,?,?,?)',[req.body.uuid,req.body.created,req.body.latitude,req.body.longitude,req.body.sender], function(err, rows){
							connection.release();
							if(!err) {
					 
								connection.release();
								res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('success'));
						res.end();
					 
								}    
								else{
									connection.release();
									res.writeHead(100, { 'Content-Type': 'application/json' });
									res.write(JSON.stringify('insert unsuccessful'));
									res.end();
								}	
								
							});
						 
					 }
					 
					 
				 }
				 
			 });
			 
			 
			 
	  //connection.release();
			 connection.on('error', function(err) {   
					connection.release();
				   res.json({"code" : 100, "status" : "Error in connection database"});
				   return;     
			 });
	   });
	 }
	 
	 
	 function get_name(req,res){
		 
		  pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
			 
			 
			// console.log(req.body.sen);
		 
		  connection.query('select name from user_data where sender=?', [req.body.sen], function(err, rows){
				 
				 if(!err) {
					 
					 if(rows.length>0){
						
						//console.log(rows[0].name);
						connection.release();
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify(rows[0].name));
						res.end();
						//return res.send(JSON.stringify(rows[0].name));
						
						 
					 }
					 else{
						 
					connection.release();
					res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('No data'));
						res.end();
						 
					 }
					 
					 
				 }
				 //connection.release(); 
				 
			 });
			 //connection.release();
			 
		 }); 
		 
		 
		 
		 
		 
		 
	 }
	 
	 
	 function save_tweets(req,res){
		 
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
			 
			 connection.query('select * from tweets where content=? and sender=?', [req.body.content,req.body.sender], function(err, rows){
				 
				 if(!err) {
					 
					 if(rows.length>0){
						
					connection.release();
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('data exist'));
						res.end();
						 
					 }
					 else{
						 
						 connection.query('INSERT into tweets (id,content,sender) values(?,?,?)',[req.body.id,req.body.content,req.body.sender],function(err,rows){
							if(!err){
								connection.release();
								res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('success'));
						res.end();
							} else{
								connection.release();
						res.writeHead(100, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('insert failed'));
						res.end();
							}
							 
						 });
						 
					
						 
					 }
					 
					 
				 }
				  //connection.release();
				 
			 });
			 
			 //connection.release();
		 });
		 
	 }
	 
	 
	 function save_messages(req,res){
		 
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
			 
			 connection.query('select * from messages where content=? and sender=?', [req.body.content,req.body.sender], function(err, rows){
				 
				 if(!err) {
					 
					 if(rows.length>0){
						
					connection.release();
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('data exist'));
						res.end();
						
						 
					 }
					 else{
						 
						 connection.query('INSERT into messages (id,content,sender,date,receiver) values(?,?,?,?,?)',[req.body.uuid,req.body.content,req.body.sender,req.body.created,req.body.receiver],function(err,rows){
							if(!err){
								connection.release();
								res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('success'));
						res.end();
							} else{
								connection.release();
						res.writeHead(100, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('insert failed'));
						res.end();
							}
							 
						 });
						 
					
						 
					 }
					 
					 
				 }
				  //connection.release();
				 
			 });
			 
			 //connection.release();
		 });
		 
	 }
	 
	 
	 
	 
	 function get_messages(req,res){
		 
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
			 
			 connection.query('select * from messages', function(err, rows){
				 
				 if(!err) {
					 
					 if(rows.length>0){
						 
						 
						
					connection.release();
					res.send(JSON.stringify(rows));
					res.end();
						
						 
					 }
					 else{
						 
					connection.release();
						res.writeHead(100, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('no data exist'));
						res.end();
						 
					 }
					 
					 
				 }
				  //connection.release();
				 
			 });
			 
			 //connection.release();
		 });
		 
	 }
	 
	 
	 function get_tweets(req,res){
		 
		 pool.getConnection(function(err,connection){
			 if (err) {
			   connection.release();
			   res.json({"code" : 100, "status" : "Error in connection database"});
			   return;
			 }   
			 
			 connection.query('select * from tweets', function(err, rows){
				 
				 if(!err) {
					 
					 if(rows.length>0){
						 
						 
						
					connection.release();
					res.send(JSON.stringify(rows));
					res.end();
						
						 
					 }
					 else{
						 
					connection.release();
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify('no data exist'));
						res.end();
						 
					 }
					 
					 
				 }
				  //connection.release();
				 
			 });
			 
			 //connection.release();
		 });
		 
	 }
	 
	 
	/*  function save_chat_file(req,res){
		 
			fs.writeFile("C:/Program Files/nodejs/site/public/chat/"+req.body.receiver+"_"+req.body.sender+"_m", "{"+'"created":'+req.body.created+" "+'"uuid":'+req.body.uuid+" "+'" content":'+req.body.content+" "+'" receiver":'+req.body.receiver+" "+'"sender":'+req.body.sender+"}", function(err) {
			if(err) {
			return console.log(err);
			}

			res.send("C:/Program Files/nodejs/site/public/chat/"+req.body.receiver+"_"+req.body.sender+"_m");
			console.log("The file is saved!");
		});  
	 } */
	 
	 
	 app.post("/login",urlencodedParser,function(req,res){
			 handle_database(req,res);
	 });
	 
	 app.post("/saveData",jsonParser,function(req,res){
		insert_users_database(req,res); 
		
	 });
	 
	 app.post("/message",jsonParser,function(req,res){
		 var fileStr="{"+'"created":'+req.body.created+","+'"uuid":"'+req.body.uuid+"\","+'"content":"'+req.body.content+"\","+'"receiver":"'+req.body.receiver+"\","+'"sender":"'+req.body.sender+"\"}";
		fs.writeFile("C:/Program Files/nodejs/site/public/chat/"+req.body.receiver+"_"+req.body.sender+"_m", fileStr, function(err) {
			if(err) {
			return console.log(err);
			}
			
			var arr=toUTF8Array(fileStr);
			
			var sha = crypto.createHash('sha512').update(String(fileStr));
			var result = sha.digest('hex');
			
			var ss=req.body.receiver+"_"+req.body.sender;
			res.send(JSON.stringify({a:ss,b:fileStr, c:result, }));
			console.log("The file is saved!");
		});  
		
	 });
	 
	 
	 app.post("/sensorData",jsonParser,function(req,res){
		 
		 insert_sensor_data(req,res);
		 
	 });
	 
	 app.post("/getName",jsonParser,function(req,res){
		 
		 get_name(req,res);
		 
	 }); 
	 
	 app.post("/tweetData",jsonParser,function(req,res){
		 
		 save_tweets(req,res);
		 
	 });
	 
	 app.post("/messagesData",jsonParser,function(req,res){
		 
		 save_messages(req,res);
		 
	 });
	 
	 app.post("/getMessages",jsonParser,function(req,res){
		 
		 get_messages(req,res);
		 
	 });
	 
	 app.post("/getTweets",jsonParser,function(req,res){
		 
		 get_tweets(req,res);
		 
	 });
	 
	 
	 function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

	 
	 
	 
	 app.listen(8088);