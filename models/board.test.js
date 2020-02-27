const Board = require("./board");
const Square = require("./square");
const Player = require("./player");

describe("checkWinner", () => {
  const players = [new Player(1, 'x', 'anna',), new Player(2, 'o', 'peter')];

  it("returns empty winning positions when empty board", () => {
    const emptyBoard = new Board(undefined, players, 0);
    expect(emptyBoard.checkWinner()).toEqual({ win: false, pos: [] });
  });

  //TODO T1: Ihre Unit Tests
  // testing vertical lines
  it("returns the winner when all x's are in the first column", () => {
    const notEmptyBoard = new Board([
      new Square('x'), new Square(), new Square(),
      new Square('x'), new Square(), new Square(),
      new Square('x'), new Square(), new Square()
    ], players, 0);
    expect(notEmptyBoard.checkWinner()).toEqual({ win: true, pos: [0, 3, 6] });
  });

  it("returns the winner when all x's are in the second column", () => {
    const notEmptyBoard = new Board([
      new Square(), new Square('x'), new Square(),
      new Square(), new Square('x'), new Square(),
      new Square(), new Square('x'), new Square()
    ], players, 0);
    expect(notEmptyBoard.checkWinner()).toEqual({ win: true, pos: [1, 4, 7] });
  });

  it("returns the winner when all x's are in the third column", () => {
    const notEmptyBoard = new Board([
      new Square(), new Square(), new Square('x'),
      new Square(), new Square(), new Square('x'),
      new Square(), new Square(), new Square('x')
    ], players, 0);
    expect(notEmptyBoard.checkWinner()).toEqual({ win: true, pos: [2, 5, 8] });
  });


  // testing horizontal rows
  it("returns the winner when all x's are in the first horizontal row", () => {
    const notEmptyBoardoard = new Board([
      new Square('x'), new Square('x'), new Square('x'),
      new Square(), new Square(), new Square(),
      new Square(), new Square(), new Square()
    ], players, 0);
    expect(notEmptyBoardoard.checkWinner()).toEqual({ win: true, pos: [0, 1, 2] });
  });

  it("returns the winner when all x's are in the second horizontal row", () => {
    const notEmptyBoardoard = new Board([
      new Square(), new Square(), new Square(),
      new Square('x'), new Square('x'), new Square('x'),
      new Square(), new Square(), new Square()
    ], players, 0);
    expect(notEmptyBoardoard.checkWinner()).toEqual({ win: true, pos: [3, 4, 5] });
  });

  it("returns the winner when all x's are in the third horizontal row", () => {
    const notEmptyBoardoard = new Board([
      new Square(), new Square(), new Square(),
      new Square(), new Square(), new Square(),
      new Square('x'), new Square('x'), new Square('x')
    ], players, 0);
    expect(notEmptyBoardoard.checkWinner()).toEqual({ win: true, pos: [6, 7, 8] });
  });

  // testing diagonal lines
  it("returns the winner when all x's are in diagonal row from left top to right bottom", () => {
    const notEmptyBoardoard = new Board([
      new Square('x'), new Square(), new Square(),
      new Square(), new Square('x'), new Square(),
      new Square(), new Square(), new Square('x')
    ], players, 0);
    expect(notEmptyBoardoard.checkWinner()).toEqual({ win: true, pos: [0, 4, 8] });
  });

  it("returns the winner when all x's are in diagonal row from right top to left bottom", () => {
    const notEmptyBoardoard = new Board([
      new Square(), new Square(), new Square('x'),
      new Square(), new Square('x'), new Square(),
      new Square('x'), new Square(), new Square()
    ], players, 0);
    expect(notEmptyBoardoard.checkWinner()).toEqual({ win: true, pos: [6, 4, 2] });
  });
});

  


