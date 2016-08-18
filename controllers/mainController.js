var mainController = function ($scope)
{
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
		$scope.thisPlayerId = 0;
		$scope.view = "templates/board.html";
	}

	$scope.connectToGame = function() 
	{
		$scope.thisPlayerId = 1;
		$scope.view = "templates/board.html";
	};
};