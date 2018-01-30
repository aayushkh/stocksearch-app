//-----------------------  JAVASCRIPT CODE  --------------------------

//----------------------  Global Variables  --------------------------

{
var SYM = "";
var PRI = "";
var CHACHING = "";
var CHACHINGPER = "";
var VOL = "";
var COUNT = 0;
var jsonArr = new Array();
var favList = new Array();
var smaX = ""; 
var emaX = "";
var stochX = ""; 
var rsiX = "";
var adxX = "";
var cciX = "";
var bbandsX = "";
var macdX = "";
var priceX = "";
var urlExp = "http://export.highcharts.com/";
var refresh;
var off;
var on;
}

function formHandler(symbol) {

    $("#rmvcursor").css({"cursor": "pointer"});
    document.getElementById("rightslide").className = "right-carousel-control btn";
    
    var update = function () {
            $("#right-icon").prop('disabled', false);
        };
    $(update);
    $("#right-icon").change(update);

    document.getElementById("fav-tab").className = "item";
    document.getElementById("stock-tab").className = "item active";
    
	document.getElementById("star-btn").className = "glyphicon glyphicon-star-empty";
    
    document.getElementById("tableProgress").className = "progress active";
    document.getElementById("stockTable").className = "table table-striped hidden";
    
    document.getElementById("priceProgress").className = "progress active";
    document.getElementById("price").className = "hidden";
    
    document.getElementById("smaProgress").className = "progress active";
    document.getElementById("sma").className = "hidden";
    
    document.getElementById("emaProgress").className = "progress active";
    document.getElementById("ema").className = "hidden";
    
    document.getElementById("stochProgress").className = "progress active";
    document.getElementById("stoch").className = "hidden";
    
    document.getElementById("rsiProgress").className = "progress active";
    document.getElementById("rsi").className = "hidden";
    
    document.getElementById("adxProgress").className = "progress active";
    document.getElementById("adx").className = "hidden";
    
    document.getElementById("cciProgress").className = "progress active";
    document.getElementById("cci").className = "hidden";
    
    document.getElementById("bbandsProgress").className = "progress active";
    document.getElementById("bbands").className = "hidden";
    
    document.getElementById("macdProgress").className = "progress active";
    document.getElementById("macd").className = "hidden";

    document.getElementById("histProgress").className = "progress active";
    document.getElementById("history").className = "hidden";

    document.getElementById("newsProgress").className = "progress active";
    document.getElementById("newsWells").className = "hidden";
    
    var firstWord = "";
    if(symbol == 0) {
        symbol = $("input").val();
        firstWord = symbol.substr(0,symbol.indexOf(" "));
        symbol = firstWord;
    }
    
    
    $.ajax({
        url: "/autocomplete?stocktickersymbol=" + symbol,
        type: "GET",

        success: function(data) {
            var acData = data;
            priceVolumeData(acData); 
        }
    });

    $.ajax({
		url: "/myprice?stocktickersymbol=" + symbol,
	  	type: "GET",

	  	success: function(data) {
	    	var priceData = data;
	    	priceVolumeData(priceData);	
	  	}
	});

	$.ajax({
		url: "/sma?stocktickersymbol=" + symbol,
	  	type: "GET",

	  	success: function(data) {
	    	var smaData = data;
    		generateData(smaData,"SMA");
	  	}
	});

	 $.ajax({
	 	url: "/ema?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var emaData = data;
     		generateData(emaData,"EMA");
	   	}
	 });

	 $.ajax({
	 	url: "/stoch?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var stochData = data;
	     	generateData(stochData,"STOCH");
	   	}
	 });

	 $.ajax({
	 	url: "/rsi?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var rsiData = data;
	     	generateData(rsiData,"RSI");
	   	}
	 });

	 $.ajax({
	 	url: "/adx?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var adxData = data;
	     	generateData(adxData,"ADX");
	   	}
	 });

	 $.ajax({
	 	url: "/cci?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var cciData = data;
	     	generateData(cciData,"CCI");
	   	}
	 });

	 $.ajax({
	 	url: "/bbands?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var bbandsData = data;
	     	generateData(bbandsData,"BBANDS");
	   	}
	 });

	 $.ajax({
	 	url: "/macd?stocktickersymbol=" + symbol,
	   	type: "GET",

	   	success: function(data) {
	     	var macdData = data;
	     	generateData(macdData,"MACD");
	   	}
	 });

	$.ajax({
		url: "/seekalpha?stocktickersymbol=" + symbol,
	  	type: "GET",

	  	success: function(data) {
	    	var SeekAlphaData = data;
	    	// console.log("Seeking Alpha");
	    	parseSeekingAlphaData(SeekAlphaData);
	  	}
	});
};



//--------------------------  FUNCTIONS TO GET THE DATA  --------------------------


