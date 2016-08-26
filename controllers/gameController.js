var gameController = function ($scope, guidGenerator, beachService, emitterService) {

	$scope.messageReceived = function(msg)
	{
		console.log('emitter: received ' + msg.type );
		
		switch (msg.type)
		{
			case "hello":
				if ($scope.gameState == $scope.GAME_STATES.WAITING_SYNC && $scope.thisPlayerId == 1)
				{
					$scope.beach = msg.data.beach;
					$scope.players[0].name = msg.data.playerName;
					$scope.gameState = $scope.GAME_STATES.WAITING_MOVE_REMOTE;
					emitterService.publish("ack", {	playerName: $scope.players[1].name}, $scope.gameId + "/1");
					$scope.$apply();
					console.log("Beach received");
				}
				break;
			case "ack":
				if ($scope.gameState == $scope.GAME_STATES.WAITING_SYNC && $scope.thisPlayerId == 0)
				{
					$scope.players[1].name = msg.data.playerName;
					$scope.gameState = $scope.GAME_STATES.WAITING_MOVE_LOCAL;
					$scope.$apply();
					console.log("ack received");
				}
				break;
			case "click":
				if ($scope.gameState == $scope.GAME_STATES.WAITING_MOVE_REMOTE)
				{
					$scope.remoteClick(msg.data.x, msg.data.y);
					$scope.$apply();
				}
				break;
		}
		
	}
	
	$scope.turns = 0;

	function checkForWinner()
	{
		var delta = Math.abs($scope.players[0].score - $scope.players[1].score);
		if (delta > $scope.remainingMines)
		{
			if ($scope.players[$scope.thisPlayerId].score > $scope.players[$scope.opponentId].score)
			{
				alert("You WIN !");
			}
			else
			{
				alert("You loose.");
			}
		}
	}

	function discoverTile(x, y)
	{
		var tile = $scope.beach.area[x][y];
		tile.covered = false;
		if (tile.mine)
		{
			//if (mineHit.ended == false)
				
			//mineHit.fastSeek(0);
			//else
				mineHit.play();
			--$scope.remainingMines;
			var playerNumber = $scope.turns % 2;
			++$scope.players[playerNumber].score;
			tile.class = "flag" + playerNumber + " expandOpen";
			
			checkForWinner();
		}
		else
		{
			mySound.play();
			++$scope.turns;
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
	
	$scope.click = function (x, y) {
		var mineFound = discoverTile(x, y);
		if (!mineFound) $scope.gameState = $scope.GAME_STATES.WAITING_MOVE_REMOTE;
	
		emitterService.publish("click", {x: x, y: y}, $scope.gameId + "/" + $scope.thisPlayerId);	
	};
	
	$scope.connectToGame = function()
	{
		$scope.gameState = $scope.GAME_STATES.WAITING_SYNC;
		$scope.thisPlayerId = 1;
		emitterService.subscribe($scope.gameId + "/0", $scope.messageReceived, 1);
		console.log("Subscribed to channel : minesweeper/" + $scope.gameId + "/0");
	}
	
	function classifyBeach()
	{
		for (var i = 0; i < $scope.beach.width; ++i)
		{
			for (var j = 0; j < $scope.beach.height; ++j)
			{
				var tile = $scope.beach.area[i][j];
				if (tile.neighbouringMines)
				{
					tile.class = "mine mines" + tile.neighbouringMines;
				}
			}
		}
	};
	
	$scope.startGame = function()
	{
		$scope.thisPlayerId = 0;
		$scope.gameId = guidGenerator.getGuid();
		$scope.beach = beachService.generateBeach(16, 16, 51);
		classifyBeach();
		
		
		emitterService.subscribe($scope.gameId + "/1", $scope.messageReceived);
		console.log("Subscribed to channel : minesweeper/" + $scope.gameId + "/1");
		
		emitterService.publish("hello",
								{beach: $scope.beach, playerName: $scope.players[0].name},
								$scope.gameId + "/0");
		
		$scope.gameState = $scope.GAME_STATES.WAITING_SYNC;
	}


	var mySound = new Audio("sounds/73560__stanestane__blip.wav");
	var mineHit = new Audio("sounds/320905__suzenako__the-ding.wav");
	$scope.GAME_STATES =
	{
		STOPPED: 0,
		WAITING_SYNC: 1,
		WAITING_MOVE_LOCAL: 2,
		WAITING_MOVE_REMOTE: 3
	};
	$scope.remainingMines = 51;
	$scope.gameState = $scope.GAME_STATES.STOPPED;
	$scope.opponentId = ($scope.thisPlayerId + 1) % 2;
	
	if ($scope.thisPlayerId == 0)
		$scope.startGame();
	else
		$scope.connectToGame();
	
};
