import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import './index.css';

// Declaring global variable

var currentFocus = -1;

// Can be rewritten in functional component
// Class Square containing X O

class Square extends React.Component {
  render() {
    const value = this.props.value;
    const index = this.props.index;
    const winner = this.props.winner;
    let btnClasses = classNames({
      'square': true,
      'blue': value === 'O',
      'black': winner && winner.includes(index)
    });

    return (
      <button className={btnClasses} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

// Class Board containing 9 squares

class Board extends React.Component {
  renderSquare(i) {
    return (
    	<Square 
        index={i}
        winner={this.props.winner}
    		value={this.props.squares[i]} 
    		onClick={() => this.props.onClick(i)}
    	/>
    );
  }

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

// Class Game containg them all

class Game extends React.Component {
	handleClick(i) {
		currentFocus = -1;
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
    const squares = current.squares.slice();
   	if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
    	history: history.concat([{
    		squares: squares
    	}]),
    	xIsNext: !this.state.xIsNext,
    	stepNumber: history.length
    });
  }

  changeOrder() {
    this.setState({
      ascending: !this.state.ascending
    })
  }

	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			xIsNext: true,
			stepNumber: 0,
      ascending: true
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
		currentFocus = step;
	}

  render() {
  	const history = this.state.history;
    const stepNumber = this.state.stepNumber;
  	const current = history[stepNumber].squares;
    const winnerArr = calculateWinner(current);
  	const winner = winnerArr ? current[winnerArr[0]] : null;

    var moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ': ' 
          + calculatePos(step.squares, history[move - 1].squares)
        : 'Go to game start';
      let liClasses = classNames({
      	'btn-default': true,
      	'active': move === currentFocus,
        'blue': (!(move % 2) && move && !winner),
        'red': (move % 2 && !winner)
      });

      return (
        <li key={move}>
          <button 
          	onClick={() => this.jumpTo(move)} 
          	className={liClasses}>
          	{desc}
          </button>
        </li>
      );
    });

    if (!this.state.ascending) moves = moves.reverse();

  	let status;
  	if (winnerArr === 'Draw') {
  		status = 'It is a draw!'
  	} else if (winnerArr) {
  		status = 'The winner is: ' + winner;
  	} else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
  	}

    let statusClasses = classNames({
      'status': true,
      'blue': (!(stepNumber % 2) && stepNumber && !winner),
      'red': (stepNumber % 2 && !winner)
    });


    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current}
            winner={winnerArr}
          	onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className={statusClasses}>{status}</div>
          <ol className="moves">{moves}</ol>
        </div>
        <li className="tg-list-item" onChange={() => this.changeOrder()}>
          <input className="tgl tgl-flip" id="toggle" type="checkbox"/>
          <label 
            className="tgl-btn" data-tg-off="Ascending" 
            data-tg-on="Descending" htmlFor="toggle">
          </label>
        </li>
      </div>
    );
  }
}

// ========================================

// Main 

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// calculateWinner(squares) determines who is the winner if the 
//   game is completed according to squares
// Returned types: 'X' or 'O' or null

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
      return lines[i];
    }
  }
  for (let i in squares) {
  	if (!squares[i]) return null;
  }
  return 'Draw';
}

// calculatePos(before, current) determines the previous move's 
//   row and the column according to before an current
// Returned types: String

function calculatePos(before, current) {
	const position = [
		"(1, 1)", "(1, 2)", "(1, 3)",
		"(2, 1)", "(2, 2)", "(2, 3)",
		"(3, 1)", "(3, 2)", "(3, 3)",
	];

	for (let i = 0; i < current.length; ++i) {
		if (before[i] !== current[i]) return '(row, column) = ' + position[i]; 
	}
}







