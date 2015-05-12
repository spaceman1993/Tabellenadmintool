var app = angular.module('mitStuPro', ['ui.router', 'ui.bootstrap', 'colorpicker.module', 'ngAnimate']);


app.service('dataService', function() {
	  // private variable
	  var _leagues = new Array();
	  var _activeLeagues = new Array();
	  
	  var _jugenden = new Array();
	  
	  this.leagues = _leagues;
	  this.activeLeagues = _activeLeagues;
	  this.jugenden = _jugenden;
	})


app.factory('teams', [function(){
	// ganze factory unwichtig. war nur für die Simulation der Punktetabelle
	var o = {
		teams: [
			{name: 'A-Jugend', data: [
				{name: 'Team 1', wins : 1, loses : 2},
				{name: 'Team 2'},
				{name: 'Team 3'},
				{name: 'Team 4'},
				{name: 'Team 5'}	
			]},
			{name: 'C-Jugend', data: [
				{name: 'Team 6'},
				{name: 'Team 7'},
				{name: 'Team 8'},
				{name: 'Team 9'},
				{name: 'Team 10'}
			]},
		],
		activeTeams: ''
	};						
	return o;
}]);



app.controller('MainCtrl', ['$scope', '$filter', 'teams', function($scope, $filter, teams){
	$scope.teams = teams.activeTeams;
	console.log('Standard-Auswahl: ' + $scope.teams);
	
	$scope.incrementUpvotes = function(team) {
		team.points += 1;
	};
	
	$scope.$watch(function () { return teams.activeTeams; }, function (newValue, oldValue) {
		if (newValue !== oldValue) $scope.teams = newValue;
		$scope.teams = $filter('filter')(teams.teams, function (d) {return d.name === teams.activeTeams;})[0];
		console.log($scope.teams)
	});

	$scope.test = function() {
		var myEl = angular.element( document.querySelector( '#divID' ) );
		alert(myEl.attr('attribut'));
	};
}]);

