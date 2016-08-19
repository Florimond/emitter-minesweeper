var gameController = function ($scope, guidGenerator, beachService) {
	$scope.GAME_STATES =
	{
		STOPPED: 0,
		WAITING_SYNC: 1,
		WAITING_MOVE_LOCAL: 2,
		WAITING_MOVE_REMOTE: 3
	}
	$scope.gameState = $scope.GAME_STATES.STOPPED;
	
	
	$scope.messageReceived = function(msg)
	{
		console.log('emitter: received ' + msg.asString() );
				
		var json = JSON.parse(msg.binary);
		
		switch (json.type)
		{
			case "beach":
				if ($scope.gameState == $scope.GAME_STATES.WAITING_SYNC && $scope.thisPlayerId == 1)
				{
					$scope.beach = json.data;
					$scope.gameState = $scope.GAME_STATES.WAITING_MOVE_REMOTE;
					emitter.publish({
						key: emitterKey,
						channel: "minesweeper/" + $scope.gameId + "/1",
						ttl: 1200,
						message: JSON.stringify({type: "ack"})
					});
					$scope.$apply();
					console.log("Beach received");
				}
				break;
			case "ack":
				if ($scope.gameState == $scope.GAME_STATES.WAITING_SYNC && $scope.thisPlayerId == 0)
				{
					$scope.gameState = $scope.GAME_STATES.WAITING_MOVE_LOCAL;
					$scope.$apply();
					console.log("ack received");
				}
				break;
			case "click":
				if ($scope.gameState == $scope.GAME_STATES.WAITING_MOVE_REMOTE)
				{
					$scope.remoteClick(json.data.x, json.data.y);
					$scope.$apply();
				}
				break;
		}
		
	}
	emitter.on('message', $scope.messageReceived);
	
	$scope.playerScore = [0, 0];
	var playerScore = $scope.playerScore;
	var turns = 0;
	
	function classifyBeach (beach)
	{
		for (var i = 0; i < beach.height; ++i)
		{
			for (var j = 0; j < beach.width; ++j)
			{
				var tile = $scope.beach.area[i][j];
				if (tile.neighbouringMines)
				{
					tile.class = "mine mines" + tile.neighbouringMines;
				}
			}
		}
	};


	function discoverTile(x, y)
	{
		var tile = $scope.beach.area[x][y];
		tile.covered = false;
		if (tile.mine)
		{
			var playerNumber = turns % 2;
			++playerScore[playerNumber];
			tile.class = "flag" + playerNumber;
		}
		else
		{
			++turns;
			if (tile.neighbouringMines == 0)
			{
				beachService.explore($scope.beach, x, y);
			}
		}
		
		return tile.mine;
	}
	
	$scope.remoteClick = function(x, y)
	{
		var mineFound = discoverTile(x, y);
		if (!mineFound) $scope.gameState = $scope.GAME_STATES.WAITING_MOVE_LOCAL;
	}
	
	/* TODO
		This function use "local", "gameState", and "turn". Their meanings overlap !
		Find a solution to switch GAME_STATES auto
		+ Specialize this function.
	*/
	$scope.click = function (x, y) {
		var mineFound = discoverTile(x, y);
		if (!mineFound) $scope.gameState = $scope.GAME_STATES.WAITING_MOVE_REMOTE;
	
		emitter.publish({
			key: emitterKey,
			channel: "minesweeper/" + $scope.gameId + "/" + $scope.thisPlayerId,
			ttl: 1200,
			message: JSON.stringify({
				type: 'click',
				data: {
				x: x,
				y: y}
			})
		});
		
	};
	
	$scope.connectToGame = function()
	{
		$scope.gameState = $scope.GAME_STATES.WAITING_SYNC;
		$scope.thisPlayerId = 1;
		emitter.subscribe(
		{
			key: emitterKey,
			channel: "minesweeper/" + $scope.gameId + "/0",
			last: 1
		});
		console.log("Subscribed to channel : minesweeper/" + $scope.gameId + "/0");
	}
	
	$scope.startGame = function()
	{
		$scope.thisPlayerId = 0;
		$scope.gameId = guidGenerator.getGuid();
		$scope.beach = beachService.generateBeach(16, 16, 51);
		classifyBeach($scope.beach);
		
		emitter.subscribe(
		{
			key: emitterKey,
			channel: "minesweeper/" + $scope.gameId + "/1"
		});
		console.log("Subscribed to channel : minesweeper/" + $scope.gameId + "/1");
		
		emitter.publish({
				key: emitterKey,
				channel: "minesweeper/" + $scope.gameId + "/0",
				ttl: 3600,
				message: JSON.stringify(
				{
					type: "beach",
					data: $scope.beach
				})
			});
		
		$scope.gameState = $scope.GAME_STATES.WAITING_SYNC;
	}

	if ($scope.thisPlayerId == 0)
		$scope.startGame();
	else
		$scope.connectToGame();
	
};
