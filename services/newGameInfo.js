var newGameInfo = function ()
{
    return	{
		playerGUID: guidGenerator.getGuid(),
		playerId: 0,
		getOpponentId: function() { return (this.playerId + 1) % 2 },
		playerNickname: "Player",
		gameToConnect: ""	
    };
};
