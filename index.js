const BOARD_SIZE = 7;
class View {
  constructor() {
    // Create board
    this.root = document.querySelector("#root");
    this.boardTable = this.#createTable();
    this.root.append(this.boardTable);
  }

  #createTable() {
    document.querySelector("#turn").textContent = "Player 1";
    let mainTable = this.#createElement("table", [], ["main_table"]);
    let tbody = this.#createElement("tbody");
    for (let i = 0; i < BOARD_SIZE + 1; i++) {
      let tr = this.#createElement("tr");
      if (i === 0) {
        let thead = this.#createElement("thead");
        for (let j = 0; j < BOARD_SIZE; j++) {
          let button = this.#createElement(
            "button",
            ["drop here"],
            ["dropBtn"],
            { id: "b" + j }
          );
          tr.append(this.#createElement("td", [button]));
        }
        thead.append(tr);
        mainTable.append(thead);
      } else {
        for (let j = 0; j < BOARD_SIZE; j++) {
          tr.append(this.#createElement("td", []));
        }
        tbody.append(tr);
        mainTable.append(tbody);
      }
    }
    return mainTable;
  }

  render(board, turn, winner) {
    if (winner !== undefined) {
      document.querySelector("#turn").textContent = "";
      document.querySelector("#winner").textContent = `'${
        winner.charAt(0).toUpperCase() + turn.slice(1)
      }' Color is the winner!`;
      this.#disableAllButtons();
    }
    document.querySelector("#turn").textContent =
      turn.charAt(0).toUpperCase() + turn.slice(1) + "'s Turn";
    // reset all board
    this.root.firstElementChild.children[1].remove();
    // build tbody with board info
    let tbody = this.#createElement("tbody");
    for (let i = 0; i < BOARD_SIZE; i++) {
      let tr = this.#createElement("tr");
      for (let j = 0; j < BOARD_SIZE; j++) {
        tr.append(
          this.#createElement("td", [], [], {
            style: "background-color:" + board[i][j],
          })
        );
      }
      tbody.append(tr);
    }
    this.boardTable.append(tbody);
  }

  #disableAllButtons() {
    let btnArray = document.querySelectorAll(".dropBtn");
    btnArray.forEach((button) => {
      button.disabled = true;
    });
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

  bindOnTurnPlayed(turnHandler) {
    let btnArray = document.querySelectorAll(".dropBtn");
    btnArray.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        turnHandler(event.target.id.split("")[1]);
      });
    });
  }

  // functions:
  // 1. place a coin - make the turn
  // 2. winner
  // 3. change players turns (change a label)
}
class Module {
  constructor(color1, color2) {
    // Create data strucure
    this._turn = color1;
    this._winner = undefined;
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
    if (this._board[0][column] === 0) {
      for (let i = BOARD_SIZE - 1; i >= 0; i--) {
        if (this._board[i][column] === 0) {
          this._board[i][column] = this._turn;
          if (this.#checkWinner(this._board) !== false) {
            this._winner = this._turn;
            break;
          } else {
            this.#changeTurn();
            break;
          }
        }
      }
    }
  }

  get turn() {
    return this._turn;
  }

  set turn(value) {
    this._turn = value;
  }

  get color1() {
    return this._color1;
  }

  get color2() {
    return this._color2;
  }

  get board() {
    return this._board;
  }

  set board(value) {
    this._board = value;
  }

  get winner() {
    return this._winner;
  }

  set winner(value) {
    this._winner = value;
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
  constructor(mainModel, mainView) {
    this.module = mainModel;
    this.view = mainView;
    this.view.bindOnTurnPlayed(this.handleTurnPlayed);
  }

  handleTurnPlayed = (column) => {
    this.module.playingTurn(column);
    this.view.render(this.module._board, this.module.turn, this.module.winner);
  };
}

let z = new controller(new Module("blue", "red"), new View());
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
