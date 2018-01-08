 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongodbprocess = require('./mdbprocess');
/*
if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}
*/


app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.get('/go/:urlid', function(req, res) {
	var MongoClient = mongodb.MongoClient;
	var dburl = process.env.CONNECTION;

	MongoClient.connect(dburl, function(err, db) {
		if(err)
			console.log("error connecting to db on go redirect");
		else {
			console.log("connected");

			var collection = db.collection('urls');
			var urlarray = collection.find({
				id:parseInt(req.params.urlid)	
			}).toArray(function(err, documents) {
				if(documents.length > 0) {
					console.log(documents[0].actualurl);
					res.redirect(documents[0].actualurl);
				}
				else {
					var output = { error:"That is not a valid url" };
					res.status(200).type('txt').send(output);
				}
				
			});
		}
	});
	
});
app.get('/new/http://:url', function(req, res) {
    	var url = 'http://' +  req.params.url;
	if(url.indexOf(".com") != url.length - 4) {
		var error = { "error":"Incorrect Format" };
		res.type('txt').send(error);
	}
	else {
		var MongoClient = mongodb.MongoClient;
		var dburl = process.env.CONNECTION;
		var name = "";

		console.log(url);
		MongoClient.connect(dburl, function(err, db) {
			if(err)
				console.log("error");
			else {
				console.log("connected");
				
				var collection = db.collection('urls');
				var urlarray = collection.find({
					actualurl:url
				}).toArray(function(err, documents) {
					console.log(documents.length); 
					if (documents.length > 0) {
						console.log(documents[0].id);
						var output = { 
							original_url:documents[0].actualurl,
							short_url:"http://energetic-bird.com/go/" + documents[0].id
						}
						res.status(200);
						res.type('txt').send(output);
					}
					else {
						collection.count(function(err, count) {
							var suburl = count;
							var insertobby = { id:count + 1, actualurl:url};
							collection.insert(insertobby, function(err, data) { 
								if(err) {console.log("cannot insert object");}
								else {
									console.log("success");
									var output = {
										original_url:url,
										short_url:"http://energetic-bird.com/go/" + count + 1
									}
									res.status(200).type('txt').send(output);
								}
								console.log(count);
							});
						});
						
					}
				});
			
			}
			
		});
	}
});
// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

