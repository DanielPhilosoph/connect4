const BOARD_SIZE = 7;
class view {
  constructor() {
    // Create board
    let root = document.querySelector("#root");
    let boardTable = this.#createTable();
    root.append(boardTable);
  }

  #createTable() {
    let mainTable = this.#createElement("table");
    for (let i = 0; i < BOARD_SIZE; i++) {
      let tr = this.#createElement("tr");
      if (i === 0) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          let button = this.#createElement(
            "button",
            ["drop here"],
            [],
            { id: "b" + j },
            {
              click: (event) => {
                this.#onClick(event);
              },
            }
          );
          tr.append(this.#createElement("td", [button]));
        }
      } else {
        for (let j = 0; j < BOARD_SIZE; j++) {
          tr.append(this.#createElement("td", [`Y${i} X${j}`]));
        }
      }
      mainTable.append(tr);
    }
    return mainTable;
  }

  render(board) {
    console.log(board);
    let mainTable = this.#createElement("table");
    for (let i = 0; i < BOARD_SIZE; i++) {
      let tr = this.#createElement("tr");
      if (i === 0) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          let button = this.#createElement(
            "button",
            ["drop here"],
            [],
            { id: "b" + j },
            {
              click: (event) => {
                this.#onClick(event);
              },
            }
          );
          tr.append(this.#createElement("td", [button]));
        }
      } else {
        for (let j = 0; j < BOARD_SIZE; j++) {
          tr.append(this.#createElement("td", [board[i][j]]));
        }
      }
      mainTable.append(tr);
    }
    return mainTable;
  }

  #createElement(
    tagName,
    children = [],
    classes = [],
    attributes = {},
    eventListeners = {}
  ) {
    const myElement = document.createElement(tagName);

    for (const child of children) {
      myElement.append(child);
    }

    for (const cls of classes) {
      myElement.classList.add(cls);
    }

    for (const attr in attributes) {
      myElement.setAttribute(attr, attributes[attr]);
    }

    for (const listener in eventListeners) {
      const functionArray = eventListeners[listener];
      myElement.addEventListener(listener, functionArray);
    }

    return myElement;
  }

  #onClick(event) {
    event.preventDefault();
    let id = event.target.id;
    this.#bindOnTurnPlayed(event.target.id);
  }

  #bindOnTurnPlayed(id, turnHandler) {}

  // functions:
  // 1. place a coin - make the turn
  // 2. winner
  // 3. change players turns (change a label)
}
class Module {
  constructor(color1, color2) {
    // Create data strucure
    this._turn = color1;
    this._winner;
    this._color1 = color1;
    this._color2 = color2;
    this._board = this._board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
  }

  #changeTurn() {
    this._turn = this._turn === this._color1 ? this._color2 : this._color1;
  }

  playingTurn(column) {
    if (this._board[column][BOARD_SIZE - 1] === 0) {
      let flag = true;
      for (let i = BOARD_SIZE - 1; i >= 0; i--) {
        if (this._board[i][column] === 0) {
          this._board[i][column] = this._turn;
          if (this.#checkWinner(this._board) !== false) {
            console.log("WINNER");
            break;
          }
          this.#changeTurn();
          break;
        }
      }
    }
  }

  #chkLine(a, b, c, d) {
    // Check first cell non-zero and all cells match
    return a != 0 && a == b && a == c && a == d;
  }

  #checkWinner(bd) {
    // Check down
    for (let i = 0; i < Math.floor(BOARD_SIZE / 2) + 1; i++)
      for (let c = 0; c < BOARD_SIZE; c++)
        if (this.#chkLine(bd[i][c], bd[i + 1][c], bd[i + 2][c], bd[i + 3][c]))
          return bd[i][c];

    // Check right
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let c = 0; c < Math.floor(BOARD_SIZE / 2) + 1; c++)
        if (this.#chkLine(bd[i][c], bd[i][c + 1], bd[i][c + 2], bd[i][c + 3]))
          return bd[i][c];

    // Check down-right
    for (let i = 0; i < Math.floor(BOARD_SIZE / 2) + 1; i++)
      for (let c = 0; c < Math.floor(BOARD_SIZE / 2) + 1; c++)
        if (
          this.#chkLine(
            bd[i][c],
            bd[i + 1][c + 1],
            bd[i + 2][c + 2],
            bd[i + 3][c + 3]
          )
        )
          return bd[i][c];

    // Check down-left
    for (let i = 3; i < BOARD_SIZE; i++)
      for (let c = 0; c < Math.floor(BOARD_SIZE / 2) + 1; c++)
        if (
          this.#chkLine(
            bd[i][c],
            bd[i - 1][c + 1],
            bd[i - 2][c + 2],
            bd[i - 3][c + 3]
          )
        )
          return bd[i][c];

    return false;
  }

  resetBoard() {
    this._board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
  }

  //functions
  // 1. change turn
  // 2. playing turn (adding to board)
  // 3. winner check (check if there is a 4 in a row)
  // 4. reset game
}
class controller {
  //#modle;
  //#view;
  constructor(model, view) {
    //this.#model = model;
    //this.#view = view;
    //this.#view.#bindTurnPlayed(this.#handleTurnPlayed);
  }

  #handleTurnPlayed(column) {
    //this.#modle.playingTurn(column);
  }
}

let y = new view();
// x.playingTurn(0);
let x = new Module("1", "2");
// x.playingTurn(0);
// x.playingTurn(1);
// x.playingTurn(6);
// x.playingTurn(5);
// x.playingTurn(0);
// x.playingTurn(1);
// x.playingTurn(0);
// x.playingTurn(1);
// x.playingTurn(2);
// x.playingTurn(3);
// x.playingTurn(3);
// x.playingTurn(2);
// x.playingTurn(4);
// x.playingTurn(0);
// x.resetBoard();
// //x.playingTurn(3);

// //x.playingTurn(1);

// document.querySelector("body").append(y.render(x._board));
// // console.log(x._board);
