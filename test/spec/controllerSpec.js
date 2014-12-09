describe('Angular Game of Life controllers', function() {


  describe('GameController', function(){
    var scope;

    // Load our app module definition before each test.
    beforeEach(module('AngularGameOfLife'));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service in order to avoid a name conflict.
    beforeEach(inject(function($rootScope, $controller, $timeout) {
      scope = $rootScope.$new();
      ctrl = $controller('GameController', {$scope: scope});
      $timeout.flush();
    }));

    /**
     * The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells,
     * each of which is in one of two possible states, alive or dead. Every cell interacts with its eight neighbours,
     * which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

          1.  Any live cell with fewer than two live neighbours dies, as if caused by under-population.
          2.  Any live cell with two or three live neighbours lives on to the next generation.
          3.  Any live cell with more than three live neighbours dies, as if by overcrowding.
          4.  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

     The initial pattern constitutes the seed of the system. The first generation is created by
     applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously,
     and the discrete moment at which this happens is sometimes called a tick (in other words, each generation
     is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations.
     */

    describe("If a live cell has fewer than 2 live neighbours it dies", function() {
      it("should live function should return false if 1", function() {
        expect(scope.shouldLive(true, 1)).toEqual(false);
      });

      it("should live function should return false if 0", function() {
        expect(scope.shouldLive(true, 0)).toEqual(false);
      });

    });




    describe("If a live cell has 2 or 3 live neighbours then the cell should live on", function() {

      it("should live function should return true if 2 neighbours are alive", function() {
        expect(scope.shouldLive(true, 2)).toEqual(true);
      });

      it("should live function should return true if 3 neighbours are alive", function() {
        expect(scope.shouldLive(true ,3)).toEqual(true);
      });

    });

    describe("Any live cell with more than 3 live neighbours dies", function() {

      it("should live function should return false if 4 neighbours are alive", function() {
        expect(scope.shouldLive(true, 4)).toEqual(false);
      });

    });

    describe("Any dead cell with exactly 3 live neighbours becomes a live", function() {
      it("should live function should return true if it is dead and has 3 live neighbours", function() {
        expect(scope.shouldLive(false, 3)).toEqual(true);
      });

    });




  });
});