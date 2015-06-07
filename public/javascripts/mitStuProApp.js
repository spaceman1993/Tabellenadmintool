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
   
	var applicationDesign = {};
	applicationDesign.backgroundColor = "red";
	applicationDesign.abstandRand = "50px";
	
	$rootScope.user = activUser.user;
	
//	window.setTimeout(function(){ 
//		$rootScope.applicationDesign = activUser.user.settings.design.applicationDesign;
//
//	},10000);
	
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
	   console.log("success getAllUser = " + data);
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
	   console.log("success getUserByName =" +data);
	   o.user = data;
	   callback(o.user);
	  })
	  .error(function(error){
	   console.log("error getUserByName");
	   o.user = null;
	   callback(null);
	  });
	 };
	 
	 o.login = function(name, callback){
	   console.log("login + name = " + name.name);
	   console.log("login + pass = " + name.passwort);
	   $http.post('/benutzer/login', name)
	   .success(function(data){
	    console.log("success login =" +data);
	    o.user = data;
	    callback(o.user);
	   })
	   .error(function(error){
	    console.log("error login");
	    o.user = null;
	    callback(null);
	   });
	  };

	 o.getUserById = function(userId){
	  return $http.get('/benutzer/byID' + userId).success(function(data){
	   return data;
	  });
	 };

	 o.updateUserByName = function(name, callback){
	  console.log("updateUserByName + name = " + name.name);
	  $http.put('/Benutzer/updateSettings/byName', name)
	  .success(function(data){
	   console.log("success updateUserByName =" +data);
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
	   console.log("success create =" +data);
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
	   console.log("success deleteUserByName =" +data);
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
 * Mit Hilfe dieses Service wird der aktiv angemeldete Benutzer an die
 * verschiedenen Controllern der Applikation weitergeleitet
 */
app.service("activUser", function() {
  var _user = {};
  var _isLogin = false;
  var _test = "test";
  
  this.test = _test;
  
  this.user = _user;
  this.isLogin = _isLogin;
});


/**
 * Mit dieser Direktive kann man eine selbstdefinierte Funktion ausführen, indem
 * die ENTER-Taste bestätigt wird
 * @params: scope 		-> Der aktive Scope
 * 			element 	-> Element, bei dessen Fokussierung die ENTER-Taste abgefangen wird
 * 			attrs		-> Attribute
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
 * Dieser Filter gruppiert eine Arrayliste anhand einer seiner Attribute
 * 
 * @params: list 		-> Die zu gruppierende Arrayliste
 * 			attribute 	-> Das Attribut, an dem die Arrayliste gruppiert werden soll
 * 
 * @return: Eine nach dem Attribute gruppierte Arrayliste
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
 * Dieser Filter sortiert eine ArrayListe nach einem seiner bestimmten Felder
 * und kann diese logisch in der Reihenfolge oder umgekehrt ausgeben.
 * 
 * @params:	items 	-> Die zu sortierende Arrayliste
 * 			field 	-> Das Feld nach das im Array sortiert werden soll
 * 			reverse -> Sortierrichtung (true/false)
 * 
 * @return:	Eine nach dem Feld sortierte ArrayListe
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

/**
 * Dieser Filter erlaubt der Applikation von JavaScript kommende Textpassagen
 * mit HTML-TAGS auf HTML-Templates darstellen zu können 
 */
app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

/**
 * Diese Directive repräsentiert die Ausgabe einer Ligatabelle einer bestimmten Liga.
 * Dabei kann mit der Parameterübergabe das Design der Tabelle bestimmt werden und sein
 * favorisierter Verein hervorgehoben werden.
 * 
 * @params:	mannschaften 	-> Die Mannschaftsliste mit den notwendigen Informationen
 * 			favoritverein 	-> Favorisierter Verein der hervorgehoben dargestellt wird
 * 			tabledesign 	-> Das zu verwendete Design für die Tabelle
 * 			
 * @return:	Die Ligatabelle als Directive
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
       
        	/**
        	 * Überprüft anhand der aktuell vorliegenden mannschaft und des favorisierten Vereins, ob diese übereinstimmen
        	 * und bestimmt dadurch, ob die Zeile hervorgehoben dargestellt wird oder standardmäßig vorliegen soll.
        	 * Dabei muss der favorisierte Verein mit mindestens 3 Zeichen dargestellt worden sein. 
        	 * 
        	 * @params:	mannschaft 	-> Aktuelle Mannschaft die überprüft werden soll
        	 * 
        	 * @return: true 		-> Wenn Mannschaft übereinstimmt mit Favorit
        	 * 			false 		-> Wenn Mannschaft nicht übereinstimmt
        	 */
        	$scope.isHighlight = function (mannschaft) {
            	if(String($scope.favoritverein).length > 3 && String(mannschaft.mannschaft).toLowerCase().match($scope.favoritverein.toLowerCase())){
            		return true;
            	}
            	else{
            		return false;
            	}
            };
            
            /**
             * Überprüft, ob der übergebende Parameter eine Zahl ist und liefert die passende Antwort zurück
             * 
             * @params: value	-> Der String der überprüft werden soll
             * 
             * @return: true	-> Wenn Parameter eine Zahl ist
             * 			false	-> Wenn keine Zahl ist
             */
            $scope.isNumber = function (value) {
                return !isNaN(value);
            };
        	
        },
        replace: true,
        templateUrl: "templates/table/ligatabelle.html"
		
    };
});


