"use strict";

(function () {

  // Canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var box = 32; // Box grid in px - 21x18 boxes on the map
  var cc = void 0; //Current chest
  var n = 0; //Level 1


  // Images & sources
  var pirate = new Image();
  pirate.src = 'images/pirate.png';
  var chest = new Image(32, 32);
  chest.src = 'images/chest.png';
  var palm = new Image(32, 32);
  palm.src = 'images/palm-tree.png';
  var spot = new Image(32, 32);
  spot.src = 'images/spot.png';
  var dig = new Image();
  dig.src = 'images/dig.png';
  var island = new Image();
  island.src = 'images/island.png';

  // GAME LEVELS
  var level = {
    // Character and terrain coordinates
    piratePos: { x: 12, y: 12 },
    chestPos: [{ x: 12, y: 10 }, { x: 12, y: 11 }],
    palmPos: [{ x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 11, y: 9 }, { x: 12, y: 9 }, { x: 13, y: 9 }, { x: 14, y: 9 }, { x: 6, y: 10 }, { x: 14, y: 10 }, { x: 6, y: 11 }, { x: 8, y: 11 }, { x: 11, y: 11 }, { x: 14, y: 11 }, { x: 6, y: 12 }, { x: 11, y: 12 }, { x: 14, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 }, { x: 14, y: 13 }],
    spotPos: [{ x: 8, y: 12 }, { x: 10, y: 12 }]
  };

  var GAME = function GAME(lvl) {
    var curr_game = {
      pirate: lvl.piratePos,
      chests: lvl.chestPos,
      palms: lvl.palmPos,
      spots: lvl.spotPos,

      //Drawing images to canvas
      draw: function draw() {
        //Drawing static island image
        ctx.drawImage(island, 0, 0, island.width, island.height);

        //Drawing palms as the level's bounds
        for (var i = 0; i < curr_game.palms.length; i++) {
          ctx.drawImage(palm, curr_game.palms[i].x * box, curr_game.palms[i].y * box);
        }

        //Drawing X spots
        for (var j = 0; j < curr_game.spots.length; j++) {
          ctx.drawImage(spot, curr_game.spots[j].x * box, curr_game.spots[j].y * box);
        }
        //Drawing chests
        for (var k = 0; k < curr_game.chests.length; k++) {
          ctx.drawImage(chest, curr_game.chests[k].x * box, curr_game.chests[k].y * box);
        }

        for (var _i = 0; _i < curr_game.chests.length; _i++) {
          for (var _j = 0; _j < curr_game.spots.length; _j++) {
            if (curr_game.chests[_i].x === curr_game.spots[_j].x && curr_game.chests[_i].y === curr_game.spots[_j].y) {
              ctx.drawImage(dig, curr_game.spots[_j].x * box, curr_game.spots[_j].y * box);
            }
          }
        }

        //Drawing pirate character, slicing from sprite
        ctx.drawImage(pirate, 0, 0, 32, 32, curr_game.pirate.x * box, curr_game.pirate.y * box, 32, 32);

        requestAnimationFrame(curr_game.draw);
      },

      lvldone: function lvldone() {
        var dig = true;
        for (var i = 0; i < curr_game.chests.length; i++) {
          var digg = false;
          for (var j = 0; j < curr_game.spots.length; j++) {
            if (curr_game.chests[i].x === curr_game.spots[j].x && curr_game.chests[i].y === curr_game.spots[j].y) {
              digg = true;
            }
          }
          dig = dig && digg;
        }
        if (dig) {
          //ctx.drawImage(island, 0, 0, island.width, island.height);
          canvas.style.display = "none";
          document.getElementById("won").style.visibility = "visible";
        }
      },

      moving: function moving() {

        //A helper function to determine if something is in the way
        function collision(arr1, arr2, offsetx, offsety) {
          for (var i = 0; i < arr2.length; i++) {
            if (arr1.x + offsetx === arr2[i].x && arr1.y + offsety === arr2[i].y) {
              return { val: true, p: i };
            }
          }
          return { val: false, p: null };
        }

        function moveLeft() {
          cc = collision(curr_game.pirate, curr_game.chests, -1, 0);

          if (collision(curr_game.pirate, curr_game.palms, -1, 0).val === false) {
            if (collision(curr_game.pirate, curr_game.chests, -1, 0).val === true) {
              if (collision(curr_game.chests[cc.p], curr_game.palms, -1, 0).val === false) {
                if (collision(curr_game.chests[cc.p], curr_game.chests, -1, 0).val === false) {

                  curr_game.chests[cc.p].x--;
                  curr_game.pirate.x--;
                  curr_game.draw();
                }
              }
            } else {
              curr_game.pirate.x--;
              curr_game.draw();
            }
          }
        }

        function moveRight() {
          cc = collision(curr_game.pirate, curr_game.chests, 1, 0);

          if (collision(curr_game.pirate, curr_game.palms, 1, 0).val === false) {
            if (collision(curr_game.pirate, curr_game.chests, 1, 0).val === true) {
              if (collision(curr_game.chests[cc.p], curr_game.palms, 1, 0).val === false) {
                if (collision(curr_game.chests[cc.p], curr_game.chests, 1, 0).val === false) {

                  curr_game.pirate.x++;
                  curr_game.chests[cc.p].x++;
                  curr_game.draw();
                }
              }
            } else {
              curr_game.pirate.x++;
              curr_game.draw();
            }
          }
        }

        function moveUp() {
          cc = collision(curr_game.pirate, curr_game.chests, 0, -1);

          if (collision(curr_game.pirate, curr_game.palms, 0, -1).val === false) {
            if (collision(curr_game.pirate, curr_game.chests, 0, -1).val === true) {
              if (collision(curr_game.chests[cc.p], curr_game.palms, 0, -1).val === false) {
                if (collision(curr_game.chests[cc.p], curr_game.chests, 0, -1).val === false) {
                  curr_game.pirate.y--;
                  curr_game.chests[cc.p].y--;
                  curr_game.draw();
                }
              }
            } else {
              curr_game.pirate.y--;
              curr_game.draw();
            }
          }
        }

        function moveDown() {
          cc = collision(curr_game.pirate, curr_game.chests, 0, 1);

          if (collision(curr_game.pirate, curr_game.palms, 0, 1).val === false) {
            if (collision(curr_game.pirate, curr_game.chests, 0, 1).val === true) {
              if (collision(curr_game.chests[cc.p], curr_game.palms, 0, 1).val === false) {
                if (collision(curr_game.chests[cc.p], curr_game.chests, 0, 1).val === false) {

                  curr_game.chests[cc.p].y++;
                  curr_game.pirate.y++;
                  curr_game.draw();
                }
              }
            } else {
              curr_game.pirate.y++;
              curr_game.draw();
            }
          }
        }

        document.addEventListener('keydown', function (event) {
          if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();

            if (event.keyCode === 37) {
              moveLeft();
            } else if (event.keyCode === 38) {
              moveUp();
            } else if (event.keyCode === 39) {
              moveRight();
            } else if (event.keyCode === 40) {
              moveDown();
            }
          }

          curr_game.lvldone();
        });
      } // end of moving obj

      //end of let curr_game

    };curr_game.draw();
    curr_game.moving();
  }; //end of GAME


  GAME(level);
})(); //The very END
//# sourceMappingURL=main.js.map
