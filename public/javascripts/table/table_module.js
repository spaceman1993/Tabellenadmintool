/**
 * Enthält Controller, Services, Direktiven etc. für die Tabellen des Tabellenadministrationstools
 */

var zIndexCount = 0; // Für Notizzettel auf Pinnwand
angular.module('tableModule', [])


/**
 * Direktive für Notiztelle des zweiten Designs
 */
.directive('stickyNote', function() {
	var linker = function(scope, element, attrs) {
		element.draggable({
			start: function(even, ui) {
				//Notiz wird an vorderste Stelle geholt
				element.css("z-index", ++zIndexCount);
			},
			stop: function(event, ui) {
				$(event.toElement).one('click', function(e){
					//Click bei Drop wird abgefangen
					e.stopImmediatePropagation();
				});
				//neue Position wird gespeichert
				scope.league.notePosLeft = ui.position.left / element.parent().width() * 100 + '%';
				scope.league.notePosTop = ui.position.top / element.parent().height() * 100 + '%';
				element.css('left', scope.league.notePosLeft);
				element.css('top', scope.league.notePosTop);
			},
			containment: 'parent'
		});
		element.css('left', scope.league.notePosLeft); //Initialwert
		element.css('top', scope.league.notePosTop); //Initialwert
	};

	return {
		restrict: 'A',
		link: linker,
		scope: {
			league: '='
		}
	};
})


/**
 * Controller für Tabellen (beide Designs)
 */
