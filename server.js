var express    =    require('express');
var app        =    express();
var request = require("request");

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);



var server     =    app.listen(3000,function(){
console.log("Express is running on port 3000");
});


app.post('/testpage', function(appreq, appres) {
	request.get("https://api.yelp.com/v2/search?term=food&location=San+Francisco", function (err, res, body) {
		//console.log("hey");
	    if (!err) {
	        var resultsObj = JSON.parse(body);

	        appres.send(resultsObj);
	        console.log(resultsObj);
	    }
	});
});