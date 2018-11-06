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
            case "subscribe":
                $scope.who.push(msg.who)
                $scope.$apply()
                break
            case "unsubscribe":
                for( var i = 0; i < $scope.who.length; ++i)
                { 
                    if ( $scope.who[i].id == msg.who.id)
                    {
                        $scope.who.splice(i, 1)
                        break 
                    }
                }
                $scope.$apply()
                break
            default:
                console.log(msg)
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