.controller("TableCtrl", ['$scope', '$http', '$filter', 'dataService', 'userFactory', 'activUser', function($scope, $http, $filter, dataService, userFactory, activUser) {
	
	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	};
	
	$scope.initTableControllerVars = function() {
		
		$scope.mannschaften = "";
		
		if(userFactory.getBenutzer("admin") === null){
			var settings = new Object();
			
			settings.anzeige = new Object();
			settings.anzeige.designauswahl = new Object();
			settings.anzeige.designauswahl.firstdesign = true;
			settings.anzeige.designauswahl.seconddesign = true;
			settings.anzeige.standardDesign = "1";
			settings.anzeige.favoritVerein = "";
			settings.anzeige.spielplan = "ja";
			settings.anzeige.verwaltung = "ja";
			
			settings.design = new Object();
			settings.design.tableDesign = new Object();
			settings.design.tableDesign.backgroundColorHeader = "#030094";
			settings.design.tableDesign.textColorHeader = "#ffffff";
			settings.design.tableDesign.backgroundColor = "#ffffff";
			settings.design.tableDesign.textColor = "#000000";
			settings.design.tableDesign.tableStriped = true;
			settings.design.tableDesign.stripedColor = "#cccccc";
			settings.design.tableDesign.captionColor = "#000000";
			settings.design.tableDesign.highlightColor = "#9ca0ff";
			settings.design.tableDesign.tableBordered = false;
			
			settings.liga = new Object();
			settings.liga.leagues = new Array();
			settings.liga.favoritLeague = new Object();
			
			userFactory.addBenutzer("admin", "passwort", settings);
		}
		
		
		if(!isEmpty(activUser.user)){
			$scope.isLogin = true;
			$scope.benutzer = activUser.user;
		}
		else{
			activUser.user = userFactory.getBenutzer("admin");
			$scope.benutzer = activUser.user;
		}
		
		if(!isEmpty($scope.benutzer)){
			$scope.nickname = $scope.benutzer.name;
			
			$scope.firstDesign = $scope.benutzer.settings.anzeige.designauswahl.firstdesign;
			$scope.secondDesign = $scope.benutzer.settings.anzeige.designauswahl.seconddesign;
			$scope.favoritVerein = $scope.benutzer.settings.anzeige.favoritVerein;
			$scope.spielplan = $scope.benutzer.settings.anzeige.spielplan;
			$scope.verwaltung = $scope.benutzer.settings.anzeige.verwaltung;
			
			$scope.design = $scope.benutzer.settings.anzeige.standardDesign;
			$scope.tableDesign = $scope.benutzer.settings.design.tableDesign;
			$scope.activeLeagues = $filter('filter')($scope.benutzer.settings.liga.leagues, {isActiv: 'true'});
			$scope.favoritLeague = $scope.benutzer.settings.liga.favoritLeague;
		}
		
		if(!isEmpty($scope.favoritLeague)){
			$scope.getTableForLeague($scope.favoritLeague);
		}
	};
	
	$scope.loginBenutzer = function(name, passwort) {
		
		if(userFactory.getBenutzer(name) === null){
			$scope.addBenutzer(name, passwort);
			$scope.loginBenutzer(name, passwort);
			//$scope.error = "Benutzer mit angegebenem Kennwort unbekannt ";
		}
		else{
			activUser.user = userFactory.getBenutzer(name);
			$scope.benutzer = activUser.user;
			$scope.isLogin = true;
			$scope.initTableControllerVars();
		}
	};
	
	$scope.logoutBenutzer = function() {
		activUser.user = null;
		$scope.isLogin = false;
		$scope.initTableControllerVars();
	};
	
	$scope.addBenutzer = function(name, passwort) {
		
		var settings = angular.copy(userFactory.getBenutzer('admin').settings);
		
		userFactory.addBenutzer(name, passwort, settings);
	};
	
    $scope.isNumber = function (value) {
        return !isNaN(value);
    };
    
    $scope.getNameForLeague = function(league){
    	if(isEmpty(league.specialName)){
    		return league.jugend;
    	}else{
    		return league.specialName;
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
  
    checkAndGetData =  function (obj /*, level1, level2, ... levelN*/) {
    	  var args = Array.prototype.slice.call(arguments, 1);

    	  for (var i = 0; i < args.length; i++) {
    	    if (!obj || !obj.hasOwnProperty(args[i])) {
    	    	if(!isEmpty(obj)){
    	    		if(typeof obj.content !== "undefined"){
    	    			return obj.content;
    	    		}
    	    		else{
    	    			return obj;
    	    		}
    	    	}
    	    	else{
    	    		return '';
    	    	}
    	    }
    	    obj = obj[args[i]];
    	  }
    	  return obj;
    };
    
	$scope.getTableForLeague = function(league) {

		$scope.mannschaften = null;
		$scope.nextGames = null;
		$scope.loading = true;
		
		$scope.leagueName = $scope.getNameForLeague(league) + ' (' + league.name + ')';
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
        mannschaft.rang = parseInt(checkAndGetData(mannschaftsdaten[1], 'content'));
        mannschaft.mannschaft = checkAndGetData(mannschaftsdaten[2], 'a', 'content');
        mannschaft.begegnungen = checkAndGetData(mannschaftsdaten[3], 'content');
        mannschaft.siege = checkAndGetData(mannschaftsdaten[4], 'content');
        mannschaft.unentschieden = checkAndGetData(mannschaftsdaten[5], 'content');
        mannschaft.niederlagen = checkAndGetData(mannschaftsdaten[6], 'content');
        mannschaft.tore = checkAndGetData(mannschaftsdaten[7], 'content');
        mannschaft.verhaeltnis = checkAndGetData(mannschaftsdaten[8], 'content');
        mannschaft.punkte = checkAndGetData(mannschaftsdaten[9], 'content');

        
        mannschaften.push(mannschaft);
      }

      if($scope.spielplan === 'ja'){
	      var nextGames = new Array();
	      
	      daten = data.query.results.table[1].tbody.tr;
	      for(i = 1; i< daten.length; i++){
	        var spieldaten = daten[i].td;
	        
	        var nextGame = new Object();
	        nextGame.tag = checkAndGetData(spieldaten[0], 'content');
	        nextGame.datum = checkAndGetData(spieldaten[1], 'content');
	        nextGame.zeit = checkAndGetData(spieldaten[2], 'content').substr(35, 5);
	        nextGame.halle = checkAndGetData(spieldaten[3], 'span', 'a', 'content');
	        nextGame.hallenname = checkAndGetData(spieldaten[3], 'span', 'title');
	        nextGame.hallenlink = checkAndGetData(spieldaten[3], 'span', 'a', 'href');
	        nextGame.nr = checkAndGetData(spieldaten[4]);
	        nextGame.heimmannschaft = checkAndGetData(spieldaten[5], 'content'); 
	        nextGame.gastmannschaft = checkAndGetData(spieldaten[6], 'content');
	        nextGame.tore = checkAndGetData(spieldaten[7], 'span', 'content');

	        
	        nextGames.push(nextGame);
	      }
      }
      
      $scope.loading = false;
      
      $scope.mannschaften = mannschaften;
      $scope.nextGames = nextGames;
    });
  };
	
}])



/**
 * Pseudo-Datenbank
 */
.factory("userFactory", function () {
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
      addBenutzer: function (name, passwort, settings) {
        benutzerListe.push({name:name, passwort:passwort, settings:settings});
      }
    };
    
});