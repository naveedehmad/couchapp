
/**
 * Module dependencies.
 */

var express = require('express');
//  , routes = require('./routes');
console.log("Instance Create");
var ArticleProvider = require('./ap-couchdb').ArticleProvider;
console.log("Gets called");
//var app = module.exports = express.createServer();
var app = express.createServer();

app.configure(function(){
  	app.set('views', __dirname + '/views');
  	app.set('view engine', 'jade');
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.compiler({
		src: __dirname + '/views',
		enable: ['sass']
	}));
});
// Configuration
console.log("Abbout to connet...");
var aP = new ArticleProvider('https://mediatoss.iriscouch.com', 6984);
//var aP = new ArticleProvider('http://127.0.0.1', 11211);
//console.log("Connected!! Adding dummy!!");
/*
aP.save([
  {title: 'Post one', body: 'Body one', comments:[{author:'Bob', comment:'I love it'}, {author:'Dave', comment:'This is rubbish!'}]},
  {title: 'Post two', body: 'Body two'},
  {title: 'Post three', body: 'Body three'}
], function(error, articles){});
console.log("Saved data!!");
*/
console.log("Waiting for request!!");
app.get('/', function(req, res){
	aP.findAll(function(error, docs){
		console.log("Found articles!!" + docs);
		res.render('blogs_index.jade',{
			locals:{
				title: 'Blog',
				articles: docs
			}
		});
	})
});

app.get('/*.css', function(req, res){
	res.render(req.params[0] + '.css.sass', {layout: false});
});


app.listen(3000);