function priceVolumeData(jsonObj){
    
    var localUnixTime = new Date().getTime();
    var nyDateTime = moment(localUnixTime).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
    var nyHour = moment(localUnixTime).tz('America/New_York').format('HH');
	var nyHourInt = parseInt(nyHour);
	var check = false;

    try {
        var temp = jsonObj["Meta Data"];
    }
    catch(e){
        document.getElementById("priceError").className = "alert alert-danger active";
        document.getElementById("histError").className = "alert alert-danger active";
        document.getElementById("tableError").className = "alert alert-danger active";
    }

    var timeStamp = "";
    var nyDateTime = jsonObj["Meta Data"]["3. Last Refreshed"];
    timeStamp = (moment(nyDateTime).unix())*1000;
    var abbr = moment.tz.zone('America/New_York').abbr(timeStamp);
    var symbol = "";
	var symbol = jsonObj["Meta Data"]["2. Symbol"];

	var datesPV = new Array();
	var pricePV = new Array();
	var volumePV = new Array();
		var price = new Array();
	var volume = new Array();
	var openArr = new Array();
	var highArr = new Array();
	var lowArr = new Array();
	var closeArr = new Array();
	var volumeArr = new Array();

	var TSObj;
	TSObj = jsonObj["Time Series (Daily)"];
	var TSKeys = Object.keys(TSObj);
	var TSValues = Object.values(TSObj);

	for (var i = 0; i < TSKeys.length; i++) {
		openArr[i] = parseFloat(TSObj[TSKeys[i]]["1. open"]);
		highArr[i] = parseFloat(TSObj[TSKeys[i]]["2. high"]);
		lowArr[i] = parseFloat(TSObj[TSKeys[i]]["3. low"]);
		closeArr[i] = parseFloat(TSObj[TSKeys[i]]["4. close"]);
		volumeArr[i] = parseInt(TSObj[TSKeys[i]]["5. volume"]);
	}

	for(i=0;i<126;i++){
        datesPV[i] = TSKeys[i].substring(5, TSKeys[i].length);
        pricePV[i] = closeArr[i];
        volumePV[i] = volumeArr[i];
    } 

    var close;
    var lastPrice;
    
    //during working hours
    if(nyHourInt > 8 && nyHourInt < 17 && nyDateTime.length!=10) {
        lastPrice = openArr[0].toFixed(2);
        close = closeArr[0].toFixed(2);
        timeStamp = nyDateTime + " " + abbr;
    }
    else {
        lastPrice = closeArr[0].toFixed(2);
        close = closeArr[0].toFixed(2);
        timeStamp = nyDateTime + "16:00:00 " + abbr;
    }
    
    var open = openArr[0];
    var prevClose = closeArr[1];
    var change = (closeArr[0] - closeArr[1]).toFixed(2);
    var changePercent = (((closeArr[0] - closeArr[1])/closeArr[1])*100).toFixed(2);
    var daysRange = lowArr[0] + " - " + highArr[0];
    var volume = volumeArr[0];
    var strVol = volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    SYM = symbol;
	PRI = close;
    CHACHING = change;
    CHACHINGPER = changePercent;
    VOL = volume;

    //Editing the table
    document.getElementById("row1").innerHTML = symbol;
    document.getElementById("row2").innerHTML = lastPrice;
    if(change > 0) {
    	document.getElementById("row3").innerHTML = "<p style='color: green;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' height=15px width=15px></p>";
    }
    else if(change < 0) {
    	document.getElementById("row3").innerHTML = "<span style='color: red;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png' height=15px width=15px></span>";
    }
    else if(change == 0) {
    	document.getElementById("row3").innerHTML = change + " (" + changePercent + "%)";
    }
    document.getElementById("row4").innerHTML = timeStamp;
    document.getElementById("row5").innerHTML = open;
    document.getElementById("row6").innerHTML = close;
    document.getElementById("row7").innerHTML = daysRange;
    document.getElementById("row8").innerHTML = strVol;

    
    document.getElementById("priceProgress").className = "progress hidden";
    document.getElementById("tableProgress").className = "progress hidden";
    document.getElementById("histProgress").className = "progress hidden";
    document.getElementById("stockTable").className = "table table-striped active";
    document.getElementById("fb-btn").className = "btn btn-default pull-right";
    document.getElementById("button-star").className = "btn btn-default pull-right";
    

    drawPriceVolChart(pricePV,volumePV,datesPV,symbol);
    
    var unixDates = new Array();
    var historicalData = new Array();
    
    for(i=0;i<1000;i++) {
        unixDates[i] = (new Date(TSKeys[i])).getTime();
        historicalData[i]=[unixDates[i],closeArr[i]];
    }
    
    drawHistChart(historicalData,symbol);
    
}

