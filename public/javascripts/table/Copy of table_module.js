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
.controller("TableCtrl", ['$scope', '$q', '$http', '$filter', '$timeout', 'benutzerFactory', 'activUser', function($scope, $q, $http, $filter, $timeout, benutzerFactory, activUser) {

	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	};
	
	$scope.getAllBenutzer = function() {
		benutzerFactory.getAllUser(function(data){
			return data;
		});
	};
	
	$scope.getBenutzerByName = function(name) {
		var json = {"name" : name};
		benutzerFactory.getUserByName(json ,function(data){
			return data;
		});
	};
	
	$scope.craeteBenutzer = function(name, passwort, settigs, crypt) {
		var craeteBenutzerJson = {
			"name" : name,
			"passwort" : passwort,
			"einstellung" : settigs,
			"crypt" : crypt
			};
		benutzerFactory.create(craeteBenutzerJson ,function(data){
			return data;
		});
	};
	
	
	$scope.updateBenutzerSettings = function(name, settings){
		var updateBenutzerSettingsJson = {"name" : name};
		benutzerFactory.updateUserByName(updateBenutzerSettingsJson, settings  ,function(data){
			return data;
		});
	};	
	
	var getLoginUser = function(name){
		var json = {"name" : name};
	    
		var deferred = $q.defer();
		benutzerFactory.getUserByName(json ,function(data){
		   
			deferred.resolve(data);
	
		});
		return deferred.promise;
	};
	
	var admin = Object;
	getLoginUser("admin").then(function(data) {
		admin = data;
	});
	
//	http://liamkaufman.com/blog/2013/09/09/using-angularjs-promises/
	
	$scope.initTableControllerVars = function(count) {
		
//		if(count === undefined){
//			count = 0;
//		}
		$scope.mannschaften = "";
		
//			if(admin.arguments === null && $scope.count > 5000){
//				count ++;
//				$scope.initTableControllerVars($scope.count);
//				return;
//			}
			if(admin === null){
				$scope.firstStart = true;
				$scope.willkommen = true;
			}
			
			if(!isEmpty(activUser.user)){ // oder if activUser.isLogin === true;
				$scope.isLogin = activUser.isLogin;
				$scope.benutzer = activUser.user;
			}
			else if(admin !== null){
				activUser.user = admin;
				$scope.benutzer = activUser.user;
			}
			
			if(!isEmpty($scope.benutzer)){
				$scope.admin = $scope.benutzer.name;
				
				$scope.firstDesign = $scope.benutzer.einstellung.anzeige.designauswahl.firstdesign;
				$scope.secondDesign = $scope.benutzer.einstellung.anzeige.designauswahl.seconddesign;
				$scope.favoritVerein = $scope.benutzer.einstellung.anzeige.favoritVerein;
				$scope.spielplan = $scope.benutzer.einstellung.anzeige.spielplan;
				$scope.verwaltung = $scope.benutzer.einstellung.anzeige.verwaltung;
				
				$scope.design = $scope.benutzer.einstellung.anzeige.standardDesign;
				$scope.tableDesign = $scope.benutzer.einstellung.design.tableDesign;
				$scope.activeLeagues = $filter('filter')($scope.benutzer.einstellung.liga.leagues, {isActiv: 'true'});
				$scope.favoritLeague = $scope.benutzer.einstellung.liga.favoritLeague;
			}
			
			if(!isEmpty($scope.favoritLeague)){
				$scope.getTableForLeague($scope.favoritLeague);
			}
		
	};
	
	$scope.checkLogin = function() {
		
		errorHeader = ''
		if($scope.willkommen){
			$scope.firstStart = true;
		}
		else{
			$scope.showLogin = !$scope.showLogin; 
		}
		
	};
	
	$scope.loginBenutzer = function(name, passwort) {
		
		$scope.errorHeader = "";
		
		var benutzer;
		
		if (name === "admin"){
			benutzer = admin;
		}else{
			benutzer = $scope.getBenutzerByName(name);
		}
		
		if(benutzer !== null){
			if(passwort === benutzer.passwort){
				activUser.user = benutzer;
				activUser.isLogin = true;
				$scope.benutzer = activUser.user;
				$scope.isLogin = activUser.isLogin;
				$scope.initTableControllerVars();
			}
			else{
				$scope.errorHeader = "Kennwort falsch";
			}
		}
		else{
			$scope.errorHeader = "Keinen Benutzer unter diesen Namen vorhanden";
		}

	};
	
	$scope.logoutBenutzer = function() {
		activUser.user = null;
		activUser.isLogin = false;
		$scope.isLogin = activUser.isLogin;
		$scope.initTableControllerVars();
	};
	
	$scope.registiereBenutzer = function(benutzer) {
		if(!$scope.inVerwendung && $scope.registration.benutzername && !$scope.isIncorrect && $scope.isGleich){	
			$scope.registieren = false;
				
			var data = $scope.getBenutzerByName("admin");
				
			var settings = angular.copy(data.einstellung);
				
			benutzer.settings = settings;
			
			$scope.craeteBenutzer(benutzer.benutzername, benutzer.passwort, benutzer.settigs, benutzer.crypt);
			
			$scope.loginBenutzer(benutzer.benutzername, benutzer.passwort);			
		}
	}
	
	$scope.registiereAdminAccount = function(passwort) {

		if(!$scope.isIncorrect && $scope.isGleich){	
		
			$scope.willkommen = false;
			
			var benutzer = new Object();
			benutzer.benutzername = "admin";
			benutzer.passwort = passwort;
			
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
			
			benutzer.settings = settings;
			
			benutzer.crypt = "abc"
			
			$scope.craeteBenutzer(benutzer.name, benutzer.passwort, benutzer.settigs, benutzer.crypt);

			$scope.loginBenutzer("admin", benutzer.passwort);
			
			$scope.registration = new Object();
		}
	}
	
	
	$scope.showRegistration = function() {
		$scope.registieren = true;
		$scope.inVerwendung = false;
		$scope.isIncorrect = true;
		$scope.isGleich = false;
		$scope.registration = new Object();
		$scope.allBenutzer = $scope.getAllBenutzer();
		
		if(isEmpty($scope.registrationShown) || $scope.registrationShown == false){
			$scope.registrationShown = true;
		}
		else{
			$scope.registrationShown = false;
		}
	};
	
	$scope.checkBenutzer = function(benutzer) {
		$scope.inVerwendung = false;
		var i=0;
		while(i<$scope.allBenutzer.length && !$scope.inVerwendung){
			if(benutzer.toLowerCase() == $scope.allBenutzer[i].name.toLowerCase()){
				$scope.inVerwendung = true;
			}
			i++;
		}
	};
	
	$scope.checkPasswort = function(passwort) {
		$scope.isIncorrect = false;
		
		if(passwort.length < 6){
			$scope.isIncorrect = true;
			$scope.fehlerText = "Passwort muss min. 6-stellig sein";
		}
		else if(!(/\d/.test(passwort))){
			$scope.isIncorrect = true;
			$scope.fehlerText = "Passwort muss min. eine Zahl enthalten";
		}
	};
	
	$scope.checkPasswortBst = function(passwort, passwortbst) {
		if(passwort == passwortbst){
			$scope.isGleich = true;
		}
		else{
			$scope.isGleich = false;
		}
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
  
    checkAndGetData =  function (obj, returnObject /*, level1, level2, ... levelN*/) {
    	  var args = Array.prototype.slice.call(arguments, 1);

    	  for (var i = 1; i < args.length; i++) {
    	    if (!obj || !obj.hasOwnProperty(args[i])) {
    	    	if(!isEmpty(obj) && returnObject){
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
		$scope.error = null;
		
		$scope.leagueName = $scope.getNameForLeague(league) + ' (' + league.name + ')';
		var adresse = league.linkage;
		
    console.log(adresse);
    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";


    // Actually fetch the data
    $http.get(jsonFeed).success(function (data) {
      // Define the unique market cities
      
      var mannschaften = new Array();

      //var daten = data.query.results.table[0].tbody.tr;
      var daten = checkAndGetData(data, false, 'query', 'results', 'table', '0', 'tbody', 'tr');
      if(daten != ""){
	      for(var i = 1; i < daten.length; i++){
	        var mannschaftsdaten = daten[i].td;
	        
	        var mannschaft = new Object();
	        mannschaft.rang = parseInt(checkAndGetData(mannschaftsdaten[1], true, 'content'));
	        mannschaft.mannschaft = checkAndGetData(mannschaftsdaten[2], true, 'a', 'content');
	        mannschaft.begegnungen = checkAndGetData(mannschaftsdaten[3], true, 'content');
	        mannschaft.siege = checkAndGetData(mannschaftsdaten[4], true, 'content');
	        mannschaft.unentschieden = checkAndGetData(mannschaftsdaten[5], true, 'content');
	        mannschaft.niederlagen = checkAndGetData(mannschaftsdaten[6], true, 'content');
	        mannschaft.tore = checkAndGetData(mannschaftsdaten[7], true, 'content');
	        mannschaft.verhaeltnis = checkAndGetData(mannschaftsdaten[8], true, 'content');
	        mannschaft.punkte = checkAndGetData(mannschaftsdaten[9], true, 'content');
	
	        
	        mannschaften.push(mannschaft);
	      }
	
	      if($scope.spielplan === 'ja'){
		      var nextGames = new Array();
		      
		      daten = data.query.results.table[1].tbody.tr;
		      for(i = 1; i< daten.length; i++){
		        var spieldaten = daten[i].td;
		        
		        var nextGame = new Object();
		        nextGame.tag = checkAndGetData(spieldaten[0], true, 'content');
		        nextGame.datum = checkAndGetData(spieldaten[1], true, 'content');
		        nextGame.zeit = checkAndGetData(spieldaten[2], true, 'content').substr(35, 5);
		        nextGame.halle = checkAndGetData(spieldaten[3], true, 'span', 'a', 'content');
		        nextGame.hallenname = checkAndGetData(spieldaten[3], true, 'span', 'title');
		        nextGame.hallenlink = checkAndGetData(spieldaten[3], true, 'span', 'a', 'href');
		        nextGame.nr = checkAndGetData(spieldaten[4], true);
		        nextGame.heimmannschaft = checkAndGetData(spieldaten[5], true, 'content'); 
		        nextGame.gastmannschaft = checkAndGetData(spieldaten[6], true, 'content');
		        nextGame.tore = checkAndGetData(spieldaten[7], true, 'span', 'content');
	
		        
		        nextGames.push(nextGame);
		      }
	      }
	      
	      $scope.loading = false;
	      
	      $scope.mannschaften = mannschaften;
	      $scope.nextGames = nextGames;
      }
      else{
    	  $scope.loading = false;
    	  $scope.error = "Die Liga kann aufgrund von Auslesefehlern nicht korrekt dargestellt werden.";
      }
      
     
    });
  };
	
}]);

