var beachService = function ()
{
	function applyToNeighbours(beach, x, y, f)
	{
		for (var xOffset = -1; xOffset < 2; ++xOffset) {
			var newX = x + xOffset;
			if (newX < 0) continue;
			if (newX >= beach.width) break;
			for (var yOffset = -1; yOffset < 2; ++yOffset) {
				var newY = y + yOffset;
				if (newY < 0) continue;
				if (newY >= beach.height) break;

				f(newX, newY);
			}
		}
	}
	
	function incNeighbours(beach, x, y)
	{
		applyToNeighbours(beach, x, y, function (x, y) {
			++beach.area[x][y].neighbouringMines;
		});
	}
	
    return	{
        generateBeach: function (width, height, mines)	{
			var beach = {
				height: height,
				width: width,
				mines: mines,
				area: []
			};
			for (var i = 0; i < width; ++i)
			{
				beach.area[i] = [];
				for (var j = 0; j < height; ++j)
				{
					beach.area[i][j] = {
						covered: false,
						mine: false,
						neighbouringMines: 0,
					};
				}
			}

			var minesToDrop = mines;
			do
			{
				var x = Math.floor(Math.random() * (width-1));
				var y = Math.floor(Math.random() * (height-1));

				if (beach.area[x][y].mine == false) {
					--minesToDrop;
					beach.area[x][y].mine = true;
					incNeighbours(beach, x, y);
				}
			}
			while (minesToDrop);
			
			return beach;
		},

		explore: function explore(beach, x, y){
			applyToNeighbours(beach, x, y, function (x, y) {
				var tile = beach.area[x][y];
				if (tile.covered && !tile.mine) {
					tile.covered = false;
					if (tile.neighbouringMines == 0) explore(beach, x, y);
				}
			});
		}

			
    };
};
