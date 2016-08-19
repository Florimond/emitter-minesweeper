angular.module("minesweeper", ["guidGenerator"])
.controller("gameController", gameController)
.controller("mainController", mainController)
.factory("beachService", beachService);