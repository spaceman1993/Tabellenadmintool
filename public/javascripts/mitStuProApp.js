var app = angular.module('mitStuPro', ['ui.router', 'ui.bootstrap', 'colorpicker.module', 'ngAnimate', 'angular-spinkit']);
var zIndexCount = 0;
app.directive('stickyNote', function(socket) {
	var linker = function(scope, element, attrs) {
		element.draggable({
			start: function(even, ui) {
				element.css("z-index", zIndexCount++); 
				console.log(zIndexCount);
			},
			stop: function(event, ui) {
				socket.emit('moveNote', {
					id: scope.league.id,
					x: ui.position.left,
					y: ui.position.top
				});
				$( event.toElement ).one('click', function(e){
					e.stopImmediatePropagation();
				});
				scope.league.notePosLeft = ui.position.left;
				scope.league.notePosTop = ui.position.top;
			},
			containment: 'parent'
		});

		socket.on('onNoteMoved', function(data) {
			// Update if the same note
			if(data.id == scope.league.id) {
				element.animate({
					left: data.x,
					top: data.y
				});
			}
		});
		element.css('left', scope.league.notePosLeft);
		element.css('top', scope.league.notePosTop);
	};

	return {
		restrict: 'A',
		link: linker,
		scope: {
			league: '='
		}
	};
});

app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

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


