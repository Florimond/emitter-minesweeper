var mainController = function ($scope, newGameInfo, emitterService)
{	
	var emitterConnected = false;
	function connectionHandler()
	{
		console.log("emitter connected");
		emitterConnected = true;
	}
	$scope.newGameInfo = newGameInfo;
	$scope.view = "templates/menu.html";
	$scope.startGameMenu = function()
	{
		$scope.view = "templates/startGameMenu.html";		
	};

	$scope.connectToGameMenu = function()
	{ 	
		/*if (!emitterConnected) // This shouldn't happen...
		{
			alert("Waiting for emitter to connect. Please try again in a moment...");
			return;
		}*/
		console.log("connectToGameMenu")

		emitterService.connect(function(){
			$scope.view = "templates/connectToGameMenu.html";
		})
	}
	$scope.startGame = function()
	{
		console.log( newGameInfo.playerNickname)
		emitterService.connect({secure: false, username: newGameInfo.playerNickname},function(){
			$scope.view = "templates/board.html";
			newGameInfo.playerId = 0;
			// Subscribe to show up in the list of games waiting for a second player.
			emitterService.subscribe("lobby", function() {})			
		})
	}


	$scope.connectToGame = function() 
	{
		emitterService.connect(function(){
			$scope.view = "templates/board.html";
			newGameInfo.playerId = 1;
		})
	}
	
};