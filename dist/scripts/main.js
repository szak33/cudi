'use strict';

(function () {
  // Preparing Canvas
  var CANVAS = document.getElementById('canvas');
  var CTX = CANVAS.getContext('2d');

  var box = 32; // Box grid in px - 21x18 boxes on the map
  var cc = void 0; //Current chest
  var n = 0; // counter for levels
  var lvldone = false; //Current game


  // Images & their sources
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
  var level1 = {
    // Character and terrain coordinates
    pirate: { x: 12, y: 12 },
    chests: [{ x: 12, y: 10 }, { x: 12, y: 11 }],
    palms: [{ x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 11, y: 9 }, { x: 12, y: 9 }, { x: 13, y: 9 }, { x: 14, y: 9 }, { x: 6, y: 10 }, { x: 14, y: 10 }, { x: 6, y: 11 }, { x: 8, y: 11 }, { x: 11, y: 11 }, { x: 14, y: 11 }, { x: 6, y: 12 }, { x: 11, y: 12 }, { x: 14, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 }, { x: 14, y: 13 }],
    spots: [{ x: 8, y: 12 }, { x: 10, y: 12 }]
  };

  var level2 = {
    pirate: { x: 7, y: 7 },
    chests: [{ x: 8, y: 9 }, { x: 8, y: 10 }, { x: 9, y: 10 }],
    palms: [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 8, y: 15 }, { x: 9, y: 15 }, { x: 10, y: 15 }, { x: 11, y: 15 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 12, y: 13 }, { x: 13, y: 13 }, { x: 14, y: 13 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 12, y: 8 }, { x: 13, y: 8 }, { x: 14, y: 9 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }],
    spots: [{ x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }]
  };

  var level3 = {
    // Character and terrain coordinates
    pirate: { x: 11, y: 11 },
    chests: [{ x: 10, y: 10 }, { x: 12, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 12 }],
    palms: [{ x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 }, { x: 9, y: 8 }, { x: 11, y: 8 }, { x: 9, y: 9 }, { x: 11, y: 9 }, { x: 12, y: 9 }, { x: 13, y: 9 }, { x: 14, y: 9 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 14, y: 10 }, { x: 7, y: 11 }, { x: 12, y: 11 }, { x: 13, y: 11 }, { x: 14, y: 11 }, { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 }, { x: 10, y: 12 }, { x: 12, y: 12 }, { x: 10, y: 14 }, { x: 10, y: 13 }, { x: 12, y: 13 }, { x: 11, y: 14 }, { x: 12, y: 14 }],
    spots: [{ x: 10, y: 8 }, { x: 8, y: 11 }, { x: 13, y: 10 }, { x: 11, y: 13 }]
  };

  var levels = [level1, level2, level3];

  function draw() {

    if (lvldone) {
      nextLevel();
      return;
    }

    //Drawing static island image
    CTX.drawImage(island, 0, 0, island.width, island.height);

    //Drawing palms as the level's bounds
    for (var i = 0; i < levels[n].palms.length; i++) {
      CTX.drawImage(palm, levels[n].palms[i].x * box, levels[n].palms[i].y * box);
    }

    //Drawing X spots
    for (var j = 0; j < levels[n].spots.length; j++) {
      CTX.drawImage(spot, levels[n].spots[j].x * box, levels[n].spots[j].y * box);
    }
    //Drawing chests
    for (var k = 0; k < levels[n].chests.length; k++) {
      CTX.drawImage(chest, levels[n].chests[k].x * box, levels[n].chests[k].y * box);
    }

    for (var _i = 0; _i < levels[n].chests.length; _i++) {
      for (var _j = 0; _j < levels[n].spots.length; _j++) {
        if (levels[n].chests[_i].x === levels[n].spots[_j].x && levels[n].chests[_i].y === levels[n].spots[_j].y) {
          CTX.drawImage(dig, levels[n].spots[_j].x * box, levels[n].spots[_j].y * box);
        }
      }
    }

    //Drawing pirate character, slicing from sprite
    CTX.drawImage(pirate, 0, 0, 32, 32, levels[n].pirate.x * box, levels[n].pirate.y * box, 32, 32);

    checkWin();
    requestAnimationFrame(draw);
  }

  function checkWin() {
    var count = 0;
    for (var i = 0; i < levels[n].chests.length; i++) {
      for (var j = 0; j < levels[n].spots.length; j++) {
        if (levels[n].chests[i].x === levels[n].spots[j].x && levels[n].chests[i].y === levels[n].spots[j].y) {
          count++;
        }
      }
      if (count === levels[n].chests.length) {
        lvldone = true;
        CANVAS.style.display = 'none';
        document.getElementById('won').style.visibility = 'visible';
        n++;
        return;
      }
    }
  }

  function nextLevel() {

    document.getElementById('nxt').onclick = function () {
      lvldone = false;
      CANVAS.style.display = 'block';
      CTX.clearRect(0, 0, 672, 672);
      draw();
      return;
    };
  }

  // A helper function to determine if something's in the way
  function collision(arr1, arr2, offsetx, offsety) {
    for (var i = 0; i < arr2.length; i++) {
      if (arr1.x + offsetx === arr2[i].x && arr1.y + offsety === arr2[i].y) {
        return { val: true, p: i };
      }
    }
    return { val: false, p: null };
  }

  function moveLeft() {
    cc = collision(levels[n].pirate, levels[n].chests, -1, 0);

    if (collision(levels[n].pirate, levels[n].palms, -1, 0).val === false) {
      if (collision(levels[n].pirate, levels[n].chests, -1, 0).val === true) {
        if (collision(levels[n].chests[cc.p], levels[n].palms, -1, 0).val === false) {
          if (collision(levels[n].chests[cc.p], levels[n].chests, -1, 0).val === false) {

            levels[n].chests[cc.p].x--;
            levels[n].pirate.x--;
            draw();
          }
        }
      } else {
        levels[n].pirate.x--;
        draw();
      }
    }
  }

  function moveRight() {
    cc = collision(levels[n].pirate, levels[n].chests, 1, 0);

    if (collision(levels[n].pirate, levels[n].palms, 1, 0).val === false) {
      if (collision(levels[n].pirate, levels[n].chests, 1, 0).val === true) {
        if (collision(levels[n].chests[cc.p], levels[n].palms, 1, 0).val === false) {
          if (collision(levels[n].chests[cc.p], levels[n].chests, 1, 0).val === false) {

            levels[n].pirate.x++;
            levels[n].chests[cc.p].x++;
            draw();
          }
        }
      } else {
        levels[n].pirate.x++;
        draw();
      }
    }
  }

  function moveUp() {
    cc = collision(levels[n].pirate, levels[n].chests, 0, -1);

    if (collision(levels[n].pirate, levels[n].palms, 0, -1).val === false) {
      if (collision(levels[n].pirate, levels[n].chests, 0, -1).val === true) {
        if (collision(levels[n].chests[cc.p], levels[n].palms, 0, -1).val === false) {
          if (collision(levels[n].chests[cc.p], levels[n].chests, 0, -1).val === false) {
            levels[n].pirate.y--;
            levels[n].chests[cc.p].y--;
            draw();
          }
        }
      } else {
        levels[n].pirate.y--;
        draw();
      }
    }
  }

  function moveDown() {
    cc = collision(levels[n].pirate, levels[n].chests, 0, 1);

    if (collision(levels[n].pirate, levels[n].palms, 0, 1).val === false) {
      if (collision(levels[n].pirate, levels[n].chests, 0, 1).val === true) {
        if (collision(levels[n].chests[cc.p], levels[n].palms, 0, 1).val === false) {
          if (collision(levels[n].chests[cc.p], levels[n].chests, 0, 1).val === false) {

            levels[n].chests[cc.p].y++;
            levels[n].pirate.y++;
            draw();
          }
        }
      } else {
        levels[n].pirate.y++;
        draw();
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
  });
  // Let the fun begin
  draw();
})();
//# sourceMappingURL=main.js.map
