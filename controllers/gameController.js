	var gameController = function ($scope, guidGenerator) {
		$scope.gameId = "a";//getGuid();
		$scope.thisPlayerId = 0;
		
		
		var GAME_STATES =
		{
			STOPPED: 0,
			WAITING_SYNC: 1,
			WAITING_MOVE_LOCAL: 2,
			WAITING_MOVE_REMOTE: 3
		}
		$scope.gameState = GAME_STATES.STOPPED;
		
		
		$scope.messageReceived = function(msg)
		{
			console.log('emitter: received ' + msg.asString() );
					
			var json = msg.asObject();
			switch (json.type)
			{
				case "beach":
					if ($scope.gameState == GAME_STATES.WAITING_SYNC && $scope.thisPlayerId == 1)
					{
						$scope.beach = json.data;
						$scope.gameState = GAME_STATES.WAITING_MOVE_REMOTE;
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
					if ($scope.gameState == GAME_STATES.WAITING_SYNC && $scope.thisPlayerId == 0)
					{
						$scope.gameState = GAME_STATES.WAITING_MOVE_LOCAL;
						console.log("ack received");
					}
					break;
				case "click":
					if ($scope.gameState == GAME_STATES.WAITING_MOVE_REMOTE)
					{
						$scope.click(json.data.x, json.data.y, false);
						$scope.gameState = GAME_STATES.WAITING_MOVE_LOCAL;
					}
					break;
			}
			
		}
		emitter.on('message', $scope.messageReceived);
		
		$scope.playerScore = [0, 0];
		var playerScore = $scope.playerScore;
		var turns = 0;

		$scope.beach = [];
		
		function initBeach()
		{
			for (var i = 0; i < 16; ++i) {
				$scope.beach[i] = [];
				for (var j = 0; j < 16; ++j) {
					$scope.beach[i][j] = {
						covered: true,
						mine: false,
						neighbouringMines: 0,
						class: ''
					};
				}
			}

			var mines = 51;
			do
			{
				var x = Math.floor(Math.random() * 15);
				var y = Math.floor(Math.random() * 15);

				if ($scope.beach[x][y].mine == false) {
					--mines;
					$scope.beach[x][y].mine = true;
					$scope.beach[x][y].class = "red-flag";
					incNeighbours(x, y);
				}
			}
			while (mines)
		}


		$scope.getClass = function (x, y) {
			var tile = $scope.beach[x][y];
			if (tile.value)
			{
				return "mine mines" + tile.neighbouringMines;
			}
			return "";
		};

		function applyToNeighbours(x, y, f)
		{
			for (var xOffset = -1; xOffset < 2; ++xOffset) {
				var newX = x + xOffset;
				if (newX < 0) continue;
				if (newX > 15) break;
				for (var yOffset = -1; yOffset < 2; ++yOffset) {
					var newY = y + yOffset;
					if (newY < 0) continue;
					if (newY > 15) break;

					f(newX, newY);
				}
			}
		}

		function incNeighbours(x, y)
		{
			applyToNeighbours(x, y, function (x, y) {
				++$scope.beach[x][y].neighbouringMines;
			});
		}

		function explore(x, y)
		{
			applyToNeighbours(x, y, function (x, y) {
				var tile = $scope.beach[x][y];
				if (tile.covered && !tile.mine) {
					tile.covered = false;
					if (tile.neighbouringMines == 0) explore(x, y);
				}
			});
		}

		$scope.click = function (x, y, local=true) {
			if (local)
			{
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
				$scope.gameState = GAME_STATES.WAITING_MOVE_REMOTE;

			}				
			
			var tile = $scope.beach[x][y];
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
					explore(x, y);
				}
				else
				{
					tile.class = "mine mines" + tile.neighbouringMines;
				}
			}
			$scope.$apply();
		};
		
		$scope.connectToGame = function()
		{
			$scope.gameState = GAME_STATES.WAITING_SYNC;
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
			initBeach();
			
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
			
			$scope.gameState = GAME_STATES.WAITING_SYNC;
		}

		if ($scope.playerId == 0)
			$scope.startGame();
		
	};
