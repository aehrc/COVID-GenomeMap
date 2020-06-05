//$(function() {
//  $('#identicalTable').CSVToTable('../covid19data/duplicateIds.txt',{separator:"\t",headers: ['Name of the new combined sequences','Number of sequences merged','Names of the different strains merged','Names of Originating Laboratory']});
//});

var covidGenome = angular.module('covidGenome', ['ngRoute'])
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider.when('/home/', {
          templateUrl: 'table.html',
          controller: 'genome',
      });
      $routeProvider.otherwise({
      templateUrl: 'table.html',
          controller: 'genome'
      });
}]);

covidGenome.factory('Items', ['$http', function($http){
  var Url   = "../../covid19data/duplicateIds.txt";
  //var Url   = "../backup/duplicateIds.txt";
  var csvParser = function(allText) {
        // split content based on new line
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split('\t');
        var lines = [];

        for ( var i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            var data = allTextLines[i].split('\t');
            if (data.length == headers.length) {
                var tarr = [];
                for ( var j = 0; j < headers.length; j++) {
                    tarr.push(data[j].replace(/,/g, ", "));
                }
                lines.push(tarr);
            }
        }
        return lines;
    };
  var Items = $http.get(Url).then(function(response){
     return csvParser(response.data);
  });
  return Items;
}]);

covidGenome.controller('genome',function( $scope, $http, Items) {
  $scope.items;
  $scope.index = 0;
  Items.then(function(data){
  $scope.items = data;
  console.log($scope.items);
});



});