app.controller("TableController", ['$scope', '$http', '$filter', 'dataService', 'teams', function($scope, $http, $filter, dataService, teams) {
    
	$scope.activeLeagues = $filter('filter')(dataService.leagues, {isActiv: 'true'});
	
    $scope.items2 = [
		{"itemId":1, "title":"Herren", "description":"Teams der Herren", 
			"teams":[
				{"name":"Herren", display: "Herren", linkage: "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176607"}
			]
		},
		{"itemId":1, "title":"Damen", "description":"Teams der Damen", 
			"teams":[
			    {"name":"Damen", display: "Damen", linkage: "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=196510"}
			]
		},
		{"itemId":1, "title":"A-Jugend", "description":"Teams der A-Jugend", 
			"teams":[
			    {"name":"Herren", display: "Männlich", linkage: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176706"},
			    {"name":"Damen", display: "Weiblich", linkage: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=176740"}
			]
		},
		{"itemId":1, "title":"B-Jugend", "description":"Teams der B-Jugend", 
			"teams":[
			    {"name":"Damen", display: "Weiblich", linkage: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176709"}
			]
		},
		{"itemId":1, "title":"D-Jugend", "description":"Teams der D-Jugend", 
			"teams":[
			    {"name":"Herren", display: "Männlich", linkage: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176712"}, 
			    {"name":"Damen", display: "Weiblich", linkage: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176713"}
			]
		},
		{"itemId":1, "title":"E-Jugend", "description":"Teams der E-Jugend", 
			"teams":[
			    {"name":"Herren", display: "Männlich", linkage: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176714"}
			 ]
		}
    ];
	
    
    $scope.isNumber = function (value) {
        return !isNaN(value);
    };
    
    $scope.isHighlight = function (mannschaft) {
    	return {
    		'success': mannschaft.mannschaft === 'HSG Vegesack/Hammersbeck'
    	};
    };
    
    $scope.chooseColor = function (input) {
    	
    	if(input == 'Herren' || input == 'Männlich'){
    		return 'btn-primary';
    	}
    	else if(input == 'Damen' || input == 'Weiblich'){
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
		$scope.leagueName = league.jugend + ' (' + league.name + ')';
		adresse = league.linkage;
		
    console.log(adresse);
		teams.activeTeams = adresse;
    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

// https%3A%2F%2Fbremerhv-handball.liga.nu%2Fcgi-bin%2FWebObjects%2FnuLigaHBDE.woa%2Fwa%2FgroupPage%3Fchampionship%3DBremer%2BHV%2B14%252F15%26group%3D176607;


    // Actually fetch the data
    $http.get(jsonFeed).success(function (data) {
      // Define the unique market cities
      
      var mannschaften = new Array();

      var daten = data.query.results.table[0].tbody.tr;
      for(i = 1; i < daten.length; i++){
        var mannschaftsdaten = daten[i].td;
        
        var mannschaft = new Object();
        mannschaft.rang = parseInt(mannschaftsdaten[1].content);
        if (typeof mannschaftsdaten[2].a != "undefined"){
        	mannschaft.mannschaft = mannschaftsdaten[2].a.content;
        }else{
        	mannschaft.mannschaft = mannschaftsdaten[2].content;
        }
        
        mannschaft.begegnungen = mannschaftsdaten[3].content;
        mannschaft.siege = mannschaftsdaten[4].content;
        if (typeof mannschaftsdaten[5] != "undefined"){
          mannschaft.unentschieden = mannschaftsdaten[5].content;
        }
        if (typeof mannschaftsdaten[6] != "undefined"){
        mannschaft.niederlagen = mannschaftsdaten[6].content;
        }
        if (typeof mannschaftsdaten[7] != "undefined"){
        mannschaft.tore = mannschaftsdaten[7].content;
        }
        if (typeof mannschaftsdaten[8] != "undefined"){
        mannschaft.verhaeltnis = mannschaftsdaten[8].content;
        }
        if (typeof mannschaftsdaten[9] != "undefined"){
        mannschaft.punkte = mannschaftsdaten[9].content;
        }
        
        mannschaften.push(mannschaft);
      }

      $scope.mannschaften = mannschaften;
      
      
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
        if (typeof spieldaten[7].span.content.length  !== "undefined"){
          nextGame.tore = spieldaten[7].span.content;
        }
        else if (typeof spieldaten[7].span !== "undefined"){
          nextGame.tore = spieldaten[7].span;
        }
        
        nextGames.push(nextGame);
      }
      
      $scope.nextGames = nextGames;
      
    });
  }
	
	$scope.getHallenadresseForHalle = function (hallenlink){
		
		hallenlink = "https://bremerhv-handball.liga.nu" + hallenlink;
		
		adresse = hallenlink.replace(/\//g,'%2F').replace(/\?/g,'%3F').replace(/\=/g,'%3D').replace(/\+/g,'%2B').replace(/\&/g,'%26').replace(/\+/g,'%2B').replace(/\:/g, '%3A');

	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Fbody%2F%2Fdiv%2F%2Fdiv%2F%2Fdiv%2F%2Fdiv%2F%2Fp%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	     
	    
	    $http.get(jsonFeed).success(function (data) {
	      
	      var hallenaddress = data.query.results.p.content;

	      $scope.hallenaddress = hallenaddress;
	    });   
	    
	};
    
}]);

app.controller('SettingsCtrl', ['$scope', '$http', '$filter', 'dataService', function($scope, $http, $filter, dataService){
	
	//Liga-Manager Init-Var
	$scope.initLigaManagerVars = function() {
		$scope.leagues = dataService.leagues;
		$scope.jugenden = $filter('listGroupBy')( $scope.leagues, 'jugend');
		
		$scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		$scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
	}
	
	$scope.ligenplanLink = "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/leaguePage?championship=Bremer+HV+14/15";

	
	
	$scope.getAllLeagues = function(ligenplanLink) {

		ligenplanLink = ligenplanLink.replace('"', '%3A').replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
		
		var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + ligenplanLink + "%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftr%2F%2Ftd%2F%2Ful%2F%2Fli%2F%2Fspan%2F%2Fa%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

		$http.get(jsonFeed).success(function (data) {
			
			var leagues = new Array();

			var daten = data.query.results.a;
		    	for(var i = 1; i < daten.length; i++){
		    		
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
			       
			        leagues.push(league);
		    	}

		    	dataService.leagues = leagues;
		    	$scope.initLigaManagerVars();
		});
	};
	
	
	$scope.findAllLeaguesOfVerein = function (verein){
		
		leagues = $scope.leagues;
		$scope.countTo = leagues.length;
		
		for(var i=0; i<leagues.length; i++){
			checkIfVereinInLeague(leagues[i], verein);
			
		}
	}
	
	checkIfVereinInLeague = function(league, verein) {
		
		adresse = league.linkage;

	    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	    $http.get(jsonFeed).success(function (data) {
	      
	      var mannschaften = new Array();

	      var daten = data.query.results.table[0].tbody.tr;
	      
	      for(i = 1; i < daten.length; i++){
	        var mannschaftsdaten = daten[i].td;
	        var mannschaft = new Object();
	        if (typeof mannschaftsdaten[2].a != "undefined"){
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
				found = true;
			}
			j++;
	      }

	    });
	  }
	
	 
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
	  };
	  
	  $scope.deleteActivLeague = function(league) {
		  league.isActiv = false;
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
	  };
	  
	  $scope.changeSpecialName = function(league, specialName) {
		  league.specialName = specialName
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
            var markAdressToMap = function () {
                geocoder.geocode({ 'address': $scope.address }, 
                function (results, status) 
                  {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    }
                });
            };
            $scope.$watch("address", function () {
                if ($scope.address != undefined) {
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
	}
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
    if(reverse) filtered.reverse();
    return filtered;
  };
});


app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

	$stateProvider
    .state('table', {
      url: '/table',
      templateUrl: '/table.html',
      controller: 'MainCtrl'
    });
	
	$stateProvider
	.state('settings', {
	  url: '/settings',
	  templateUrl: '/settings.html',
	  controller: 'SettingsCtrl'
	});

  $urlRouterProvider.otherwise('table');
}]);