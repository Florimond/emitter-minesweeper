var mainController = function ($scope)
{	
	$scope.players = [
	{name: "Player 1",
	score:0},
	{name: "Player 2",
	score:0}
	];
	
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