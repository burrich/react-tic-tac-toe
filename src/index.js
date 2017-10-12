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
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  /**
   * Rendering Board component
   *
   * @return {Object} Board elements
   */
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
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

    // Change state adding the current squares to history
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
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
        'Go to move #' + move :
        'Go to game start';

      // key attribute for performance issues
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
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
