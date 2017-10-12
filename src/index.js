import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * Square functionnal component (equivalent to class component when no constructor needed)
 * 
 * @param  {Object} props Component parameters
 * @return {Object}       Component element to render
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * Board Class for rendering all squares
 */
class Board extends React.Component {

  /**
   * Rendering a square component
   * 
   * @param  {Number} i Index of the square to render
   * @return {Object}   A Square element
   */
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  /**
   * Rendering a squares row
   * 
   * @param  {Number} row Index of the row to render
   * @return {Array}      An array of 3 squares components
   */
  renderSquaresRow(row) {
    const rowElts = [];
    for (let col = 0; col < 3; col++) {
      rowElts.push(this.renderSquare(row*3 + col)); // Passing square coordinate (from 0 to 8)
    }

    return rowElts;
  }

  /**
   * Rendering Board component
   *
   * @return {Object} Board elements
   */
  render() {
    const boardRows = [];
    for (let row = 0; row < 3; row++) {
      boardRows.push(
        <div key={row} className="board-row">
          {this.renderSquaresRow(row)}
        </div>
      );
    }

    return <div>{boardRows}</div>;
  }
}


/**
 * Game Class for rendering the board
 * Manage an history of moves
 */
class Game extends React.Component {
  /**
   * Constructor
   * 
   * @param  {Object} props Component parameters
   */
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: [],
        player: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  /**
   * Handle square clicks
   * 
   * @param {Number} i Index of the clicked square
   */
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // Shallow copy for immutability

    // Exit process if the game is finished
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Change state adding the current squares, move and player to history
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: oneDimToTwoDimCoor(i),
        player: squares[i],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  /**
   * Jump to a previous or next move by updating the stepNumber 
   * 
   * @param {Number} step Index of the move 
   */
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  /**
   * Rendering Game component
   *
   * @return {Object} Component elements
   */
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares);

    // Dynamic list for history moves
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + step.player + ' : '  + step.move + ')' :
        'Go to game start';

      // key attribute for performance issues
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} 
                  className={move === this.state.stepNumber ? 'move-selected' : ''}>
            {desc}
          </button>
        </li>
      );
    });

    // Display the winner or the next player
    let status;
    if (winner) {
      status = 'Winner : ' + winner;
    } else {
      status = 'Next player : ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Return elements
    return (
      <div className="game">
        <div className="game-board">
          <Board  
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// Adding game component to the DOM
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

/**
 * Return the winner or null
 * 
 * @param  {Array} squares Fill with 'X', 'O' or null
 * @return {String}        Return the winner ('X', 'O' or null)
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

/**
 * Convert a one dimensionnal board coordinate (default) of a square to two dimensionnal coordinate
 * Example :
 * 0 1 2    [1,1] [1,2] [1,3]
 * 3 4 5 => [2,1] [2,2] [2,3]
 * 6 7 8    [3,1] [3,2] [3,3]
 * 
 * @param  {Number} i One dimensionnal board coordinate
 * @return {Number}   Two dimensionnal board coordinates
 */
function oneDimToTwoDimCoor(i) {
  if (i < 3) { // First line
    return [1, i + 1];
  } else if (i < 6) { // Second line
    return [2, i - 2];
  } else { // Third line
    return [3, i - 5];
  }
}