function generateData(jsonObj,indicator) {
	
    try {
    var symbol = jsonObj["Meta Data"]["1: Symbol"];
    }
    catch(e){
        if(indicator == "SMA"){
            document.getElementById("smaProgress").className = "progress hidden";
            document.getElementById("smaError").className = "alert alert-danger active";
        }
        else if(indicator == "EMA"){
            document.getElementById("emaProgress").className = "progress hidden";
            document.getElementById("emaError").className = "alert alert-danger active";
        }
        else if(indicator == "STOCH"){
            document.getElementById("stochProgress").className = "progress hidden";
            document.getElementById("stochError").className = "alert alert-danger active";
        }
        else if(indicator == "RSI"){
            document.getElementById("rsiProgress").className = "progress hidden";
            document.getElementById("rsiError").className = "alert alert-danger active";
        }
        else if(indicator == "ADX"){
            document.getElementById("adxProgress").className = "progress hidden";
            document.getElementById("adxError").className = "alert alert-danger active";
        }
        else if(indicator == "CCI"){
            document.getElementById("cciProgress").className = "progress hidden";
            document.getElementById("cciError").className = "alert alert-danger active";
        }
        else if(indicator == "BBANDS"){
            document.getElementById("bbandsProgress").className = "progress hidden";
            document.getElementById("bbandsError").className = "alert alert-danger active";
        }
        else if(indicator == "MACD"){
            document.getElementById("macdProgress").className = "progress hidden";
            document.getElementById("macdError").className = "alert alert-danger active";
        }
    }
    var symbol = jsonObj["Meta Data"]["1: Symbol"];
	fullIndicator = jsonObj["Meta Data"]["2: Indicator"];
    dates = jsonObj["Technical Analysis: " + indicator + ""];
    var dateKeys = Object.keys(dates);
    var dateValues = Object.values(dates);
    var singleDateVal = new Array();
    var singleKey;
    
    singleKey = Object.keys(dates[dateKeys[0]]);
    
    for(i=0;i<dateKeys.length;i++) {        
        singleDateVal[i] = Object.values(dates[dateKeys[i]]);
    }

    if(indicator == "SMA" | indicator == "EMA" | indicator == "CCI" | indicator == "ADX" | indicator == "RSI") {

        var tempValOne = new Array();
        var tempY = new Array();

         
        tempValOne[0] = parseFloat(singleDateVal[0][0]);

        for(i=1;i<126;i++) {
        tempValOne[i] = parseFloat(singleDateVal[i][0]);
        temp = dateKeys[i];
        tempY[i] = temp.substring(5, temp.length); 
        }
        
        temp = dateKeys[0];
        tempY[0] = temp.substring(5, 10);

        drawOneChart(tempValOne,tempY,indicator,symbol,fullIndicator);

    }

    if(indicator == "BBANDS" | indicator == "MACD") {

        var tempValOne = new Array();
        var tempValTwo = new Array();
        var tempValThree = new Array();
        var tempY = new Array();

        tempValOne[0] = parseFloat(singleDateVal[0][0]);
        tempValTwo[0] = parseFloat(singleDateVal[0][1]);
        tempValThree[0] = parseFloat(singleDateVal[0][1]);
        
        for(i=0;i<126;i++) {
        tempValOne[i] = parseFloat(singleDateVal[i][0]);
        tempValTwo[i] = parseFloat(singleDateVal[i][1]);
        tempValThree[i] = parseFloat(singleDateVal[i][2]);
        temp = dateKeys[i];
        tempY[i] = temp.substring(5, temp.length);
        }
        
        temp = dateKeys[0];
        tempY[0] = temp.substring(5, 10);
       drawThreeChart(tempValOne,tempValTwo,tempValThree,singleKey,tempY,indicator,symbol,fullIndicator);

    }

    if(indicator == "STOCH") {

        var tempValOne = new Array();
        var tempValTwo = new Array();
        var tempY = new Array();

        temp = dateKeys[0];
        tempY[0] = temp.substring(5, 10);
        
        tempValOne[0] = parseFloat(singleDateVal[0][0]);
        tempValTwo[0] = parseFloat(singleDateVal[0][1]);
        
        for(i=0;i<126;i++) {
        tempValOne[i] = parseFloat(singleDateVal[i][0]);
        tempValTwo[i] = parseFloat(singleDateVal[i][1]);
        temp = dateKeys[i];
        tempY[i] = temp.substring(5, temp.length);
        }

        drawTwoChart(tempValOne,tempValTwo,tempY,singleKey,indicator,symbol,fullIndicator);
	}
} 

function parseSeekingAlphaData(SeekAlphaData){

    try {
    var symbol = SeekAlphaData.rss.channel["0"].item["0"]["sa:stock"]["0"]["sa:symbol"]["0"];
    }
    catch(e){
        document.getElementById("newsProgress").className = "progress hidden";
        document.getElementById("newsError").className = "alert alert-danger active";
    }
    
	var itemArr = new Array();
	var symbol = SeekAlphaData.rss.channel["0"].item["0"]["sa:stock"]["0"]["sa:symbol"]["0"];
	var itemArr = SeekAlphaData.rss.channel["0"].item;
	var check = "https://seekingalpha.com/symbol/" + symbol + "/news?source=feed_symbol_" + symbol;
	var link = "";
	var count = 0;
	for(i=0;i<itemArr.length;i++) {
		link = itemArr["" + i + ""].link["0"];
	
		if (link === check) {
        }
        else {
        	if(count <= 5){
        		title = itemArr["" + i + ""].title["0"];
        		author = itemArr["" + i + ""]["sa:author_name"]["0"];
        		date = itemArr["" + i + ""].pubDate["0"];
        		date = date.slice(0, -6);
        		var html = "";
        		html = "<a class='title' target='_blank' href='" + link + "'><p style='font-size: 17px;''><b>" + title + "<br><br></b></p></a><p><b>Author: " + author + "</b></p><p><b>Date: " + date + " EST </b></p>";
        		$("#well" + count).html(html);
        		count++;
        	}
        }
	}

	document.getElementById("newsProgress").className = "progress hidden";
    document.getElementById("newsWells").className = "active";		
}

// --------------------------  FUNCTIONS TO DRAW THE GRAPHS  --------------------------

function drawHistChart(historicalData,symbol) {

	Highcharts.stockChart('history', {

        title: { 
        	text: symbol + ' Stock Value'
        }, 
        subtitle: {
            useHTML: true,
            text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none" >Alpha Vantage</a>',
            style: {
                color: '#00F'
            }
        },
        rangeSelector: {
            enabled: true
        },
        xAxis: { 
            gapGridLineWidth: 0
        },
        yAxis: [
            {
                title: {
                	text: 'Stock Value'
            	},
                lineWidth: 0,
                min: 0
            }
        ],
        rangeSelector : {
            buttons : [
                {type : 'week',
                 count : 1,
                 text : '1w'
                },
                {
                type : 'month',
                count : 1,
                text : '1m'
                },
                {
                type : 'month',
                count : 3,
                text : '3m'
                },
                {
                type : 'month',
                count : 6,
                text : '6m'
                },
                {
                type : 'ytd',
                text : 'YTD'
                }, 
                {
                type : 'year',
                count : 1,
                text : '1y'
                },
                {
                type : 'all',
                count : 1,
                text : 'All'
                }
                ],
            selected : 1,
        },
        series : [{
        	name : symbol,
        	type: 'area',
            data : historicalData.reverse(), 
            tooltip: {
            	valueDecimals: 2, 
            	valuePrefix:"$"
            }, 
        threshold: null
        }]
    });

    document.getElementById("histProgress").className = "progress hidden";
    document.getElementById("history").className = "active";

}

