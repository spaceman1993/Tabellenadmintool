var app = angular.module('mitStuPro', ['ui.router', 'ui.bootstrap']);



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
	console.log('Standard-Auswahl: ' + $scope.teams)
	
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

app.controller("MenuController", ['$scope', '$http', 'teams', function($scope, $http, teams) {

    $scope.items = [
		{"itemId":1, "title":"Herren", "description":"Teams der Herren", 
			"teams":[
				{"name":"Herren", display: "Herren", link: "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176607"},
				{"name":"A-Jugend", display: "A-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176706"},
				{"name":"D-Jugend", display: "D-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176712"},
				{"name":"E-Jugend", display: "E-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176714"}
			]
		},
		{"itemId":2, "title":"Damen", "description":"Teams der Damen", 
			"teams":[
				{"name":"Damen", display: "Damen", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176609"},
				{"name":"A-Jugend", display: "A-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=176740"},
				{"name":"B-Jugend", display: "B-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176709"},
				{"name":"D-Jugend", display: "D-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176713"}
			]
		}
    ];
	
   $scope.isHighlight = function (mannschaft) {
    return {
      highlight: mannschaft.mannschaft === 'HSG Vegesack/Hammersbeck'
    };
  };
  
	$scope.getTableForLeague = function(adresse) {
        // Get data of team and show it in table
		/*
		 Durch das Two-Way-Databinding wird die HTML-Tabelle direkt geändert, wenn sich das Teams-Objekt ändert.
		 Hier wird ein Name übergeben, über den die entsprechende Tabelle geholt wurde.
		 An dieser Stelle muss nun natürlich die Tabelle extern geholt werden.
		*/
    console.log(adresse);
		teams.activeTeams = adresse;
    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"

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
        mannschaft.mannschaft = mannschaftsdaten[2].a.content;
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
        nextGame.zeit = spieldaten[2].content;
        nextGame.halle = spieldaten[3].span.a.content;
        nextGame.nr = spieldaten[4];
        nextGame.heimmannschaft = spieldaten[5].content;
        nextGame.gastmannschaft = spieldaten[6].content;
        if (typeof spieldaten[7].span.content != "undefined"){
          nextGame.tore = spieldaten[7].span.content;
        }
        else if (typeof spieldaten[7].span != "undefined"){
          nextGame.tore = spieldaten[7].span;
        }
        
        nextGames.push(nextGame);
      }
      
      $scope.nextGames = nextGames;
      
    });
  }
    
}]);

app.controller('SettingsCtrl', ['$scope', function($scope){
		
}]);

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