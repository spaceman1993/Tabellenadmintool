/*
 * Haupt-Funktionsdatei
 */

var app = angular.module('mitStuPro', ['ui.router', 'ui.bootstrap', 'colorpicker.module', 'ngAnimate', 'angular-spinkit', 'tableModule', 'settingsModule']);

// Definiert Routen
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

	$stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html' // Zu Testzwecken
    });
	
	$stateProvider
    .state('table', {
      url: '/table',
      templateUrl: 'templates/table/table.html',
    	  controller: 'TableCtrl'
    });

	$stateProvider
    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings/settings.html',
      controller: 'SettingsCtrl'
    });
	
	$urlRouterProvider.otherwise('table');
}]);

app.service('dataService', function() {
	  // private variable
  var _leagues = new Array();
  var _activeLeagues = new Array();
  var _jugenden = new Array();
  var _tableDesign = new Object();
  
  this.leagues = _leagues;
  this.activeLeagues = _activeLeagues;
  this.jugenden = _jugenden;
  this.tableDesign = _tableDesign;
});

app.factory("userFactory", function () {
    var benutzerListe = [];
    
    var findByName = function (name) {
  	  for (var i = 0; i < benutzerListe.length; i++) {
  	    if (benutzerListe[i].name === name) {
  	      return benutzerListe[i];
  	    }
  	  }
  	  	return null;
    };
    
    return {
      getBenutzer: function (name) {
        return findByName(name);
      },
      addBenutzer: function (name, passwort, first, second, standardDesign, favoritVerein, spielplan, verwaltung, favoritLeague) {
        benutzerListe.push({name:name, passwort:passwort, first:first, second:second, standardDesign:standardDesign, favoritVerein:favoritVerein, spielplan:spielplan, verwaltung:verwaltung, favoritLeague:favoritLeague});
      }
    };
    
});
	
app.service("activUser", function() {
  var _user = new Object();
  
  this.user = _user;
});




app.service('ASCIIConverterService', function(){
    
    this.convert = function(text) {
    	var text = text.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
    	return text; 
    };

});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

app.filter('listGroupBy', function() {
	return function(list, attribute) {
		var groups = [];

        var groupValue = "_INVALID_GROUP_VALUE_";

        for ( var i = 0 ; i < list.length ; i++ ) {
            var data = list[ i ];

            if ( data[ attribute ] !== groupValue ) {
                var group = {
                    label: data[ attribute ],
                    list: []
                };
                groupValue = group.label;

                groups.push( group );
            }
            group.list.push( data );
        }
        
        return groups;
	};
});


app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) {filtered.reverse();}
    return filtered;
  };
});


app.directive('ligatabelle', function () {
    // return the directive definition object 
    return {
    	restrict: 'E',
        scope: {
        	mannschaften: '=',
            benutzer: '=',
            tabledesign: '='
        },
        controller: function ($scope) {
       
        	$scope.isHighlight = function (mannschaft) {
            	if(String($scope.benutzer.favoritVerein).length > 3 && String(mannschaft.mannschaft).match($scope.benutzer.favoritVerein)){
            		return true;
            	}
            	else{
            		return false;
            	}
            };
            
            $scope.isNumber = function (value) {
                return !isNaN(value);
            };
        	
        },
        replace: true,
        templateUrl: "templates/table/ligatabelle.html"
		
    };
});


app.directive("spielplantabelle", [function () {
    // return the directive definition object 
    return {
    	restrict: 'E',
        scope: {
        	nextgames: '=',
        	tabledesign: '='
        },
        controller: function ($scope, $http) {
            
        	$scope.modalShown = false;
        	
      	  	$scope.toggleModal = function() {
      	  		$scope.modalShown = !$scope.modalShown;
      	  	};
        	
        	$scope.getHallenadresseForHalle = function (hallenlink){
        		
        		hallenlink = "https://bremerhv-handball.liga.nu" + hallenlink;
        		
        		var adresse = hallenlink.replace(/\//g,'%2F').replace(/\?/g,'%3F').replace(/\=/g,'%3D').replace(/\+/g,'%2B').replace(/\&/g,'%26').replace(/\+/g,'%2B').replace(/\:/g, '%3A');

        	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Fbody%2F%2Fdiv%2F%2Fdiv%2F%2Fdiv%2F%2Fdiv%2F%2Fp%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        	     
        	    
        	    $http.get(jsonFeed).success(function (data) {
        	      
        	      var hallenaddress = data.query.results.p.content;

        	      $scope.hallenaddress = hallenaddress;
        	    });   
       
        	};
        	
        },
        replace: true,
        templateUrl: 	"templates/table/spielplantabelle.html"
		
    };
}]);


app.directive('modalDialog', [function() {
	  return {
	    restrict: 'E',
	    scope: {
	    	control: '=',
	    	show: '='
	    },
	    replace: true, // Replace with the template below
	    transclude: true, // we want to insert custom content inside the directive
	    link: function(scope, element, attrs) {
	    	scope.internalControl = scope.control || {};
	    	scope.dialogStyle = {};
	      
	    	if (attrs.width){
	    		scope.dialogStyle.width = attrs.width;
	    	}
	      
	    	if (attrs.height){
	    		scope.dialogStyle.height = attrs.height;
	    	}
	      
	    	scope.internalControl.hideModal = function() {
	    		scope.show = false;
	    	};
	    },
	    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='internalControl.hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='internalControl.hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
	  };
}]);

app.directive('addressBasedGoogleMap', function () {
    return {
        restrict: "A",
        template: "<div id='addressMap'></div>",
        scope: {
            address: "=",
            zoom: "="
        },
        controller: function ($scope) {
            var geocoder;
            var latlng;
            var map;
            var marker;
            var initialize = function () {
                geocoder = new google.maps.Geocoder();
                latlng = new google.maps.LatLng(-34.397, 150.644);
                var mapOptions = {
                    zoom: $scope.zoom,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map
                (document.getElementById('addressMap'), mapOptions);
            };
            markAdressToMap = function () {
                geocoder.geocode({ 'address': $scope.address }, 
                function (results, status) 
                  {
                    if (status === google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    }
                });
            };
            $scope.$watch("address", function () {
                if ($scope.address !== undefined) {
                    markAdressToMap();
                }
            });
            initialize();
        },
    };
});