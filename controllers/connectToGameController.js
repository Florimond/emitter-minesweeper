var connectToGameController = function ($scope, newGameInfo, emitterService)
{
    $scope.who = []
    function presenceReceived(msg)
	{
		console.log('emitter: presence received ' + msg.event )
	
		switch (msg.event)
		{
			case "status":
				console.log("status")
                console.log(msg.who)
                $scope.who = msg.who
                $scope.$apply()
                break
        }
    }

    $scope.connectToGame = function(whoId)
    {
            
        console.log("Game selected " + whoId)
        newGameInfo.gameId = whoId
        newGameInfo.playerId = 1
        $scope.$parent.$parent.view = "templates/board.html"
        console.log("lmklmkjmklj")
        //$scope.$parent.$parent.$apply()
    }

    $scope.backToMain = function()
    {
        $scope.$parent.$parent.view = "templates/menu.html"
    }

	console.log("connectToGameController")
    emitterService.presence("lobby", presenceReceived)
}