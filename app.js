angular.module("minesweeper", [])
.factory("beachService", beachService)
.factory("guidGenerator", guidGenerator)
.factory("newGameInfo", newGameInfo)
.value("emitterKey", "OxUdD51NKrqLqBqbFnY2xflP7xWrMJH-")
.value("baseChannel", "minesweeper")
.factory("emitterService", ["emitterKey", "baseChannel", emitterService])
.controller("gameController", gameController)
.controller("mainController", mainController);