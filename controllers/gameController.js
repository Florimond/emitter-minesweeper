var gameController = function ($scope, guidGenerator, beachService, emitterService, newGameInfo)
{
	function messageReceived(msg)
	{
		console.log('emitter: received ' + msg.type );
	
		switch (msg.type)
		{
			case "init":
				console.log("init");
				if ($scope.game.state == GAME_STATES.WAITING_SYNC && thisPlayer.isMaster == true)
				{
					console.log("init in");
					opponent.name = msg.data.playerName;
					// Unsubscribe from the lobby.
					emitterService.unsubscribe("lobby")
					// Let's send back some greetings with the generated beach.
					emitterService.publish(
						"beach",
						{beach: $scope.game.beach, playerName: thisPlayer.name},
						newGameInfo.gameId + "/0");				
				}
				break;
			case "beach":
				console.log("beach");
				if ($scope.game.state == GAME_STATES.WAITING_SYNC && thisPlayer.isMaster == false)
				{
					console.log("beach in");
					$scope.game.beach = msg.data.beach;
					opponent.name = msg.data.playerName;						
					// Let's indicate to the master that we are ready to start.
					$scope.game.state = GAME_STATES.WAITING_MOVE_REMOTE;
					emitterService.publish("ready", null, newGameInfo.gameId + "/1");
					$scope.$apply();
					console.log("Beach received, ready!");
				}
				break;
			case "ready":
				console.log("ready");
				// The slave has received the beach and indicated that he was ready to start.
				if ($scope.game.state == GAME_STATES.WAITING_SYNC && thisPlayer.isMaster == true)
				{
					console.log("ready in");
					$scope.game.state = GAME_STATES.WAITING_MOVE_LOCAL;
				}
				break;
			/* The opponent sent a "click" message. Did he hit a mine? Let's see... */	
			case "click":
				if ($scope.game.state == GAME_STATES.WAITING_MOVE_REMOTE)
				{
					var mineFound = discoverTile(msg.data.x, msg.data.y, opponent);
					if (!mineFound) $scope.game.state = GAME_STATES.WAITING_MOVE_LOCAL;
					$scope.$apply();
				}
				break;
			/* The opponent moved the mouse cursor over some area, let's keep track of his movements... */
			case "hover":
				if ($scope.game.state == GAME_STATES.WAITING_MOVE_REMOTE)
				{
					setHoverClass(msg.data.x, msg.data.y, opponent);
					$scope.$apply();
				}
				break;
		}
		
	}

	function checkForWinner()
	{
		var delta = Math.abs(thisPlayer.score - opponent.score);
		if (delta > $scope.game.remainingMines)
		{
			if (thisPlayer.score > opponent.score)
			{
				alert("You WIN !");
			}
			else
			{
				alert("You loose.");
			}
		}
	}

	// Called both when a tile was clicked locally and when a click was received from the opponent.
	function discoverTile(x, y, player)
	{
		var tile = $scope.game.beach.area[x][y];
		tile.covered = false;
		if (tile.mine)
		{
			sounds.mineHit.play();
			--$scope.game.remainingMines;
			++player.score;
			tile.class = "flag" + player.id + " expandOpen";
			checkForWinner();
		}
		else
		{
			sounds.miss.play();
			++$scope.game.turns;
			if (tile.neighbouringMines == 0)
			{
				beachService.explore($scope.game.beach, x, y);
			}
		}
		return tile.mine;
	}
		
	// Called by ng-click on every tile.
	$scope.click = function (x, y) 
	{
		if ($scope.game.state != GAME_STATES.WAITING_MOVE_LOCAL) return;
		emitterService.publish("click", {x: x, y: y}, newGameInfo.gameId + "/" + thisPlayer.id);
		var mineFound = discoverTile(x, y, thisPlayer);
		if (!mineFound) $scope.game.state = GAME_STATES.WAITING_MOVE_REMOTE;
	};
	
	/* 
	   Called by ng-class on every tile.
	   This function chooses the classes to apply to a tile depending on whether it has been explored and
	   whether any player is hovering it.
	 */
	$scope.getTileClass = function(x, y)
	{
		if (!$scope.game.beach) return;
		var tile = $scope.game.beach.area[x][y];
		
		if (tile.covered)
			return "btn btn-primary " + tile.hoveringClass;

		return tile.class + " " + tile.hoveringClass;
	};
	
	// Change the tile the player is hovering.
	function setHoverClass(x, y, player)
	{
		var previousHoveringTile = player.hovering;
		player.hovering = {x : x, y : y};
		if (previousHoveringTile) $scope.game.beach.area[previousHoveringTile.x][previousHoveringTile.y].hoveringClass = "";
		
		$scope.game.beach.area[x][y].hoveringClass = "hovering" + player.id;		
	}
	
	// When the mouse is hovering a tile (ng-mouseover)...
	$scope.hovering = function(x, y)
	{
		if ($scope.game.state != GAME_STATES.WAITING_MOVE_LOCAL) return;
		setHoverClass(x, y, thisPlayer);
		emitterService.publish("hover", {x: x, y: y}, newGameInfo.gameId + "/" + thisPlayer.id)
	};
	
	// Choose a css class for every tile.
	function classifyBeach(beach)
	{
		for (var i = 0; i < beach.width; ++i)
		{
			for (var j = 0; j < beach.height; ++j)
			{
				var tile = beach.area[i][j];
				if (tile.neighbouringMines)
				{
					tile.class = "mine mines" + tile.neighbouringMines;
				}
			}
		}
}
	
	// Connect to an existing game
	function connectToGame()
	{
		//newGameInfo.gameId = newGameInfo.gameToConnect;
		$scope.game.state = GAME_STATES.WAITING_SYNC;
		// Subscribe to the opponent's channel.
		emitterService.subscribe(newGameInfo.gameId + "/0", messageReceived);
		console.log(thisPlayer)
		console.log(newGameInfo.gameId + "/1")
		emitterService.publish("init", {playerName: thisPlayer.name}, newGameInfo.gameId + "/1");
	}

	// Initialize a new game
	function startGame(beachWidth, beachHeight, numberOfMines)
	{
		$scope.game.beach = beachService.generateBeach(beachWidth, beachHeight, numberOfMines);	
		classifyBeach($scope.game.beach);
		emitterService.me(function(me){
			newGameInfo.gameId = me.id
			console.log(newGameInfo.gameId + "/1")
			// Subscribe to the opponent's channel.
			emitterService.subscribe(newGameInfo.gameId + "/1", messageReceived);
			// Waiting for an opponent to send a hello message with his name.
			$scope.game.state = GAME_STATES.WAITING_SYNC;
			// Subscribe to show up in the list of games waiting for a second player.
			emitterService.subscribe("lobby", messageReceived)//, function() {})							
		})
	}
	
	/////////////////////////////////////
	// Initializations
	/////////////////////////////////////
	
	// Loading sounds
	var sounds = {
		miss : new Audio("sounds/miss.wav"),
	    mineHit : new Audio("sounds/mineHit.wav")
	};
	
	// Declaring constants
	$scope.GAME_STATES =
	{
		STOPPED: 0,
		WAITING_SYNC: 1,
		WAITING_MOVE_LOCAL: 2,
		WAITING_MOVE_REMOTE: 3
	};
	var GAME_STATES = $scope.GAME_STATES;
	
	// Initializing the game variables
	$scope.game = {
		id: undefined,
		state: GAME_STATES.STOPPED,
		turns: 0,
		remainingMines: 51,
		beach: undefined
	};
	
	// Initializing the players
	// I find it useful to be able to refers the players both through an array and by a meaningful name...
	$scope.players = [
		{id: 0, name: "Player 1", score:0, isMaster: true},
		{id: 1, name: "Player 2", score:0, isMaster: false}
	];
	var thisPlayer = $scope.players[newGameInfo.playerId];
	var opponent = $scope.players[newGameInfo.getOpponentId()];
	thisPlayer.name = newGameInfo.playerNickname;

	if (thisPlayer.isMaster)
		startGame(16, 16, 51);
	else
		connectToGame();
	
};
