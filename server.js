var express    =    require('express');
var app        =    express();
var request = require("request");
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var bodyParser = require('body-parser');
var qs = require('querystring');  
var _ = require('lodash');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname));

var server     =    app.listen(3000,function(){
console.log("Express is running on port 3000");
});

app.get('/foobar', function(req, res){
	res.sendfile('views/canvas.html')
})

app.post('/test2', function(appreq, appres) {
	var location_input = appreq.body.location;
	var httpMethod = 'GET';

	  /* The url we are using for the request */
	  var url = 'http://api.yelp.com/v2/search';

	  /* We can setup default parameters here */
	  var default_parameters = {
	    location: 'San+Francisco',
	    sort: '0'
	  };
	  default_parameters.location = location_input;	  
	  console.log(default_parameters.location);
	  /* We set the require parameters here */
	  var required_parameters = {
	    oauth_consumer_key : "l_gIZ-IhV-OG5aMdl_zDjw",
	    oauth_token : "vpmW7MdcH_ETmkLhcp6zheL3gVpaYR_L",
	    oauth_nonce : n(),
	    oauth_timestamp : n().toString().substr(0,10),
	    oauth_signature_method : 'HMAC-SHA1',
	    oauth_version : '1.0'
	  };

	  /* We combine all the parameters in order of importance */ 
	  var parameters = _.assign(default_parameters, required_parameters);

	  /* We set our secrets here */
	  var consumerSecret = "yiV60bbJOonYNER9qQUoLMha7_g";
	  var tokenSecret = "ZDbP3f_aIyLgNUIgpEFzhB4BglU";

	  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
	  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
	  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

	  /* We add the signature to the list of paramters */
	  parameters.oauth_signature = signature;

	  /* Then we turn the paramters object, to a query string */
	  var paramURL = qs.stringify(parameters);

	  /* Add the query string to the url */
	  var apiURL = url+'?'+paramURL;

	  /* Then we use request to send make the API Request */
	  request(apiURL, function(error, response, body){
	  	var resultsObj = JSON.parse(body);
	  	//plotting(businesses);
	  	console.log(resultsObj);
	  	appres.send(resultsObj.businesses);

	    //return callback(error, response, body);
	  });

});

var axes=function(businesses){
	var xaxis=[];
	var yaxis=[];

	for(var i =0;i<businesses.length; i++){

		var current = businesses[i];

	}


};



var plotting = function (businesses) {
		
		var myDataPoints=[];
		for(var i =0;i<businesses.length; i++){

			var current = businesses[i];
			var cx=current.review_count;
			var cy=current.rating;
			var cname=current.name;

			myDataPoints.push({x:cx, y:cy,name:cname});


		}



		var chart = new CanvasJS.Chart("chartContainer",
		{
			title:{
				text: "Yelp Stuff",      
				fontFamily: "arial black",
				fontColor: "DarkSlateGrey"
			},
                        animationEnabled: true,
			axisX: {
				title:"Number of Ratings",
				titleFontFamily: "arial"

			},
			axisY:{
				title: "Stars",
				titleFontFamily: "arial",
				valueFormatString:"0 USD",
				titleFontSize: 12
			},

			data: [
			{        
				type: "scatter",  
				toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <br/> <strong>Cost/ container</strong> {y} $<br/> <strong>Ease of Business</strong> {x} ",
				
				dataPoints:myDataPoints
			}
			]
		});

chart.render();
};
