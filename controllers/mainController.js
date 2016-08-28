var mainController = function ($scope, newGameInfo)
{	
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
		newGameInfo.playerId = 0;
		$scope.view = "templates/board.html";
	}

	$scope.connectToGame = function() 
	{
		newGameInfo.playerId = 1;
		$scope.view = "templates/board.html";
	};
	
};