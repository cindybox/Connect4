import React from 'react';
import logo from './logo.svg';
import './App.css';

function Square(props) {
  return (
    <button
      className={props.className}
      value={props.value}
      id={props.id}
      onClick={props.onClick}
    />
  );
}

class Board extends React.Component {
  render() {
    return (
      <div>
        {this.props.squares.map((k, i) => {
          return k.map((l, j) => {
            let idx = i.toString() + j.toString();
            return (
              <Square
                id={idx}
                value={this.props.squares[i][j]}
                onClick={this.props.onClick}
                className={
                  this.props.squares[i][j] == null
                    ? 'squares'
                    : this.props.squares[i][j] == '1'
                    ? 'squares-blue'
                    : 'squares-orange'
                }
              />
            );
          });
        })}
      </div>
    );
  }
}

// create a 6x7 matrix
const x = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null]
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: x.slice(),
      xIsNext: true,
      player1: '',
      player2: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleNameChange1 = this.handleNameChange1.bind(this);
    this.handleNameChange2 = this.handleNameChange2.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  handleClick(e) {
    const i = e.target.id[0];
    const j = e.target.id[1];
    // clone squares to preserve immutibility
    const squaresTemp = this.state.squares.slice();
    if (!calculateWinner(squaresTemp)) {
      for (let k = 5; k >= 0; k--) {
        if (squaresTemp[k][j] === null) {
          squaresTemp[k][j] = this.state.xIsNext ? '1' : '2';
          this.setState({
            squares: squaresTemp,
            xIsNext: !this.state.xIsNext
          });
          break;
        }
      }
    }
  }

  handleNameChange1(e) {
    this.setState({
      player1: e.target.value
    });
  }
  handleNameChange2(e) {
    this.setState({
      player2: e.target.value
    });
  }

  startNewGame() {
    window.location.reload();
  }

  render() {
    const winnerKey = calculateWinner(this.state.squares);
    const winner =
      winnerKey == null
        ? ''
        : winnerKey == '1'
        ? this.state.player1 == ''
          ? 'Player 1'
          : this.state.player1
        : this.state.player2 == ''
        ? 'Player 2'
        : this.state.player2;
    let status;
    if (winner) {
      status = 'Congratulations ' + winner + ' ,You Win!';
    } else {
      status =
        'Next player: ' +
        (this.state.xIsNext
          ? this.state.player1 == ''
            ? 'Player 1'
            : this.state.player1
          : this.state.player2 == ''
          ? 'Player 2'
          : this.state.player2);
    }

    return (
      <div className="game">
        <div className="game-info">
          <div className="nav-bar">
            <button
              className="btn btn-dark new-game"
              onClick={this.startNewGame}
            >
              New Game
            </button>
            <div className="player">
              <div className="player1-symbol" />
              <p>Player 1 </p>
              <input
                type="text"
                className="player1-name"
                onChange={this.handleNameChange1}
              />
            </div>

            <div className="player">
              <div className="player2-symbol" />
              <p>Player 2 </p>
              <input
                type="text"
                className="player2-name"
                onChange={this.handleNameChange2}
              />
            </div>
          </div>
          <div class="status">{status}</div>
        </div>

        <div className="game-board">
          <Board squares={this.state.squares} onClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

// list all posible winning options and store in an array
function calculateWinner(squares) {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    if (i < 3) {
      for (let j = 0; j < 4; j++) {
        lines.push([[i, j], [i, j + 1], [i, j + 2], [i, j + 3]]);
        lines.push([[i, j], [i + 1, j], [i + 2, j], [i + 3, j]]);
        lines.push([[i, j], [i + 1, j + 1], [i + 2, j + 2], [i + 3, j + 3]]);
      }
      for (let j = 4; j < 7; j++) {
        lines.push([[i, j], [i + 1, j], [i + 2, j], [i + 3, j]]);
      }
    } else {
      for (let j = 0; j < 4; j++) {
        lines.push([[i, j], [i - 1, j + 1], [i - 2, j + 2], [i - 3, j + 3]]);
        lines.push([[i, j], [i, j + 1], [i, j + 2], [i, j + 3]]);
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [[a1, a2], [b1, b2], [c1, c2], [d1, d2]] = lines[i];
    if (
      squares[a1][a2] &&
      squares[a1][a2] === squares[b1][b2] &&
      squares[a1][a2] === squares[c1][c2] &&
      squares[a1][a2] === squares[d1][d2]
    ) {
      return squares[a1][a2];
    }
  }
  return null;
}
export default App;
