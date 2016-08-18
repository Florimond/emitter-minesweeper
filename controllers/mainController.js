var mainController = function ($scope)
{
	$scope.view = "templates/menu.html";
	$scope.startGame = function(){ $scope.view = "templates/startGame.html";}
};