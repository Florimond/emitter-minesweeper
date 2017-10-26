var mainController = function ($scope, newGameInfo, emitterService)
{	
	var emitterConnected = false;
	function connectionHandler()
	{
		console.log("emitter connected");
		emitterConnected = true;
	}
	emitterService.connect(connectionHandler);
	$scope.newGameInfo = newGameInfo;
	$scope.view = "templates/menu.html";
	$scope.startGameMenu = function()
	{
		$scope.view = "templates/startGameMenu.html";		
	};

	// Todo: lobby controller
	function presenceHandler(msg)
	{
		console.log(msg);
	}
	$scope.connectToGameMenu = function()
	{ 	
		if (!emitterConnected) // This shouldn't happen...
		{
			alert("Waiting for emitter to connect. Please try again in a moment...");
			return;
		}
		console.log("connectToGameMenu")
		$scope.view = "templates/connectToGameMenu.html";
		emitterService.presence("lobby")
		
	};
	$scope.startGame = function()
	{
		if (!emitterConnected) // This shouldn't happen...
		{
			alert("Waiting for emitter to connect. Please try again in a moment...");
			return;
		}
		newGameInfo.playerId = 0;
		$scope.view = "templates/board.html";

		// Subscribe to show up in the list of games waiting for a second player.
		emitterService.subscribe("lobby", function() {})
	}


	$scope.connectToGame = function() 
	{
		if (!emitterConnected)
		{
			alert("Waiting for emitter to connect. Please try again in a moment...");
			return;
		}

		$scope.view = "templates/board.html";

		newGameInfo.playerId = 1;
	};
	
};