var mainController = function ($scope)
{
	$scope.view = "templates/menu.html";
	$scope.startGameMenu = function()
	{
		$scope.playerId = 0;
		$scope.view = "templates/startGameMenu.html";
	}
	$scope.connectToGameMenu = function()
	{ 
		$scope.playerId = 1;
		$scope.view = "templates/connectToGameMenu.html";
	}
	$scope.startGame = function(){$scope.view = "templates/board.html";}
};