function drawPriceVolChart(prices,volumes,dates,symbol) { 
    
    priceX = {
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: symbol + ' Stock Price and Volume'   
        },
        subtitle: {
            useHTML: true,
            text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none" >Alpha Vantage</a>',
            style: {
                color: '#00F'
            }
        },
        legend: {
            itemStyle: {
                 fontSize:'9px'
            }
        },
        xAxis: {
            categories: dates.reverse(),
            tickInterval: 5
        },
        yAxis: [{
            title: {
              text: 'Stock Price'
           },
        },{
            title: {
              text: 'Volume'
           },
            opposite: true
        }],
        series:[{
        name: symbol,
        type: 'area',
        data: prices.reverse(),
        lineWidth: 1,
        marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
                hover: {
                    enabled: true
                }
            }
        },
        yAxis: 0,
        color: '#00F',
        fillColor: '#DDDDFF',
        },{name: symbol + ' Volume',
        type: 'column',
        data: volumes.reverse(),
        yAxis: 1,
        color: '#F00'
        }],
    };
    
	Highcharts.chart('price', priceX );
    
    document.getElementById("priceProgress").className = "progress hidden";
    document.getElementById("price").className = "active";

}

function drawOneChart(tempValOne,tempY,indicator,symbol,fullIndicator){
    
    if(indicator == "SMA") {
        
        smaX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
                title: {
                  text: indicator
               }
            },
            series:[{
            name: symbol,
            data: tempValOne.reverse(),
            }],
            plotOptions: {
            series: {
                lineWidth: 1,
                marker: {
                    symbol: 'square',
                    radius: 1,
                    enabled: true
                    }
                }
            },
        };
        
    	Highcharts.chart('sma', smaX );
        
        document.getElementById("smaProgress").className = "progress hidden";
        document.getElementById("sma").className = "active";

    }

    if(indicator == "EMA") {
        
        emaX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
                title: {
                  text: indicator
               }
            },
            series:[{
            name: symbol,
            data: tempValOne.reverse(),
            }],
            plotOptions: {
            series: {
                lineWidth: 1,
                marker: {
                    symbol: 'square',
                    radius: 1,
                    enabled: true
                    }
                }
            },
        };

    	Highcharts.chart('ema', emaX );
        
        document.getElementById("emaProgress").className = "progress hidden";
        document.getElementById("ema").className = "active";
    	
    }

    if(indicator == "RSI") {
        
        rsiX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
                title: {
                  text: indicator
               }
            },
            series:[{
            name: symbol,
            data: tempValOne.reverse(),
            }],
            plotOptions: {
            series: {
                lineWidth: 1,
                marker: {
                    symbol: 'square',
                    radius: 1,
                    enabled: true
                    }
                }
            },
        };

    	Highcharts.chart('rsi', rsiX );
        
        document.getElementById("rsiProgress").className = "progress hidden";
        document.getElementById("rsi").className = "active";
    	
    }

    if(indicator == "ADX") {
        
        adxX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
                title: {
                  text: indicator
               }
            },
            series:[{
            name: symbol,
            data: tempValOne.reverse(),
            }],
            plotOptions: {
            series: {
                lineWidth: 1,
                marker: {
                    symbol: 'square',
                    radius: 1,
                    enabled: true
                    }
                }
            },
        };

    	Highcharts.chart('adx', adxX );
        
        document.getElementById("adxProgress").className = "progress hidden";
        document.getElementById("adx").className = "active";
    	
    }

    if(indicator == "CCI") {
        
        cciX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
                title: {
                  text: indicator
               }
            },
            series:[{
            name: symbol,
            data: tempValOne.reverse(),
            }],
            plotOptions: {
            series: {
                lineWidth: 1,
                marker: {
                    symbol: 'square',
                    radius: 1,
                    enabled: true
                    }
                }
            },
        };

    	Highcharts.chart('cci', cciX );
        
        document.getElementById("cciProgress").className = "progress hidden";
        document.getElementById("cci").className = "active";
    	
    }

}

function drawTwoChart(tempValOne,tempValTwo,tempY,singleKey,indicator,symbol,fullIndicator) {

    stochX = {
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: fullIndicator   
        },
        subtitle: {
            useHTML: true,
            text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
            style: {
                color: '#00F'
            }
        },
        legend: {
            itemStyle: {
                 fontSize:'9px'
            }
        },
        xAxis: {
            categories: tempY.reverse(),
            tickInterval: 5
        },
        yAxis: {
            title: {
              text: indicator
           }
        },
        series:[{
        name: symbol + " " + singleKey[0],
        data: tempValOne.reverse(),
        },{
       	name: symbol + " " + singleKey[1],
        data: tempValTwo.reverse(),	
        }],
        plotOptions: {
        series: {
            lineWidth: 1,
            marker: {
                symbol: 'square',
                radius: 1,
                enabled: true
                }
            }
        },
    };
    
	Highcharts.chart('stoch', stochX );
    
    document.getElementById("stochProgress").className = "progress hidden";
    document.getElementById("stoch").className = "active";

}

