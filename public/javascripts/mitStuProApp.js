/**
 * Haupt-Funktionsdatei mit Routing und Services etc., die bereichsübergreifend genutzt werden
 * Bindet weitere Module für verschiedene Bereiche ein (table, settings)
 */

var app = angular.module('mitStuPro', ['ui.router', 'ui.bootstrap', 'colorpicker.module', 'ngAnimate', 'angular-spinkit', 'autofocus', 'tableModule', 'settingsModule']);

/**
 * Definiert Routen zum Befüllen von ui-view des ui.routers in views/index.ejs
 */
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

	$stateProvider
    .state('home', {
      url: '/home',
      views: {
    	  'main': {
    		  templateUrl: 'templates/home.html' // Zu Testzwecken
    	  }
      }
    });
	
	$stateProvider
    .state('table', {
      url: '/table',
      views: {
    	  'main': {
    		   templateUrl: 'templates/table/table.html',
    		   controller: 'TableCtrl'
    	  }
      }
     
    });

	/*$stateProvider
    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings/settings.html',
      controller: 'SettingsCtrl'
    });*/
	
	$urlRouterProvider.otherwise('table');
}]);


/**
 * Wird beim Start ausgeführt. Überprüft, ob der Nutzer der Seite eingeloggt ist.
 */
app.run(['$state', '$rootScope', '$location', 'activUser', function($state, $rootScope, $location, activUser) {
    $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    	var goesToLogin = toState.name === "table" || toState.name === "home";
        if(goesToLogin){
           return; //Nutzer geht schon zum Login oder einer freien Seite.
        }
        
        if (activUser.isLogin === false) {
            console.log('Nicht eingeloggt.');
            $state.go('table');
            e.preventDefault(); 
        }
    });
}]);


app.factory("benutzerFactory",[ '$http', function ($http) {
	
	// Zugriff auf die Routes
	
var o = {
	user: {}
};
o.getAllUser = function(callback){
	console.log("getAllUser");
	$http.get('/benutzer/alle')
	.success(function(data){
		console.log("success getAllUser = " + data.name);
		o.user = data;
		callback(o.user);
	})
	.error(function(error){
		console.log("error getAllUser");
		o.user = null;
		callback(null);
	});
};
	
o.getUserByName = function(name, callback){
	console.log("getUserByName + name = " + name.name);
	$http.post('/benutzer/byName', name)
	.success(function(data){
		console.log("success getUserByName =" +data.name);
		o.user = data;
		callback(o.user);
	})
	.error(function(error){
		console.log("error getUserByName");
		o.user = null;
		callback(null);
	});
};

o.getUserById = function(userId){
	return $http.get('/benutzer/byID' + userId).success(function(data){
		return data;
	});
};

o.updateUserByName = function(name, settings, callback){
	console.log("updateUserByName + name = " + name.name);
	console.log("updateUserByName + settings = " + settings);
	$http.put('/Benutzer/updateSettings/byName', name , settings)
	.success(function(data){
		console.log("success updateUserByName =" +data.name);
		o.user = data;
		callback(o.user);
	})
	.error(function(error){
		console.log("error updateUserByName");
		o.user = null;
		callback(null);
	});
};


o.create = function(user, callback){
	console.log("create + Benutzer = " + user.name);
	$http.post('/benutzer/save', user)
	.success(function(data){
		console.log("success create =" +data.name);
	  	o.user = data;
	  	callback(data);
  })
	.error(function(error){
		console.log("error create");

	});
};

o.deleteUserByName = function(name, callback){
	console.log("deleteUserByName + name = " + name.name);
	$http.post('/benutzer/byName', name)
	.success(function(data){
		console.log("success deleteUserByName =" +data.name);
		o.user = data;
		callback(o.user);
	})
	.error(function(error){
		console.log("error deleteUserByName");
		o.user = null;
		callback(null);
	});
};

return o;
    
}]);


/**
 * Speichert den aktiven Benutzer
 */
app.service("activUser", function() {
  var _user = new Object();
  var _isLogin = false;
  
  this.user = _user;
  this.isLogin = _isLogin;
});


/**
 * Direktive zum Abfangen und Ausführen der Enter-Taste
 */
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


/**
 * Filter 
 * TODO
 */
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


/**
 * Filter
 * TODO
 */
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

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

/**
 * Direktive für die Ligatabelle
 * TODO
 */
app.directive('ligatabelle', function () {
    // return the directive definition object 
    return {
    	restrict: 'E',
        scope: {
        	mannschaften: '=',
            favoritverein: '=',
            tabledesign: '='
        },
        controller: function ($scope) {
       
        	$scope.isHighlight = function (mannschaft) {
            	if(String($scope.favoritverein).length > 3 && String(mannschaft.mannschaft).toLowerCase().match($scope.favoritverein.toLowerCase())){
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


/**
 * Direktive für die Spielplantabelle
 * TODO
 */
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
        		$scope.hallenaddress = "";
        		hallenlink = "https://bremerhv-handball.liga.nu" + hallenlink;
        		
        		var adresse = hallenlink.replace(/\//g,'%2F').replace(/\?/g,'%3F').replace(/\=/g,'%3D').replace(/\+/g,'%2B').replace(/\&/g,'%26').replace(/\+/g,'%2B').replace(/\:/g, '%3A');

        	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Fbody%2F%2Fdiv%2F%2Fdiv%2F%2Fdiv%2F%2Fdiv%2F%2Fp%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        	     
        	    $scope.toggleModal();
        	    
        	    $http.get(jsonFeed).success(function (data) {
        	    	$scope.hallenaddress = data.query.results.p.content;
        	    });   
       
        	};
        	
        },
        replace: true,
        templateUrl: 	"templates/table/spielplantabelle.html"
		
    };
}]);


/**
 * Direktive
 * TODO
 */
app.directive("modalDialog", [function() {
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


/**
 * Direktive
 * TODO
 */
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
            
            var isEmpty = function (obj) {
        	    for(var key in obj) {
        	        if(obj.hasOwnProperty(key))
        	            return false;
        	    }
        	    return true;
        	};
            
            var initialize = function () {
                geocoder = new google.maps.Geocoder();
                latlng = new google.maps.LatLng(-34.397, 150.644);
            };
            
            var markAdressToMap = function () {
                geocoder.geocode({ 'address': $scope.address }, 
                function (results, status) 
                  {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            animation:google.maps.Animation.BOUNCE
                        });
                        
                        infowindow = new google.maps.InfoWindow({
                      	  content: $scope.address
                      	  });

                      	infowindow.open(map,marker);
                    }
                });
            };
            
            $scope.$watch("address", function () {
            	
            	var mapOptions = {
                        zoom: $scope.zoom,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                map = new google.maps.Map(document.getElementById('addressMap'), mapOptions);
            	
            	window.setTimeout(function(){ 
            		google.maps.event.trigger(map, 'resize');
            		
            		if ($scope.address != undefined) {
                    	if(!isEmpty(marker)){
                    		marker.setMap(null);
                    	}
                        markAdressToMap();
                    }
            	},10);

            });
            
            initialize();
        },
    };
});