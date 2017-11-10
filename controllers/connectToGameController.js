var connectToGameController = function ($scope, newGameInfo, emitterService)
{
    function presenceReceived(msg)
	{
		console.log('emitter: presence received ' + msg.event )
	
		switch (msg.event)
		{
			case "status":
				console.log("status")
                console.log(msg.who)
                break
        }
	}
	console.log("connectToGameController")
    emitterService.presence("lobby", presenceReceived)
}