function drawThreeChart(tempValOne,tempValTwo,tempValThree,singleKey,tempY,indicator,symbol,fullIndicator) {

	if(indicator == "BBANDS") {
        
        bbandsX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
	            title: {
	              text: indicator
	           }
	        },
            series:[{
            name: symbol + " " + singleKey[0],
            data: tempValOne.reverse(),
	        },{
	       	name: symbol + " " + singleKey[1],
            data: tempValTwo.reverse(),	
	        },{
	       	name: symbol + " " + singleKey[2],
            data: tempValThree.reverse(),	
	        }
	        ],
            plotOptions: {
	        series: {
	            lineWidth: 1,
	            marker: {
	                symbol: 'square',
	                radius: 1,
	                enabled: true
	                }
	            }
	        },
	    };

		Highcharts.chart('bbands', bbandsX );
        
        document.getElementById("bbandsProgress").className = "progress hidden";
        document.getElementById("bbands").className = "active";

	}

    if(indicator == "MACD"){

        macdX = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: fullIndicator   
            },
            subtitle: {
                useHTML: true,
                text: 'Source: <a target="_blank" href="https://www.alphavantage.co/" style="text-decoration: none;" >Alpha Vantage</a>',
                style: {
                    color: '#00F'
                }
            },
            legend: {
                itemStyle: {
                     fontSize:'9px'
                }
            },
            xAxis: {
                categories: tempY.reverse(),
                tickInterval: 5
            },
            yAxis: {
	            title: {
	              text: indicator
	           }
	        },
            series:[{
            name: symbol + " " + singleKey[0],
            data: tempValOne.reverse(),
	        },{
	       	name: symbol + " " + singleKey[1],
            data: tempValTwo.reverse(),	
	        },{
	       	name: symbol + " " + singleKey[2],
            data: tempValThree.reverse(),	
	        }
	        ],
            plotOptions: {
	        series: {
	            lineWidth: 1,
	            marker: {
	                symbol: 'square',
	                radius: 1,
	                enabled: true
	                }
	            }
	        },
	    };
        
    	Highcharts.chart('macd', macdX );	
        
        document.getElementById("macdProgress").className = "progress hidden";
        document.getElementById("macd").className = "active";

    }
}



// ON LOAD CSS HANDLERS 

$(document).ready(function () {
    
    var update = function () {
            $("md-icon").prop('disabled', true);
        };
    $(update);
    $("#sort-by").change(update);
});



// --------------------------  FAVOURITE BUTTON HANDLERS  --------------------------

window.onload = function(){
//        localStorage.clear();
    off = document.getElementsByClassName("toggle btn btn-default off")[0];
    on = document.getElementsByClassName("toggle btn btn-primary")[0];

    var favCompanies = new Array();

    keys = Object.keys(localStorage);
    i = keys.length;
    COUNT = i;

    for(j=0; j<i; j++) {
        favCompanies.push(localStorage.getItem(keys[j]))
    }
    
    for(i=0; i<keys.length; i++){
        
        var elements = favCompanies[i].split(",");
        var symbol = elements[0];
        var price = elements[1];
        var change = elements[2];
        var changePercent = elements[3];
        var volume = elements[4];
        var volume = volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        var temp = {symbol:elements[0],
                    price:elements[1],
                    change:elements[2],
                    changePercent:elements[3],
                    volume:elements[4]};
        jsonArr.push(temp);

        var html = "<tr class='item' id='rowID" + i + "'><td><a id='symID" + i + "' href='javascript:formHandler(\"" + symbol + "\")'>"+ symbol +"</a></td><td>"+ price +"</td>";


        if(change > 0) {
        html +=	"<td><p style='color: green;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' height=15px width=15px></p></td>";
        }
        else if(change < 0) {
        html +=	"<td><p style='color: red;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png' height=15px width=15px></p></td>";
        }
        else if(change == 0) {
        html += "<td><p>" + change + " (" + changePercent + "%)</p></td>";
        }

        html += "</td><td>"+ volume +"</td><td><button onclick='deleteRow(" + i + ",\"" + symbol + "\")' class='btn btn-default'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";

        $("#favourite-table").append(html);
        
    }
}

function favStockHandler(sym) {

    document.getElementById("fav-tab").className = "item";
    document.getElementById("stock-tab").className = "item active";
    
	document.getElementById("star-btn").className = "glyphicon glyphicon-star-empty";
    
    document.getElementById("tableProgress").className = "progress active";
    document.getElementById("stockTable").className = "table table-striped hidden";
    
    document.getElementById("priceProgress").className = "progress active";
    document.getElementById("price").className = "hidden";
    
    document.getElementById("smaProgress").className = "progress active";
    document.getElementById("sma").className = "hidden";
    
    document.getElementById("emaProgress").className = "progress active";
    document.getElementById("ema").className = "hidden";
    
    document.getElementById("stochProgress").className = "progress active";
    document.getElementById("stoch").className = "hidden";
    
    document.getElementById("rsiProgress").className = "progress active";
    document.getElementById("rsi").className = "hidden";
    
    document.getElementById("adxProgress").className = "progress active";
    document.getElementById("adx").className = "hidden";
    
    document.getElementById("cciProgress").className = "progress active";
    document.getElementById("cci").className = "hidden";
    
    document.getElementById("bbandsProgress").className = "progress active";
    document.getElementById("bbands").className = "hidden";
    
    document.getElementById("macdProgress").className = "progress active";
    document.getElementById("macd").className = "hidden";

    document.getElementById("histProgress").className = "progress active";
    document.getElementById("history").className = "hidden";

    document.getElementById("newsProgress").className = "progress active";
    document.getElementById("newsWells").className = "hidden";

	$.ajax({
		url: "/myprice?stocktickersymbol="+sym,
	  	type: "GET",

	  	success: function(data) {
	    	var priceData = data;
	    	console.log(priceData);
	    	priceVolumeData(priceData);		    	
	  	}
	});
}

function deleteRow(count,symbol) {
	console.log(count + " " +symbol);
    $("#rowID" + count + "").remove();
    localStorage.removeItem(symbol);
}