app.controller("TableController", ['$scope', '$http', '$filter', 'dataService', 'userFactory', 'activUser', function($scope, $http, $filter, dataService, userFactory, activUser) {
    
	$scope.tableDesign = dataService.tableDesign;
	
	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	};
	
	$scope.initTableControllerVars = function() {
		
		if(userFactory.getBenutzer("admin") === null){
			userFactory.addBenutzer("admin", "passwort", true, true, '1', '', 'ja', 'ja', '');
		}
		
		if(!isEmpty(activUser.user)){
			$scope.benutzer = activUser.user;
			$scope.isLogin = true;
		}
		else{
			$scope.benutzer = userFactory.getBenutzer("admin");
			activUser.user = $scope.benutzer;
		}
		
		
		$scope.design = $scope.benutzer.standardDesign;
		$scope.activeLeagues = $filter('filter')(dataService.leagues, {isActiv: 'true'});
		
		if(!isEmpty($scope.benutzer.favoritLeague)){
			$scope.getTableForLeague($scope.benutzer.favoritLeague);
		}
	};
	
	$scope.loginBenutzer = function(name, passwort) {
		
		if(userFactory.getBenutzer(name) === null){
			$scope.addBenutzer(name, passwort);
			$scope.loginBenutzer(name, passwort);
			//$scope.error = "Benutzer mit angegebenem Kennwort unbekannt ";
		}
		else{
			$scope.benutzer = userFactory.getBenutzer(name);
			activUser.user = $scope.benutzer;
			$scope.isLogin = true;
			$scope.initTableControllerVars();
		}
	};
	
	$scope.logoutBenutzer = function() {
		$scope.benutzer = null;
		activUser.user = null;
		$scope.isLogin = false;
		$scope.initTableControllerVars();
	};
	
	$scope.addBenutzer = function(name, passwort) {
		
		var admin = userFactory.getBenutzer('admin');
		
		userFactory.addBenutzer(name, passwort, admin.first, admin.second, admin.standardDesign, admin.favoritVerein, admin.spielplan, admin.verwaltung, admin.favoritLeague);
	};
	
    $scope.isNumber = function (value) {
        return !isNaN(value);
    };
    
    $scope.isHighlight = function (mannschaft) {
    	
    	if(String($scope.benutzer.favoritVerein).length > 3 && String(mannschaft.mannschaft).match($scope.benutzer.favoritVerein)){
    		return 'success';
    	}
    	
    };
    
    $scope.chooseColor = function (input) {
    	
    	if(input === 'Herren' || input === 'Männlich'){
    		return 'btn-primary';
    	}
    	else if(input === 'Damen' || input === 'Weiblich'){
    		return 'btn-danger';
    	}
    	
    };
  
	$scope.getTableForLeague = function(league) {
        // Get data of team and show it in table
		/*
		 Durch das Two-Way-Databinding wird die HTML-Tabelle direkt geändert, wenn sich das Teams-Objekt ändert.
		 Hier wird ein Name übergeben, über den die entsprechende Tabelle geholt wurde.
		 An dieser Stelle muss nun natürlich die Tabelle extern geholt werden.
		*/
		$scope.mannschaften = null;
		$scope.nextGames = null;
		$scope.loading = true;
		
		$scope.leagueName = league.jugend + ' (' + league.name + ')';
		var adresse = league.linkage;
		
    console.log(adresse);
    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";


    // Actually fetch the data
    $http.get(jsonFeed).success(function (data) {
      // Define the unique market cities
      
      var mannschaften = new Array();

      var daten = data.query.results.table[0].tbody.tr;
      for(var i = 1; i < daten.length; i++){
        var mannschaftsdaten = daten[i].td;
        
        var mannschaft = new Object();
        mannschaft.rang = parseInt(mannschaftsdaten[1].content);
        if (typeof mannschaftsdaten[2].a !== "undefined"){
        	mannschaft.mannschaft = mannschaftsdaten[2].a.content;
        }else{
        	mannschaft.mannschaft = mannschaftsdaten[2].content;
        }
        
        mannschaft.begegnungen = mannschaftsdaten[3].content;
        mannschaft.siege = mannschaftsdaten[4].content;
        if (typeof mannschaftsdaten[5] !== "undefined"){
          mannschaft.unentschieden = mannschaftsdaten[5].content;
        }
        if (typeof mannschaftsdaten[6] !== "undefined"){
        mannschaft.niederlagen = mannschaftsdaten[6].content;
        }
        if (typeof mannschaftsdaten[7] !== "undefined"){
        mannschaft.tore = mannschaftsdaten[7].content;
        }
        if (typeof mannschaftsdaten[8] !== "undefined"){
        mannschaft.verhaeltnis = mannschaftsdaten[8].content;
        }
        if (typeof mannschaftsdaten[9] !== "undefined"){
        mannschaft.punkte = mannschaftsdaten[9].content;
        }
        
        mannschaften.push(mannschaft);
      }

      if($scope.benutzer.spielplan === 'ja'){
	      var nextGames = new Array();
	      
	      daten = data.query.results.table[1].tbody.tr;
	      for(i = 1; i< daten.length; i++){
	        var spieldaten = daten[i].td;
	        
	        var nextGame = new Object();
	        nextGame.tag = spieldaten[0].content;
	        nextGame.datum = spieldaten[1].content;
	        nextGame.zeit = spieldaten[2].content.substr(35, 5);
	        nextGame.halle = spieldaten[3].span.a.content;
	        nextGame.hallenname = spieldaten[3].span.title;
	        nextGame.hallenlink = spieldaten[3].span.a.href;
	        nextGame.nr = spieldaten[4];
	        nextGame.heimmannschaft = spieldaten[5].content;
	        nextGame.gastmannschaft = spieldaten[6].content;
	        if (typeof spieldaten[7].span.content !== "undefined"){
	          nextGame.tore = spieldaten[7].span.content;
	        }
	        else if (typeof spieldaten[7].span !== "undefined"){
	          nextGame.tore = spieldaten[7].span;
	        }
	        
	        nextGames.push(nextGame);
	      }
      }
      
      $scope.loading = false;
      
      $scope.mannschaften = mannschaften;
      $scope.nextGames = nextGames;
    });
  };
	
	if(!isEmpty($scope.favoritLeague)){
		$scope.getTableForLeague($scope.favoritLeague);
	}
    
	
	
}]);

