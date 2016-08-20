angular.module("minesweeper", ["guidGenerator"])
.factory("beachService", beachService)
.value("emitterKey", "Ue3lrRHQiAN42qyEOvS5zpcD8I-0WAS0")
.value("baseChannel", "minesweeper")
.factory("emitterService", ["emitterKey", "baseChannel", emitterService])
.controller("gameController", gameController)
.controller("mainController", mainController);