function favStock() {

	if((document.getElementById("star-btn").className == "glyphicon glyphicon-star yellow") || (localStorage.getItem(SYM) != null)) {
        document.getElementById("star-btn").className = "glyphicon glyphicon-star-empty";
        localStorage.removeItem(SYM);
        deleteRow(COUNT,SYM);
        console.log(localStorage);
        COUNT--;
	}
	else {

		// change the ICON
		document.getElementById("star-btn").className = "glyphicon glyphicon-star yellow";

        var tempVOL = VOL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		
		COUNT++;
		var tempSym = SYM;
		var html = "<tr class='item' id='rowID" + COUNT + "'><td><a id='symID" + COUNT + "' href='javascript:favStockHandler(\"" + tempSym + "\")'>" + tempSym + "</a></td><td>"+PRI+"</td>";


		if(CHACHING > 0) {
		html +=	"<td><p style='color: green;'>" + CHACHING + " (" + CHACHINGPER + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' height=15px width=15px></p></td>";
		}
		else if(CHACHING < 0) {
		html +=	"<td><p style='color: red;'>" + CHACHING + " (" + CHACHINGPER + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png' height=15px width=15px></p></td>";
		}
		else if(CHACHING == 0) {
		html += "<td><p>" + CHACHING + " (" + CHACHINGPER + "%)</p></td>";
		}

		html += "</td><td>"+tempVOL+"</td><td><button onclick='deleteRow(" + COUNT + ",\"" + tempSym  + "\")' class='btn btn-default'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";

		$("#favourite-table").append(html);

        PRI = parseFloat(PRI).toFixed(2);
        console.log(PRI);

		//making a JSON object called favouriteArr which stores the LOCALSTORAGE ITEMS
        var temp = {symbol:SYM, price: PRI, change: CHACHING, changePercent: CHACHINGPER, volume: VOL};
    
        jsonArr.push(temp);

		var favItem = SYM + "," + PRI + "," + CHACHING + "," + CHACHINGPER + "," + VOL;

        if(localStorage.getItem(SYM) == null) {
            localStorage.setItem(SYM,favItem);
        }
        else {
            alert("This company is already in the favourite list");
        }
        
	}
}



// --------------------------  FACEBOOK HANDLING  --------------------------

window.fbAsyncInit = function() {
FB.init({
  appId      : '468331690228406',
  xfbml      : true,
  version    : 'v2.10'
});
FB.AppEvents.logPageView();
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "https://connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function facebookFeed(){
    
    //make user login if not logged in
    FB.getLoginStatus(function(response) {
        if(response.status != "connected"){
            FB.login();
        }
        
        chartExport();
    });
    
function chartExport() {
    
    var obj = {};
    var t = $(".nav-tabs .active")[0];
    console.log(t.children[0].innerText);
    if (t.children[0].innerText == "Price") {
        obj.options = JSON.stringify(priceX);
    }
    else if (t.children[0].innerText == "SMA") {
        obj.options = JSON.stringify(smaX);
    }
    else if (t.children[0].innerText == "EMA") {
        obj.options = JSON.stringify(emaX);     
    }
    else if (t.children[0].innerText == "STOCH") {
        obj.options = JSON.stringify(stochX);     
    }
    else if (t.children[0].innerText == "RSI") {
        obj.options = JSON.stringify(rsiX);    
    }
    else if (t.children[0].innerText == "ADX") {
        obj.options = JSON.stringify(adxX);     
    }
    else if (t.children[0].innerText == "CCI") {
        obj.options = JSON.stringify(cciX);     
    }
    else if (t.children[0].innerText == "BBANDS") {
        obj.options = JSON.stringify(bbandsX);
    }
    else if (t.children[0].innerText == "MACD") {
        obj.options = JSON.stringify(macdX);
    }
    
    console.log(obj);
    
    obj.type = 'image/png';
    obj.async = true;
    
    $.ajax({
    type: 'post',
    url: urlExp,
    data: obj,
    success: function (data) {
        console.log(data);
         FB.ui({
                app_id: '468331690228406',
                method: 'feed',
                picture: urlExp + data
            },  function(response){
                    if (response && !response.error_message) {
                        alert("Success");
                    } else {
                        alert("You have decided not to post");
                    }
                }
        );
        }
    });
    
}
}



// --------------------------  SORTING THE FAVOURITE TABLES  --------------------------

$(document).ready(function(){
    $('#sort-order').change(function(){
        
        if($( "#sort-order" ).val() == "Ascending"){
            
            if($( "#sort-by" ).val() == "Symbol") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    if( a.symbol > b.symbol){
                        return 1;
                    } else if( a.symbol < b.symbol ){
                        return -1;
                    }
                    return 0;
                });
                updateTableAsc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Price") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableAsc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Change") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.change) - parseFloat(b.change);
                });
                updateTableAsc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Change Percent") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.changePercent) - parseFloat(b.changePercent);
                });
                updateTableAsc(jsonArr);
            }   
            else if($( "#sort-by" ).val() == "Volume") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.volume) - parseFloat(b.volume);
                });
                updateTableAsc(jsonArr);
            }
            
        }
        
        else if($( "#sort-order" ).val() == "Descending"){
           
            if($( "#sort-by" ).val() == "Symbol") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    if( a.symbol > b.symbol){
                        return 1;
                    } else if( a.symbol < b.symbol ){
                        return -1;
                    }
                    return 0;
                });
                updateTableDesc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Price") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableDesc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Change") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.change) - parseFloat(b.change);
                });
                updateTableDesc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Change Percent") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.changePercent) - parseFloat(b.changePercent);
                });
                updateTableDesc(jsonArr);
            }   
            else if($( "#sort-by" ).val() == "Volume") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.volume) - parseFloat(b.volume);
                });
                updateTableDesc(jsonArr);
            }
            
        }
        
    });
});

