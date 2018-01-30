/* jshint esnext: true */

var path = require("path");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var request = require("request");
var parseString = require('xml2js').parseString;



var app = express();

app.use(express.static("./public"));
app.use(cors());

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - `);
	next();
});


app.get("/autocomplete", function(req, res) {

	console.log(req.url);
	console.log(req.query);
	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	console.log(symbol);
	urlAC = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" + symbol;
	
	// console.log(urlPrice);

	request.get({
	    url: urlAC,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});


app.get("/compact", function(req, res) {

	console.log(req.url);
	console.log(req.query);
	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	console.log(symbol);
	urlPrice = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=compact&apikey=DA9Y6YJPSAAPQJ4X";
	
	// console.log(urlPrice);

	request.get({
	    url: urlPrice,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {

	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	res.setHeader('Content-Type', 'application/json');
        	res.header("Access-Control-Allow-Origin", "*");
        	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});


//Handling the FORM symbols

app.get("/myprice", function(req, res) {

	// console.log(req.url);
	// console.log(req.query);
	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	// console.log(symbol);
	urlPrice = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=full&apikey=DA9Y6YJPSAAPQJ4X";
	
	// console.log(urlPrice);

	request.get({
	    url: urlPrice,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});


app.get("/sma", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlSMA = "https://www.alphavantage.co/query?function=SMA&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlSMA,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/ema", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlEMA = "https://www.alphavantage.co/query?function=EMA&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";
	request.get({
	    url: urlEMA,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/stoch", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlSTOCH = "https://www.alphavantage.co/query?function=STOCH&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlSTOCH,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/rsi", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlRSI = "https://www.alphavantage.co/query?function=RSI&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlRSI,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/adx", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlADX = "https://www.alphavantage.co/query?function=ADX&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlADX,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/cci", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlCCI = "https://www.alphavantage.co/query?function=CCI&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlCCI,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/bbands", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlBBANDS = "https://www.alphavantage.co/query?function=BBANDS&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlBBANDS,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/macd", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlMACD = "https://www.alphavantage.co/query?function=MACD&symbol=" + symbol + "&interval=daily&time_period=10&series_type=close&apikey=DA9Y6YJPSAAPQJ4X";

	request.get({
	    url: urlMACD,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	      // data is already parsed as JSON:
	      	// console.log(data);
	      	res.setHeader('content-type', 'application/json');
			res.json(data);
	    }
	});

});

app.get("/seekalpha", function(req, res) {

	var temp = req.query;
	var symbol = temp.stocktickersymbol;
	urlSA = "https://seekingalpha.com/api/sa/combined/" + symbol + ".xml";

	request.get({
	    url: urlSA,
	    json: true,
	    headers: {'User-Agent': 'request'}
	  }, (err, response, data) => {
	    if (err) {
	    	console.log('Error:', err);
	    } else if (res.statusCode !== 200) {
	    	console.log('Status:', response.statusCode);
	    } else {
	    	var parseString = require('xml2js').parseString;
			var xml = data;
			parseString(xml, function (err, result) {
			    // console.log(data);
			    res.send(result);
			});
	    }
	});

});


if (module === require.main) {
  // Start the server
  var server = app.listen(process.env.port || 8080, function () {
    var port = server.address().port;

    console.log('App listening on port %s', port);
    console.log('Press Ctrl+C to quit.');
  });
}

module.exports = app;

