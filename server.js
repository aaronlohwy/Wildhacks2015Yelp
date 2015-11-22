var express    =    require('express');
var app        =    express();
var request = require("request");
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var bodyParser = require('body-parser');
var qs = require('querystring');  
var _ = require('lodash');
//var CanvasJS = require('./canvasjs-1.7.0/canvasjs.min.js');

var html2 = '<!DOCTYPE html>\n' +
'<html> \n' +
'<head>\n' +
'<script type="text/javascript">\n' + 
'window.onload = function () {\n' +
'	var chart = new CanvasJS.Chart("chartContainer");\n'+
'	var restName = "RestaurantNameGoesHere";\n'+
'	chart.options.title = { text: \'Reviews for \' + restName };\n'+
'	chart.options.axisX = { title: \'Stars\'};\n'+
'	chart.options.axisY = { title: \'Ratings\'};\n'+
'	chart.options.legend = { text: \'Bubble size is coolness of review\'};\n'+
'	var series1 = { type: \'scatter\'};\n' +
'	chart.options.data = [];\n'+
'	chart.options.data.push(series1);\n'+
'	var stars = [3,4,2,3,4];\n'+
'	var ratings = [2,4,3,3,2];\n'+
'	var names = [\'tim\',\'jon\',\'will\',\'kevin\',\'jai\'];\n'+
'	var tmparray = [];\n'+
'	for (var i=0; i < stars.length; i++) {\n'+
'		tmparray.push({ x: stars[i], y: ratings[i], name: names[i]});}series1.dataPoints = tmparray; chart.render();}\n'+
'</script>\n'+
'<script type="text/javascript" src="./canvasjs-1.7.0/canvasjs.min.js"></script>\n'+
'</head>\n'+
'<body> \n' +
'	<div id="chartContainer" style="height: 300px; width: 100%;">Hello </div>\n'+
'</body> \n' +
'</html>';

var html = '<!DOCTYPE html>\n' + 
'<html>\n' + 
'<head>\n' +
'<script type="text/javascript">\n' + 
'window.onload = function () {\n' +
'	var chart = new CanvasJS.Chart("chartContainer");\n'+
'	var restName = "RestaurantNameGoesHere";\n'+
'	chart.options.title = { text: \'Reviews for \' + restName };\n'+
'	chart.options.axisX = { title: \'Stars\'};\n'+
'	chart.options.axisY = { title: \'Ratings\'};\n'+
'	chart.options.legend = { text: \'Bubble size is coolness of review\'};\n'+
'	var series1 = { type: \'scatter\'};\n' +
'	chart.options.data = [];\n'+
'	chart.options.data.push(series1);\n'+
'	var stars = [3,4,2,3,4];\n'+
'	var ratings = [2,4,3,3,2];\n'+
'	var names = [\'tim\',\'jon\',\'will\',\'kevin\',\'jai\'];\n'+
'	var tmparray = [];\n'+
'	for (var i=0; i < stars.length; i++) {\n'+
'		tmparray.push({ x: stars[i], y: ratings[i], name: names[i]});}series1.dataPoints = tmparray; chart.render();}\n'+
'</script>\n'+
'<script type="text/javascript" src="./canvasjs-1.7.0/canvasjs.min.js"></script>\n'+
'</head>\n'+
'<body>\n'+
'	<div id="chartContainer" style="height: 300px; width: 100%;"> </div>\n'+
'</body>\n' +
'</html>\n';

console.log(html);

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
	//console.log(apiURL);
	//apiURL = 'https://api.yelp.com/v2/business/yelp-san-francisco';
	  /* Then we use request to send make the API Request */
	  request(apiURL, function(error, response, body){
	  	var resultsObj = JSON.parse(body);
		var businessResults = [];
		for(i=0; i < resultsObj.businesses.length; i++) {
			businessResults.push([resultsObj.businesses[i].name, resultsObj.businesses[i].rating, resultsObj.businesses[i].review_count]);
		
		}
		console.log(html);
	  	//plotting(businessResults);
//	  	appres.send(resultsObj.businesses);
		appres.send(html2);
	    //return callback(error, response, body);
	  });

});

/*var axes=function(businesses){
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
			var cx = current[2];
			var cy = current[1];
			var cname = current[0];

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
				// dataPoints: [

				// { x: 132, y: 1070,name:"India" },
				// { x: 126, y: 2275,name:"Brazil" },
				// { x: 100, y: 1265,name:"Greece" },
				// { x: 110, y: 755,name:"Egypt" },
				// { x: 120, y: 1800,name:"Russia" },
				// { x: 91, y: 545,name:"China" },    
				// { x: 87, y: 1245,name:"Italy" },
				// { x: 44, y: 1221,name:"Spain" },
				// { x: 21, y: 801,name:"Latvia" },
				// { x: 18, y: 435,name:"Malaysia" },
				// { x: 53, y: 1780,name:"Mexico" },
				// { x: 20, y: 970,name:"Japan" },
				// { x: 35, y: 1795,name:"South Africa" },
				// { x: 19, y: 937,name:"Germany" },
				// { x: 6, y: 729,name:"Norway" },
				// { x: 4, y: 1315,name:"USA" },
				// { x: 13, y: 1660,name:"Canada" },
				// { x: 26, y: 1540,name:"Switzerland" },
				// { x: 1, y: 439,name:"Singapore" },
				// { x: 164, y: 3650,name:"Iraq" },
				// { x: 148, y: 1318,name:"Algeria" },
				// { x: 142, y: 2805,name:"Bhutan" },
				// { x: 135, y: 2900,name:"Sudan" },
				// { x: 123, y: 3015,name:"Uganda" },
				// { x: 105, y: 705,name:"Pakistan" },
				// { x: 113, y: 180,name:"Argentina" },
				// { x: 102, y: 1750,name:"Paraguay"},
				// { x: 80, y: 1180,name:"Croatia" },
				// { x: 71, y: 1063,name:"Turkey" },
				// { x: 51, y: 1085,name:"Hungary" },
				// { x: 42, y: 2830,name:"Columbia" },
				// { x: 30, y: 899,name:"Portugal" },
				// { x: 12, y: 686,name:"Saudi Arabia" },
				// { x: 29, y: 1248,name:"France" },
				// { x: 7, y: 1045,name:"UK" },
				// { x: 16, y: 1715,name:"Georgia" },
				// { x: 9, y: 1674,name:"Iceland" }

				// ]
				dataPoints:myDataPoints
			}
			]
		});

chart.render();
};*/
