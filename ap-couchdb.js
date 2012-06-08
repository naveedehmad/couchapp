var cradle = require('cradle');

ArticleProvider = function(host, port){
	console.log("Host: " + host + ", Port: " + port);
	this.connection = new (cradle.Connection)(host, port, {
		cache: true,
		raw: false
	});
	console.log("Connected to server. Host: " + this.connection.host);
	var ddb = this.connection.database('articles');
	
	ddb.exists(function(err, exists){
		if(err){
			console.log("Error: " + err);
		}else if(exists){
			console.log("Exists baby!!");
		}else{
			console.log("Doesn't exist. Creating one");
			ddb.create();
			console.log("created!!");
		}
	})
	this.db = ddb;
}

ArticleProvider.prototype.findAll = function(callback) {
    this.db.view('all/all_posts',function(error, result) {
      if( error ){
		console.log("Error fetching data: " + error.reason);
        callback(error)
      }else{
        var docs = [];
        result.forEach(function (row){
          docs.push(row);
        });
        callback(null, docs);
      } 
    });
	/*
    this.db.get("Post1", function(error, result) {
        if( error ){
			console.log("Error>>> " + error.error);
		}else{
	        var docs = [];
	        docs.push(result);
	        callback(null, docs);
		} 
   	});
	*/
};

ArticleProvider.prototype.findById = function(id, callback) {
    this.db.get(id, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
};

ArticleProvider.prototype.save = function(articles, callback) {
    if( typeof(articles.length)=="undefined")
      articles = [articles];

    for( var i =0;i< articles.length;i++ ) {
      article = articles[i];
      article.created_at = new Date();
      if( article.comments === undefined ) article.comments = [];
      for(var j =0;j< article.comments.length; j++) {
        article.comments[j].created_at = new Date();
      }
    }

    this.db.save(articles, function(error, result) {
      if( error ) callback(error)
      else callback(null, articles);
    });
};


exports.ArticleProvider = ArticleProvider;