$(document).ready(function(){
    $('#sort-by').change(function(){
        
        if($( "#sort-by" ).val() == "Default") {
            var update = function () {
                    $("#sort-order").prop('disabled', true);
                };
            $(update);
            $("#sort-by").change(update);
            jsonArr.sort(function(a, b) {
                    if( a.symbol > b.symbol){
                        return 1;
                    } else if( a.symbol < b.symbol ){
                        return -1;
                    }
                    return 0;
                });
            updateTableAsc(jsonArr);
        }
        
        if($( "#sort-order" ).val() == "Ascending"){
            
            if($( "#sort-by" ).val() == "Symbol") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    if( a.symbol > b.symbol){
                        return 1;
                    } else if( a.symbol < b.symbol ){
                        return -1;
                    }
                    return 0;
                });
                updateTableAsc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Price") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableAsc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Change") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.change) - parseFloat(b.change);
                });
                updateTableAsc(jsonArr);
            }
            else if($( "#sort-by" ).val() == "Change Percent") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.changePercent) - parseFloat(b.changePercent);
                });
                updateTableAsc(jsonArr);
            }   
            else if($( "#sort-by" ).val() == "Volume") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.volume) - parseFloat(b.volume);
                });
                updateTableAsc(jsonArr);
            }
            
        }
        
        else if($( "#sort-order" ).val() == "Descending"){
           
            if($( "#sort-by" ).val() == "Symbol") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    if( a.symbol > b.symbol){
                        return 1;
                    } else if( a.symbol < b.symbol ){
                        return -1;
                    }
                    return 0;
                });
                updateTableDesc(jsonArr);
            }
            if($( "#sort-by" ).val() == "Price") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableDesc(jsonArr);
            }
            if($( "#sort-by" ).val() == "Change") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableDesc(jsonArr);
            }
            if($( "#sort-by" ).val() == "Change Percent") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableDesc(jsonArr);
            }   
            if($( "#sort-by" ).val() == "Volume") {
                var update = function () {
                        $("#sort-order").prop('disabled', false);
                    };
                $(update);
                $("#sort-by").change(update);
                jsonArr.sort(function(a, b) {
                    return parseFloat(a.price) - parseFloat(b.price);
                });
                updateTableDesc(jsonArr);
            }
            
        }
        
    });
});

function updateTableAsc(jsonArr) {
    
    $("#tbody").html("");
    
    var header = "<tr class='active'><td><b>Symbol</b></td><td><b>Stock Price</b></td><td><b>Change (Change Percent)</b></td><td><b>Volume</b></td><td></td></tr>";
    
    $("#tbody").html(header);
    
    for(i=0; i<jsonArr.length; i++){
        
        
        var symbol = jsonArr[i].symbol;
        var price = jsonArr[i].price;
        var change = jsonArr[i].change;
        var changePercent = jsonArr[i].changePercent;
        var volume = jsonArr[i].volume;
        var volume = volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        console.log(price);
        console.log(change);
        
        
        var html = "<tr class='item' id='rowID" + i + "'><td><a id='symID" + i + "' href='javascript:formHandler(\"" + symbol + "\")'>"+ symbol +"</a></td><td>"+ price +"</td>";


        if(change > 0) {
        html +=	"<td><p style='color: green;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' height=15px width=15px></p></td>";
        }
        else if(change < 0) {
        html +=	"<td><p style='color: red;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png' height=15px width=15px></p></td>";
        }
        else if(change == 0) {
        html += "<td><p>" + change + " (" + changePercent + "%)</p></td>";
        }

        html += "</td><td>"+ volume +"</td><td><button onclick='deleteRow(" + i + ",\"" + symbol + "\")' class='btn btn-default'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";

        $("#favourite-table").append(html);
    }
}

function updateTableDesc(jsonArr) {
    
    $("#tbody").html("");
    
    var header = "<tr class='active'><td><b>Symbol</b></td><td><b>Stock Price</b></td><td><b>Change (Change Percent)</b></td><td><b>Volume</b></td><td></td></tr>";
    
    $("#tbody").html(header);
    
    for(i=jsonArr.length-1; i>=0; i--){
        var elements;
        var symbol = jsonArr[i].symbol;
        var price = jsonArr[i].price;
        var change = jsonArr[i].change;
        var changePercent = jsonArr[i].changePercent;
        var volume = jsonArr[i].volume;
        var volume = volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        
        var html = "<tr class='item' id='rowID" + i + "'><td><a id='symID" + i + "' href='javascript:formHandler(\"" + symbol + "\")'>"+ symbol +"</a></td><td>"+ price +"</td>";


        if(change > 0) {
        html +=	"<td><p style='color: green;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' height=15px width=15px></p></td>";
        }
        else if(change < 0) {
        html +=	"<td><p style='color: red;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png' height=15px width=15px></p></td>";
        }
        else if(change == 0) {
        html += "<td><p>" + change + " (" + changePercent + "%)</p></td>";
        }

        html += "</td><td>"+ volume +"</td><td><button onclick='deleteRow(" + i + ",\"" + symbol + "\")' class='btn btn-default'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";

        $("#favourite-table").append(html);
    }
}



// --------------------------  REFRESH THE FAVOURITES ON CLICK AND AUTOMATIC  --------------------------

