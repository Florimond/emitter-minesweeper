var mainController = function ($scope, $location, newGameInfo, emitterService)
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

		emitterService.connect(newGameInfo.playerNickname, connectionHandler, function(){
			console.log("callback")
			$scope.view = "templates/connectToGameMenu.html";
			$scope.$apply()
		})
	}
	$scope.startGame = function()
	{
		console.log( newGameInfo.playerNickname)
		emitterService.connect(newGameInfo.playerNickname, connectionHandler,function(){
			console.log("callback")
			$scope.view = "templates/board.html";
			newGameInfo.playerId = 0;
			$scope.$apply()		
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