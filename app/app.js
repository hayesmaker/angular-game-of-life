/**
 * Created by hayesmaker on 12/11/2014.
 */

var app = angular.module('AngularGameOfLife', []);

app.controller('GameController', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {
  $scope.title = "Conway's Game of Life in Angular";

  $scope.numCols = 80;
  $scope.numRows = 40;
  $scope.generation = 0;
  $scope.running = false;
  $scope.model;
  $scope.randomSeed = true;
  $scope.edgesBreedMore = true;
  $scope.currentEl;

  $scope.init = function() {
    var i, j;
    $scope.stop();
    $scope.generation = 0;
    $scope.cols = [];
    $scope.rows = [];
    $scope.model = [];
    for (i = 0; i < $scope.numCols; i++) {
      $scope.cols.push({});
    }

    for (i = 0; i < $scope.numRows; i++) {
      $scope.rows.push({});
    }

    for (i = 0; i < $scope.numRows; i++) {
      $scope.model.push([]);
      for (j = 0; j < $scope.numCols; j++) {
        $scope.model[i].push({
          change: false,
          alive: $scope.randomSeed ? Math.random() < 0.5 : false,
          $cell: $()
        });
      };
    }

    $timeout(function() {
      $scope.mapElsToModel();
      $scope.renderGrid();
    }, 0);

  };

  $scope.mapWidth = function() {
    return {'width': $scope.numCols * 9 + "px" };
  };

  $scope.newGame = function() {
    $scope.init();
  };

  $scope.reset = function() {
    $scope.numCols = 80;
    $scope.numRows = 40;
    $scope.newGame();
  };

  $scope.onGameMouseDown = function(event) {
    $scope.stop();
    $scope.mouseIsDown = true;
  };

  $scope.onGameMouseUp = function(event) {
    $scope.solve();
    $scope.mouseIsDown = false;
  };

  $scope.onGameMouseMove = function(event) {
    var el;
    var $el = $(event.target);
    var $parent = $el.parent();
    var colIndex = $el.index();
    var rowIndex = $parent.index();
    if ($scope.mouseIsDown) {
      el = angular.element(event.target);
      //console.log('onGameMouseDown :: ', el);
      if (event.target !== $scope.currentEl) {
        if (el.hasClass('alive')) {
          el.removeClass('alive');
          $scope.model[rowIndex][colIndex].alive = false;
        } else {
          el.addClass('alive');
          $scope.model[rowIndex][colIndex].alive = true;
        }
        $scope.currentEl = event.target;
      }
    }
  };

  $scope.solve = function() {
    $scope.running = true;
  };

  $scope.stop = function() {
    $scope.running = false;
  };

  $scope.clear = function() {
    $scope.stop();
  };

  $scope.gameTick = function() {
    var i, j, numNeighboursAlive;
    var rowLen = $scope.model.length, colLen;
    for (i = 0; i < rowLen; i++) {
      var col = $scope.model[i];
      var colLen = col.length;
      for (j = 0; j < colLen; j++) {
        var cell = col[j];
        numNeighboursAlive = 0;

        if ($scope.edgesBreedMore) {
          if (i == 0 || j == 0 || i == rowLen - 1 || j == colLen - 1) {
            numNeighboursAlive++;
          }
        }
        //neighbour above
        if (i != 0 && $scope.model[i - 1][j].alive) {
          numNeighboursAlive++;
        }

        //neighbour above left
        if (i != 0 && j != 0 && $scope.model[i-1][j-1].alive) {
          numNeighboursAlive++;
        }

        //neighbour above right
        if (i != 0 && j < colLen - 1 && $scope.model[i-1][j+1].alive) {
          numNeighboursAlive++;
        }

        //neigbour below
        if (i < rowLen - 1 && $scope.model[i + 1][j].alive) {
          numNeighboursAlive++;
        }

        //neigbour below left
        if (i < rowLen - 1 && j != 0 && $scope.model[i + 1][j - 1].alive) {
          numNeighboursAlive++;
        }

        //neighbour below right
        if (i < rowLen - 1 && j < colLen - 1 && $scope.model[i + 1][j + 1].alive) {
          numNeighboursAlive++;
        }

        //neigbour left
        if (j != 0 && $scope.model[i][j - 1].alive) {
          numNeighboursAlive++;
        }

        //neigbour right
        if (j < colLen - 1 && $scope.model[i][j + 1].alive) {
          numNeighboursAlive++;
        }

        var shouldLive =  $scope.shouldLive(cell.alive, numNeighboursAlive);

        if (cell.alive && shouldLive) {
          continue;
        } else if (!cell.alive && !shouldLive) {
          continue
        } else {
          cell.dirty = true;
        }
      }
    }
    $scope.renderGrid();
    $scope.generation++;
  };

  $scope.renderGrid = function() {
    var i, j;
    for (i = 0; i < $scope.model.length; i++) {
      for (j = 0; j < $scope.model[i].length; j++) {
        var cell = $scope.model[i][j];
        if (cell.dirty) {
          cell.alive = !cell.alive;
          cell.dirty = false;
        }
        if (cell.alive) {
          cell.$cell.addClass('alive');
        } else {
          cell.$cell.removeClass('alive');
        }
      }
    }
  };

  $scope.shouldLive = function(isLive, numNeighbours) {
    if (isLive) {
      if (numNeighbours < 2) {
        return false;
      } else if (numNeighbours <=3) {
        return true;
      } else {
        return false;
      }
    } else {
      if (numNeighbours === 3) {
        return true;
      } else {
        return false;
      }
    }
  };

  $scope.mapElsToModel = function() {
    var $maze = $('.gameArea');
    var $rows = $maze.children();
    var i, j;
    for (i = 0; i < $rows.length; i++) {
      var $col = $($rows[i]).children();
      for (j = 0; j < $col.length; j++) {
        $scope.model[i][j].$cell = $($col[j]);
      }
    }
  };

  var simpleGameLoop = $interval(function() {
    if (!$scope.running) return;
    else {
      $scope.gameTick();
    }
  }, 10);

  $scope.init();


}]);