function refreshFavourites() {
    
    keys = Object.keys(localStorage);
    console.log(keys);
    
    favList = [];
    var count = 0;
    
    for(i=0; i<keys.length; i++) {
        
        var symbol = keys[i];
        
        $.ajax({
            url: "/compact?stocktickersymbol=" + symbol,
            type: "GET",
            async: false,

            success: function(data) {
                var priceData = data;
                refreshData(priceData);	
                count++;
            }
        });
       
    }   
    
    if(count == keys.length){
    console.log(favList);
    fillTable();
    localStorage = favList;
    jsonArr = favList;
    }
}

function refreshData(jsonObj) {
    
    console.log(jsonObj);
    
    var localUnixTime = new Date().getTime();
    var nyDateTime = moment(localUnixTime).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
    var nyHour = moment(localUnixTime).tz('America/New_York').format('HH');
	var nyHourInt = parseInt(nyHour);
    
    var symbol, price, change, changePercent, volume;
    
    try {
        symbol = jsonObj["Meta Data"]["2. Symbol"];
    }
    catch(e) {
        alert("Could not get data, please refresh again later.");
    }
    
    var symbol = "";
	var symbol = jsonObj["Meta Data"]["2. Symbol"];

	var datesPV = new Array();
	var pricePV = new Array();
	var volumePV = new Array();
		var price = new Array();
	var volume = new Array();
	var openArr = new Array();
	var highArr = new Array();
	var lowArr = new Array();
	var closeArr = new Array();
	var volumeArr = new Array();

	var TSObj;
	TSObj = jsonObj["Time Series (Daily)"];
	var TSKeys = Object.keys(TSObj);
	var TSValues = Object.values(TSObj);
	for (var i = 0; i < TSKeys.length; i++) {
		openArr[i] = parseFloat(TSObj[TSKeys[i]]["1. open"]);
		highArr[i] = parseFloat(TSObj[TSKeys[i]]["2. high"]);
		lowArr[i] = parseFloat(TSObj[TSKeys[i]]["3. low"]);
		closeArr[i] = parseFloat(TSObj[TSKeys[i]]["4. close"]);
		volumeArr[i] = parseInt(TSObj[TSKeys[i]]["5. volume"]);
	}

    var lastPrice;
    
    //in working hours
    if(nyHourInt > 8 && nyHourInt < 17 && nyDateTime.length!=10) {
        lastPrice = openArr[0].toFixed(2);
    }
    else {
        lastPrice = closeArr[0].toFixed(2);
    }
    
    var change = (closeArr[0] - closeArr[1]).toFixed(2);
    var changePercent = (((closeArr[0] - closeArr[1])/closeArr[1])*100).toFixed(2);
    var volume = volumeArr[0];
    var volume = volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    console.log(symbol + " " + lastPrice + " " + change + " " + changePercent +  " " + volume );
    
    var temp = {symbol:symbol, lastPrice: lastPrice, change: change, changePercent: changePercent, volume: volume};
    
    favList.push(temp);
    //making a JSON object called favouriteArr which stores the LOCALSTORAGE ITEMS
    var fav = symbol + "," + lastPrice + "," + change + "," + changePercent + "," + volume;

    localStorage.setItem(symbol,fav);        
}

function fillTable() {
    
    $("#tbody").html("");
    
    var header = "<tr class='active'><td><b>Symbol</b></td><td><b>Stock Price</b></td><td><b>Change (Change Percent)</b></td><td><b>Volume</b></td><td></td></tr>";
    
    $("#tbody").html(header);
    
    for(i=0; i<favList.length; i++){
        
        var elements;
        var symbol = favList[i].symbol;
        var price = parseFloat(favList[i].lastPrice);
        var change = favList[i].change;
        var changePercent = favList[i].changePercent;
        var volume = favList[i].volume;
        var volume = volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        var html = "<tr class='item' id='rowID" + i + "'><td><a id='symID" + i + "' href='javascript:formHandler(\"" + symbol + "\")'>"+ symbol +"</a></td><td>"+ price +"</td>";


        if(change > 0) {
        html +=	"<td><p style='color: green;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' height=15px width=15px></p></td>";
        }
        else if(change < 0) {
        html +=	"<td><p style='color: red;'>" + change + " (" + changePercent + "%)" + "<img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png' height=15px width=15px></p></td>";
        }
        else if(change == 0) {
        html += "<td><p>" + change + " (" + changePercent + "%)</p></td>";
        }

        html += "</td><td>"+ volume +"</td><td><button onclick='deleteRow(" + i + ",\"" + symbol + "\")' class='btn btn-default'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";

        $("#favourite-table").append(html);
    }
    
}

function checkForChanges() {   
    off = document.getElementsByClassName("toggle btn btn-default off")[0];
    on = document.getElementsByClassName("toggle btn btn-primary")[0];
    if (on) {
        refreshFavourites();
        setTimeout(checkForChanges, 5000);
    }
    else if(off) {
        setTimeout(checkForChanges, 5000);
    }
}

$(document).ready(function() {
    $(checkForChanges);
});



// --------------------------  FORM VALIDATION  --------------------------

$(document).ready( function(){
    $("input").on("input", function() {
        if ( $.trim( $("input").val() ) == "" ) {
            
            $('.alert').removeClass('hidden');
            
            var update = function () {
                    $("#get-quote").prop('disabled', true);
                };
            $(update);
            $("#get-quote").change(update);
            
            $("md-autocomplete-wrap").css({
                "border-radius": "5px 5px", 
                "border" : "1px solid #F00"  
            });
        }
        else {
            $('.alert').addClass('hidden');
            
            var update = function () {
                    $("#get-quote").prop('disabled', false);
                };
            $(update);
            $("#get-quote").change(update);
            
            $("md-autocomplete-wrap").css({
                "border-radius": "5px 5px", 
                "border" : "1px solid #00F"  
            });
        }   
    });
});
