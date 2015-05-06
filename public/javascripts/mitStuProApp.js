var app = angular.module('mitStuPro', ['ui.router', 'ui.bootstrap', 'colorpicker.module']);



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

app.controller("TableController", ['$scope', '$http', 'teams', function($scope, $http, teams) {

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
				{"name":"Damen", display: "Damen", link: "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=196510"},
				{"name":"A-Jugend", display: "A-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=176740"},
				{"name":"B-Jugend", display: "B-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176709"},
				{"name":"D-Jugend", display: "D-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176713"}
			]
		}
    ];
    
    $scope.items2 = [
		{"itemId":1, "title":"Herren2", "description":"Teams der Herren2", 
			"teams":[
				{"name":"Herren2", display: "Herren2", link: "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176607"},
				{"name":"A-Jugend2", display: "A-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176706"},
				{"name":"D-Jugend", display: "D-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176712"},
				{"name":"E-Jugend", display: "E-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176714"}
			]
		},
		{"itemId":2, "title":"Damen", "description":"Teams der Damen", 
			"teams":[
				{"name":"Damen", display: "Damen", link: "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=196510"},
				{"name":"A-Jugend", display: "A-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Cuxhaven+2014%2F15&group=176740"},
				{"name":"B-Jugend", display: "B-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176709"},
				{"name":"D-Jugend", display: "D-Jugend", link: "http://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=Bremer+HV+14%2F15&group=176713"}
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
    	
    	if(input == 'Herren'){
    		return 'btn-primary';
    	}
    	else if(input == 'Damen'){
    		return 'btn-danger';
    	}
    	
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
        nextGame.zeit = spieldaten[2].content.substr(35, 5);
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

app.controller('SettingsCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
	  $scope.getAllLeagues = function() {
		  var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22https%3A%2F%2Fbremerhv-handball.liga.nu%2Fcgi-bin%2FWebObjects%2FnuLigaHBDE.woa%2Fwa%2FleaguePage%3Fchampionship%3DBremer%2BHV%2B14%2F15%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftr%2F%2Ftd%2F%2Ful%2F%2Fli%2F%2Fspan%2F%2Fa%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		  // Actually fetch the data
		    $http.get(jsonFeed).success(function (data) {
		      // Define the unique market cities
		      
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
		        league.linkage = "https://bremerhv-handball.liga.nu" + leagueData.href;
		        league.isActiv = false;
		       
		        leagues.push(league);
		      }

		      $scope.leagues = leagues;
		      
		      $scope.listGroupBy( leagues, 'jugend');
		    });
	  };
	  
	  $scope.changeActiv = function(league) {
		  if(league.isActiv){
			  league.isActiv = false;
		  }
		  else{
			  league.isActiv = true;
		  }
	  };
	 

      // I group the friends list on the given property.
      $scope.listGroupBy = function( list, attribute ) {

          // First, reset the groups.
          $scope.groups = [];

          // Now, sort the collection of friend on the
          // grouping-property. This just makes it easier
          // to split the collection.
          //$filter('orderObjectBy')( $scope.leagues, attribute );

          // I determine which group we are currently in.
          var groupValue = "_INVALID_GROUP_VALUE_";

          // As we loop over each friend, add it to the
          // current group - we'll create a NEW group every
          // time we come across a new attribute value.
          for ( var i = 0 ; i < list.length ; i++ ) {

              var data = list[ i ];

              // Should we create a new group?
              if ( data[ attribute ] !== groupValue ) {

                  var group = {
                      label: data[ attribute ],
                      list: []
                  };

                  groupValue = group.label;

                  $scope.groups.push( group );

              }

  
              group.list.push( data );

          }

      };
      
      // I am the grouped collection. Each one of these
      // will contain a sub-collection of friends.
      $scope.groups = [];
	  
	  
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