/**
 * Diese Directive repräsentiert die Ausgabe der Spielplantabelle einer bestimmten Liga.
 * Dabei kann mit der Parameterübergabe das Design der Tabelle bestimmt werden.
 * 
 * @params:	nextgames 		-> Die Spieleliste mit den notwendigen Informationen
 * 			tabledesign 	-> Das zu verwendete Design für die Tabelle
 * 			
 * @return:	Die Spielplantabelle als Directive
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
        	
        	/**
        	 * Bestimmt, ob das PopUp der Kartenanzeige angezeigt werden soll oder nicht
        	 */
      	  	$scope.toggleModal = function() {
      	  		$scope.modalShown = !$scope.modalShown;
      	  	};
        	
      	  	/**
      	  	 * Bestimmt die Hallenadresse, die sich hinter dem Hallenlink des Spiels verbirgt und
      	  	 * liefert den Adresse in einer scope-Variable zurück
      	  	 * 
      	  	 * @params:	hallenlink	-> Die Stelle an der nach der Adresse gesucht werden soll
      	  	 * 
      	  	 * @return: $scope.hallenaddress -> Die gefundene Adresse 
      	  	 */
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
 * Diese Directive ermöglicht den Aufruf eines PopUps. 
 * Die Größe des PopUps kann mittels Attribute bestimmt werden.
 * Das PopUp wird zentriert dargestellt und der Rest der Webanwendung
 * wird grau-durchlässig dargestellt.
 * 
 * @params:	control -> Stellt eine logische Verbindung zum übergeordneten Controller 
 * 						her um aus ihm die Directive steuern zu können
 * 			show	-> Bestimmt ob das PopUp angezeigt werden soll oder nicht (true/false)
 * 
 * @return Das PopUp als Directive
 */
app.directive("modalDialog", [function() {
	  return {
	    restrict: 'E',
	    scope: {
	    	control: '=',
	    	show: '='
	    },
	    replace: true,
	    transclude: true,
	    link: function(scope, element, attrs) {
	    	//Übergebende control Variable wird in Directive übernommen. Wenn keine vorhanden, dann ein leeres Objekt.
	    	scope.internalControl = scope.control || {};
	    	scope.dialogStyle = {};
	      
	    	//Attribute Width bestimmt die Breite des PopUps
	    	if (attrs.width){
	    		scope.dialogStyle.width = attrs.width;
	    	}
	      
	    	//Attribute Height bestimmt die Höhe des PopUps
	    	if (attrs.height){
	    		scope.dialogStyle.height = attrs.height;
	    	}
	      
	    	//Lässt das PopUp verschwinden
	    	scope.internalControl.hideModal = function() {
	    		scope.show = false;
	    	};
	    },
	    template: 	"<div class='ng-modal' ng-show='show'>" +
	    			"	<div class='ng-modal-overlay' ng-click='internalControl.hideModal()'>" +
	    			"	</div>" +
	    			"	<div class='ng-modal-dialog' ng-style='dialogStyle'>" +
	    			"		<div class='ng-modal-close' ng-click='internalControl.hideModal()'>" +
	    			"			X" +
	    			"		</div>" +
	    			"		<div class='ng-modal-dialog-content' ng-transclude>" +
	    			"		</div>" +
	    			"	</div>" +
	    			"</div>"
	  };
}]);


/**
 * Diese Directive kann anhand einer Adresse den Ort auf einer GoogleMap-Karte darstellen.
 * Dabei kann der Zoom-Faktor auf den Ort bestimmt werden.
 * 
 * @params:	address -> Addresse des zu findenen Ortes
 * 			zoom	-> Zoomstufe auf den Ort
 * 
 * @return:	Die GoogleMap-Karte mit dem marktierten Ort als Directive
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
            
            /**
             * Überprüft ob ein Objekt leer ist
             * 
             * @params: obj -> Zu überprüfende Objekt
             * 
             * @return: true 	-> Objekt ist leer
             * 			false	-> Objekt ist gefüllt
             */
            var isEmpty = function (obj) {
        	    for(var key in obj) {
        	        if(obj.hasOwnProperty(key)){
        	            return false;
        	        }
        	    }
        	    return true;
        	};
            
        	/**
        	 * Initialisiert die Standardvariablen der GoogleMap-API
        	 */
            var initialize = function () {
                geocoder = new google.maps.Geocoder();
                latlng = new google.maps.LatLng(-34.397, 150.644);
            };
            
            /**
             * Markiert den gefundenen Ort auf der Karte
             */
            var markAdressToMap = function () {
                geocoder.geocode({ 'address': $scope.address }, 
                function (results, status) 
                  {
                    if (status === google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        
                        //Erstellt die Markierung für den Ort
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            animation:google.maps.Animation.BOUNCE
                        });
                        
                        //Erstellt ein kleines Infofenster in dem die Adresse steht,
                        //das über der Markierung schwebt
                        var infowindow = new google.maps.InfoWindow({
                      	  content: $scope.address
                      	  });

                      	infowindow.open(map,marker);
                    }
                });
            };
            
            /**
             * Erzeugt die Karte mit den angegebenen Parametern und dem gefundenen Ort
             */
            $scope.$watch("address", function () {
            	
            	var mapOptions = {
                        zoom: $scope.zoom,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                map = new google.maps.Map(document.getElementById('addressMap'), mapOptions);
            	
                //Wird benötigt um die Karte korrekt darzustellen 
                //aufgrund der prozentuallen Abhängigkeit der Kartengröße
            	window.setTimeout(function(){ 
            		google.maps.event.trigger(map, 'resize');
            		
            		if ($scope.address !== undefined) {
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