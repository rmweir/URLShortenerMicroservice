var mongoclient = require('mongodb');
var fs = require('fs');

module.exports = function() {		
		var MongoClient = mongodb.MongoClient;
		var dburl = process.env.CONNECTION;
		
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
