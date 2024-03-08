"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
// Create readline interface
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
var grid = [];
function parseGrid(grid) {
  for (var y = 0; y < grid.length; y++) {
    var x = grid[y].indexOf(">");
    if (x !== -1) {
      return { x: x, y: y };
    }
  }
  throw new Error("No starting point '>' found in the grid.");
}
function getNextPoint(current, direction, grid) {
  switch (direction) {
    case "right":
      return __assign(__assign({}, current), { x: current.x + 1 });
    case "down":
      return __assign(__assign({}, current), { y: current.y + 1 });
    case "left":
      return __assign(__assign({}, current), { x: current.x - 1 });
    case "up":
      return __assign(__assign({}, current), { y: current.y - 1 });
    default:
      throw new Error("Invalid direction");
  }
}
function isValidPathPoint(point, grid) {
  if (
    point.y >= 0 &&
    point.y < grid.length &&
    point.x >= 0 &&
    point.x < grid[point.y].length
  ) {
    var char = grid[point.y][point.x];
    return (
      char === "-" ||
      char === "|" ||
      char === "+" ||
      (char >= "A" && char <= "Z") ||
      char === "s"
    );
  }
  return false;
}
function changeDirection(current, direction, grid) {
  // Try to turn right first, then left, then reverse
  var newDirections = {
    right: ["down", "up", "left"],
    down: ["left", "right", "up"],
    left: ["up", "down", "right"],
    up: ["right", "left", "down"],
  }[direction];
  for (
    var _i = 0, newDirections_1 = newDirections;
    _i < newDirections_1.length;
    _i++
  ) {
    var newDirection = newDirections_1[_i];
    var newPoint = getNextPoint(current, newDirection, grid);
    if (
      isValidPathPoint(newPoint, grid) &&
      grid[newPoint.y][newPoint.x] !== "+"
    ) {
      return newDirection;
    }
  }
  throw new Error(
    "No valid direction to turn to at point: " + JSON.stringify(current)
  );
}
function walkPath(start, grid) {
  var current = __assign({}, start);
  var direction = "right"; // Initial direction is to the right
  var path = "";
  var letters = "";
  // Added a safeguard for maximum steps to avoid infinite loops
  var maxSteps =
    grid.reduce(function (acc, row) {
      return acc + row.length;
    }, 0) * 2;
  var steps = 0;
  while (grid[current.y][current.x] !== "s") {
    // Infinite loop safeguard
    if (steps > maxSteps) {
      throw new Error(
        "Exceeded maximum number of steps, possible infinite loop"
      );
    }
    var char = grid[current.y][current.x];
    path += char;
    if (char >= "A" && char <= "Z") {
      letters += char;
      // Attempt to move straight; if not valid, change direction
      var nextPoint = getNextPoint(current, direction, grid);
      if (
        !isValidPathPoint(nextPoint, grid) ||
        grid[nextPoint.y][nextPoint.x] === "+"
      ) {
        direction = changeDirection(current, direction, grid);
      }
    } else if (char === "+") {
      direction = changeDirection(current, direction, grid);
    }
    // Move to the next point in the current direction
    current = getNextPoint(current, direction, grid);
    steps++;
  }
  // Collect the last 's' character
  path += "s";
  return { path: path, letters: letters };
}
function closeInput() {
  rl.close();
  var startPoint = parseGrid(grid);
  var result = walkPath(startPoint, grid);
  console.log("Path:", result.path);
  console.log("Letters:", result.letters);
}
// Recursive function to read multiple lines
function readNextLine() {
  rl.question("", function (line) {
    if (line === "") {
      closeInput();
    } else {
      grid.push(line);
      readNextLine();
    }
  });
}
console.log("Enter your grid, line by line (end input with an empty line):");
// Start reading lines
readNextLine();
