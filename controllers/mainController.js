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
	$scope.connectToGameMenu = function()
	{ 
		$scope.view = "templates/connectToGameMenu.html";
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
	}

	$scope.connectToGame = function() 
	{
		if (!emitterConnected) // This shouldn't happen...
		{
			alert("Waiting for emitter to connect. Please try again in a moment...");
			return;
		}
		newGameInfo.playerId = 1;
		$scope.view = "templates/board.html";
	};
	
};