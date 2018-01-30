// --------------------------  ANGULAR JAVASCRIPT  --------------------------

var app = angular.module('firstApplication', ['ngMaterial']);

app.controller('autoCompleteController', autoCompleteController);

  function autoCompleteController ($timeout, $q, $log) {
    var self = this;
    self.isDisabled    = false;
    
    //list of companies to be displayed
    
    self.selectedItem  = null;
    self.searchTextChange   = null;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    
 
    function querySearch (query) {
       var companiesStr = "";
       var allCompanies = "";
       var acData = "";
    //$log.info('Text changed to ' + query);

       $.ajax({
          url: "/autocomplete?stocktickersymbol=" + query,
          dataType: "json",
          async: false,
          success : function(data) {
             acData = data;
          }
       });

       for(i=0 ;i<acData.length;i++) {
          var symbol = acData[i].Symbol;
          var name = acData[i].Name;
          var exchange = acData[i].Exchange;
          companiesStr += symbol + " - " + name + " (" + exchange+ ")";
          if(i != (acData.length-1)){
             companiesStr += ", ";
          }
       }

       allCompanies = companiesStr;

       allCompanies = allCompanies.split(/, +/g).map( function (companies) {
       return {
          value: companies.toLowerCase(),
          display: companies
          };
       });

       allCompanies = query ? allCompanies.filter( createFilterFor(query) ) : allCompanies;
          
       return allCompanies;
    }

    function selectedItemChange(item) {
    //$log.info('Item changed to ' + JSON.stringify(item));
    }
    
    //filter function for search query
    function createFilterFor(query) {
       var lowercaseQuery = angular.lowercase(query);
       return function filterFn(company) {
          return (company.value.indexOf(lowercaseQuery) === 0);
       };
    }

 }  