app.controller('SettingsCtrl', ['$scope', '$http', '$filter', 'dataService', 'activUser', function($scope, $http, $filter, dataService, activUser){
	
	$scope.beispielTabelle = [
	                          { rang: 1, mannschaft: "THW Kiel", begegnungen: 33, siege: 29, unentschieden: 1, niederlagen: 3, tore: "1010:776", verhaeltnis: 234, punkte: "59:7" },
	                          { rang: 2, mannschaft: "Rhein-Neckar Löwen", begegnungen: 31, siege: 26, unentschieden: 1, niederlagen: 4, tore: "927:757", verhaeltnis: 170, punkte: "53:9" },
	                          { rang: 3, mannschaft: "SG Flensburg-Handewit", begegnungen: 33, siege: 21, unentschieden: 6, niederlagen: 6, tore: "942:817", verhaeltnis: 125, punkte: "48:18" },
	                          { rang: 4, mannschaft: "SC Magdeburg", begegnungen: 32, siege: 22, unentschieden: 2, niederlagen: 8, tore: "957:870", verhaeltnis: 87, punkte: "46:18" },
	                          { rang: 5, mannschaft: "FRISCH AUF! Göppingen", begegnungen: 34, siege: 18, unentschieden: 4, niederlagen: 12, tore: "925:915", verhaeltnis: 10, punkte: "40:28" },
	                          { rang: 6, mannschaft: "Füchse Berlin", begegnungen: 32, siege: 17, unentschieden: 3, niederlagen: 12, tore: "884:884", verhaeltnis: 0, punkte: "37:27" },
	                          { rang: 7, mannschaft: "MT Melsungen", begegnungen: 33, siege: 16, unentschieden: 4, niederlagen: 13, tore: "979:915", verhaeltnis: 64, punkte: "36:30" },
	                          { rang: 8, mannschaft: "HSG Wetzlar", begegnungen: 34, siege: 13, unentschieden: 6, niederlagen: 15, tore: "908:901", verhaeltnis: 7, punkte: "32:36" },
	                          { rang: 9, mannschaft: "HSV Handball", begegnungen: 34, siege: 15, unentschieden: 2, niederlagen: 17, tore: "934:930", verhaeltnis: 4, punkte: "32:36" }
	                        ];
	
	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	};
	
	$scope.initTableDesigns = function(){
		$scope.tableDesign1 = new Object();
		$scope.tableDesign1.backgroundColorHeader = "#030094";
		$scope.tableDesign1.textColorHeader = "#ffffff";
		$scope.tableDesign1.backgroundColor = "#ffffff";
		$scope.tableDesign1.textColor = "#000000";
		$scope.tableDesign1.tableStriped = true;
		$scope.tableDesign1.stripedColor = "#cccccc";
		$scope.tableDesign1.captionColor ="#000000";
		$scope.tableDesign1.highlightColor = "#9ca0ff"
		$scope.tableDesign1.highlightColor = "#9ca0ff"
		$scope.tableDesign1.tableBordered = false;
	};
	
	$scope.changeTableDesign = function(design){
		$scope.tableDesign.backgroundColorHeader = design.backgroundColorHeader;
		$scope.tableDesign.textColorHeader = design.textColorHeader;
		$scope.tableDesign.backgroundColor = design.backgroundColor;
		$scope.tableDesign.textColor = design.textColor;
		$scope.tableDesign.tableStriped = design.tableStriped;
		$scope.tableDesign.stripedColor = design.stripedColor;
		$scope.tableDesign.captionColor = design.captionColor;
		$scope.tableDesign.highlightColor = design.highlightColor;
		$scope.tableDesign.tableBordered = design.tableBordered;
	};
	
	$scope.initSettingsControllerVars = function() {
		$scope.benutzer = activUser.user;
		$scope.tableDesign = dataService.tableDesign;
		
		$scope.initTableDesigns();
		
		if(isEmpty($scope.tableDesign)){
			$scope.changeTableDesign($scope.tableDesign1);
		}
	};
	
	
	$scope.changeDesignauswahl = function(designauswahl){
		if(designauswahl.first){
			$scope.benutzer.firstdesign = true;
		}
		else{
			$scope.benutzer.firstdesign = false;
		}
		
		if(designauswahl.second){
			$scope.benutzer.seconddesign = true;
		}
		else{
			$scope.benutzer.seconddesign = false;
		}
	};
	
	$scope.changeFirstDesign = function() {
		if($scope.benutzer.first){
			$scope.benutzer.standardDesign = "1";
		}else{
			$scope.benutzer.standardDesign = "2";
		}
	};
	
	$scope.changeSecondDesign = function() {
		if($scope.benutzer.second){
			$scope.benutzer.standardDesign = "2";
		}else{
			$scope.benutzer.standardDesign = "1";
		}
	};
    
	$scope.changeStandardDesign = function(standardDesign){
		
		$scope.benutzer.standardDesign = standardDesign;
		
	};
	
	$scope.changeFavorisierterVerein = function(vereinsname){
		$scope.benutzer.favoritVerein = vereinsname;
	};
	
	$scope.changeSpielplan = function(spielplan){

		$scope.benutzer.spielplan = spielplan;

	};
	
	$scope.changeLogin = function(verwaltung){

		$scope.benutzer.verwaltung = verwaltung;
			
	};
	
	//Liga-Manager Init-Var
	$scope.initLigaManagerVars = function() {
		$scope.leagues = dataService.leagues;
		$scope.jugenden = $filter('listGroupBy')( $scope.leagues, 'jugend');
		
		$scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		$scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		
		$scope.favorit = $scope.benutzer.favorit;
		
	};
	
	
	$scope.ligenplanLink = "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/leaguePage?championship=Bremer+HV+14/15";
	
	$scope.getAllLeagues = function(ligenplanLink) {

		$scope.leagues = null;
		$scope.jugenden = null;
		$scope.loading = true;
		
		ligenplanLink = ligenplanLink.replace('"', '%3A').replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
		
		var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + ligenplanLink + "%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftr%2F%2Ftd%2F%2Ful%2F%2Fli%2F%2Fspan%2F%2Fa%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

		$http.get(jsonFeed).success(function (data) {
			
			var leagues = new Array();

			var daten = data.query.results.a;
		    	for(var i = 0; i < daten.length; i++){
		    		
		    		var leagueData = daten[i];
		    		var league = new Object();
		    		var namensnennung = leagueData.content;
		        
		    		league.id = i;
		        
			        if(namensnennung.indexOf("MJ") !== -1){
			        	league.gender = "Männlich";
			        	league.jugend = "Männliche " + namensnennung.substr(namensnennung.indexOf("MJ")+2, 1) + "-Jugend";
			        	namensnennung = namensnennung.replace(" MJ"+namensnennung.substr(namensnennung.indexOf("MJ")+2, 1), "");
			        }
			        else if(leagueData.content.indexOf("WJ") !== -1){
			        	league.gender = "Weiblich";
			        	league.jugend = "Weibliche " + namensnennung.substr(namensnennung.indexOf("WJ")+2, 1) + "-Jugend";
			        	namensnennung = namensnennung.replace(" WJ"+namensnennung.substr(namensnennung.indexOf("WJ")+2, 1), "");
			        }
			        else if(namensnennung.indexOf(" M") !== -1){
			        	league.gender = "Männlich";
			        	league.jugend = "Herren";
			        	namensnennung = namensnennung.replace(" M", "");
			        }
			        else if(namensnennung.indexOf(" F") !== -1){
			        	league.gender = "Weiblich";
			        	league.jugend = "Damen";
			        	namensnennung = namensnennung.replace(" F", "");
			        }
			        else{
			        	league.gender = "undefined";
			        	league.jugend = "undefined";
			        }
			        
			        league.name = namensnennung;
			        league.specialName = "";
			        league.linkage = "https://bremerhv-handball.liga.nu" + leagueData.href;
			        league.isActiv = false;
			        league.notePosLeft = 10;
			        league.notePosTop = 10;
			       
			        leagues.push(league);
		    	}

		    	$scope.loading = false;
		    	
		    	dataService.leagues = leagues;
		    	$scope.initLigaManagerVars();
		    	
		});
	};
	
	
	$scope.changeFavorit = function(league){
		$scope.benutzer.favoritLeague = league;
	};
	
	$scope.checkSearchVerein = function(){
		
		if(!$scope.search && !$scope.searchStart){
			$scope.search = true;
		}
		else if($scope.searchVerein  && !$scope.searchStart){
			$scope.search = false;
			$scope.searchStart = true;
			findAllLeaguesOfVerein($scope.searchVerein);
		}
		else{
			$scope.search = false;
		}
	};
	
	$scope.progressbaraktuell = 0;
	$scope.progressbaraktuellprozent = 0;
	
	var findAllLeaguesOfVerein = function (verein){
		
		var leagues = $scope.leagues;
		$scope.anzahlSearch = 0;
		
		for(var i=0; i<leagues.length; i++){
			checkIfVereinInLeague(leagues[i], verein);
		}
	};
	
	var checkIfVereinInLeague = function(league, verein) {
		
		var adresse = league.linkage;

	    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	    $http.get(jsonFeed).success(function (data) {
	      
	      var mannschaften = new Array();

	      try{
		      var daten = data.query.results.table[0].tbody.tr;
	
		      
		      for(var i = 1; i < daten.length; i++){
		        var mannschaftsdaten = daten[i].td;
		        var mannschaft = new Object();
		        if (typeof mannschaftsdaten[2].a !== "undefined"){
		        	mannschaft = mannschaftsdaten[2].a.content;
		        }else{
		        	mannschaft = mannschaftsdaten[2].content;
		        }
		        mannschaften.push(mannschaft);
		      }
	
		      var found = false;
		      var j=0;
		      while(j < mannschaften.length && !found){
				if(mannschaften[j].indexOf(verein) > -1){
					league.isActiv = true;
					$scope.addActivLeague(league);
					$scope.anzahlSearch = $scope.anzahlSearch + 1;
					found = true;
				}
				j++;
		      }
	      }catch (e) {
			// TODO: handle exception
		}
	      
	      $scope.progressbaraktuell = $scope.progressbaraktuell + 1;
	      $scope.progressbaraktuellprozent = (($scope.progressbaraktuell / $scope.leagues.length) * 100);
	      
	      if( $scope.progressbaraktuellprozent === 100){
	    	  $scope.searchStart = false;
	    	  $scope.progressbaraktuell = 0;
	    	  $scope.progressbaraktuellprozent = 0;
	      }
	    });
	  };
	
	  $scope.changeActiv = function(league) {
		  if(league.isActiv){
			  $scope.deleteActivLeague(league);
		  }
		  else{
			  $scope.addActivLeague(league);
		  }
	  };
	  
	  $scope.addActivLeague = function(league) {
		  league.isActiv = true;
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  if(isEmpty($scope.benutzer.favoritLeague)){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  dataService.leagues = $scope.leagues;
	  };
	  
	  $scope.deleteActivLeague = function(league) {
		  league.isActiv = false;
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  if($scope.benutzer.favoritLeague === league){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  dataService.leagues = $scope.leagues;
	  };
	  
	  $scope.changeSpecialName = function(league, specialName) {
		  league.specialName = specialName;
	  };
	  
	  
	  
}]);

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

app.filter('findObjectBy', function() {
	return function(objects, property, value) {
		return objects.filter(function (value) {
            return val[property] !== value;
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
        templateUrl: "templates/ligatabelle.html"
		
    };
});


app.directive('spielplantabelle', function () {
    // return the directive definition object 
    return {
    	restrict: 'E',
        scope: {
        	nextgames: '=',
        	tabledesign: '='
        },
        controller: function ($scope) {
            
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
        templateUrl: 	"templates/spielplantabelle.html"
		
    };
});


app.directive('modalDialog', function() {
	  return {
	    restrict: 'E',
	    scope: {
	      show: '='
	    },
	    replace: true, // Replace with the template below
	    transclude: true, // we want to insert custom content inside the directive
	    link: function(scope, element, attrs) {
	      scope.dialogStyle = {};
	      if (attrs.width)
	        scope.dialogStyle.width = attrs.width;
	      if (attrs.height)
	        scope.dialogStyle.height = attrs.height;
	      scope.hideModal = function() {
	        scope.show = false;
	      };
	    },
	    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
	  };
});


app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

	$stateProvider
    .state('table', {
      url: '/table',
      templateUrl: '/table.html',
      controller: 'TableController'
    });
	
	$stateProvider
	.state('settings', {
	  url: '/settings',
	  templateUrl: '/settings.html',
	  controller: 'SettingsCtrl'
	});

  $urlRouterProvider.otherwise('table');
}]);