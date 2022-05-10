//Elements for DOM manipulation
const idRepo = (() => {
    let container = document.getElementById('gameboard-container')
    return {container}
})();


//Module to make gameboard
const gameBoard = (() => {
    
    
    //Create and append 3 lines for cells
    const lineLoop = (container) => {
        let lineNum = 1;
        for (let i = 0; i < 3; i++) {
            let line = document.createElement('div');
            line.classList.add('gameboard-line');
            line.setAttribute('id', `line-${lineNum}`)
            lineNum++
            container.appendChild(line);
        }
    }
    //Create and append 3 cells in a line
    let idnum = 0;
    const cellLoop = (line) => {
        for (let i = 0; i < 3; i++) {
            let cell = document.createElement('div');
            cell.classList.add('gameboard-cell');
            cell.setAttribute('id', `cell-${idnum}`)
            idnum++
            line.appendChild(cell);
        }
    }

    //Create a board with three lines each comprising of 3 cells
    const createBoard = () => {
        lineLoop(idRepo.container);
        for (let i = 1; i < 4; i++) {
            cellLoop(document.getElementById(`line-${i}`))
        }
    }
    
    //Remove lines/cells and reset cell idnum so that createBoard() can be used to remake board. Invoked with reset button.
    const reset = () => {
        for (let i = 3; i > 0; i--) {
            document.getElementById(`line-${i}`).remove();
        }
        idnum = 0;
    }

    return {createBoard, reset};

})();


const runGame = (() => {
    //Array to hold user inputs. 1 = empty slot.
    let gameArr = [1, 1, 1, 1, 1, 1, 1, 1, 1];

    //Factory function for players
    const playerFactory = (name, input, command) => {
        return {name, input, command};
    }

    // Two players
    let player1 = playerFactory("Player 1", "X", "human");
    let player2 = playerFactory("Player 2", "O", "human");

    //Start game with player 1
    let player = player1;

    //Check each player to make sure that command matches user choice
    const checkCommand = (player) => {
        if (player.name == "Player 1") {
            if (document.querySelector('input[id="p1-human"]').checked == true) {
                player.command = "human";
            } else {
                player.command = "AI";
            }
        } else {
            if (document.querySelector('input[id="p2-human"]').checked == true) {
                player.command = "human";
            } else {
                player.command = "AI";
            }
        }
    }

    //Run checkCommand() with both players
    const runCComand = () => {
        checkCommand(player1);
        checkCommand(player2);
    }

    //Check to see if there is a winner or a tie
    //Winner code = 3 and Tie code = 5
    const checkWin = () => {
        let winnerCheck = false;
        let tieCheck = true;
        for (let i = 0; i < gameArr.length; i++) {
            if (gameArr[i] === 1) {
                tieCheck = false;
            }
        } 
        console.log(`tieCheck: ${tieCheck}`)
        console.log(`Array: ${gameArr}`)
        if ((gameArr[0] != 1 && gameArr[0] === gameArr[3] && gameArr[3] === gameArr[6]) || (gameArr[1] != 1 && gameArr[1] === gameArr[4] && gameArr[4] === gameArr[7]) || (gameArr[2] != 1 && gameArr[2] === gameArr[5] && gameArr[5] === gameArr[8]) || (gameArr[0] != 1 && gameArr[0] === gameArr[1] && gameArr[1] === gameArr[2]) || (gameArr[3] != 1 && gameArr[3] === gameArr[4] && gameArr[4] === gameArr[5]) || (gameArr[6] != 1 && gameArr[6] === gameArr[7] && gameArr[7] === gameArr[8]) || (gameArr[0] != 1 && gameArr[0] === gameArr[4] && gameArr[4] === gameArr[8]) || (gameArr[2] != 1 && gameArr[2] === gameArr[4] && gameArr[4] === gameArr[6])) {
            winnerCheck = true;
            return 3;
        } else if (tieCheck == true && winnerCheck == false) {
            return 5;
        }
        winnerCheck = false;
    }

    //Check to make sure position in array has not been used yet
    const checkArray = (() => {
        if (gameArr[_arrPos] === 1) {
            return true;
        }
    })

    //Add the player's X or O into the array
    const updateArray = ((user) => {
        gameArr[_arrPos] = user;
    })

    //Add most recent player entry to screen
    const displayController = ((input) => {
        document.getElementById(`cell-${_arrPos}`).innerText = input;
        //Reset _arrPos to ensure no errors(there is no arr[10])
        _arrPos = 10;
    })

    //Display which player's turn it is
    const printTurn = ((player) => {
        document.getElementById('game-info').innerText = `${player.name}'s turn.`;
    }) 

    //Display winner of game and unhide reset button
    const printWinner = ((message) => {
        document.getElementById('game-info').innerText = message;
        document.getElementById('reset').classList.toggle('hidden');
    })

    //Reset first player to player1 and reset gameArray for reset button.
    const reset = () => {
        player = player1;
        gameArr = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    }

    //Remove ID from cell to disable event listener. Used to stop game. 
    const idRemove = (() => {
        for (let i = 0; i < gameArr.length; i++) {
            document.getElementById(`cell-${i}`).removeAttribute('id');
        }
    })

    //Chooses available array position at random for an AI player.
    const randomPick = (() => {
        let pick = 10;
        while (gameArr[pick] != 1) {
            pick = Math.floor(Math.random()*9)
        }
        return pick;
    })

    //Check if next player is an AI
    const aiCheck = (() => {
        //Automatically make move if next player is AI
        if (player.command == "AI") {
            _arrPos = randomPick();
            game();
        }
    })

    //Triggered by event listener when cell is clicked or by aiCheck()
    const game = () => {
        let input = player.input;
        if (checkArray() === true) {
            updateArray(input);
            displayController(input);
            if (checkWin() === 3) {   
                printWinner(`Congratulations! ${player.name} wins!`);
                idRemove();
                player.scoreCount++;
            } else if (checkWin() === 5) {
                printWinner("It\'s a tie.")
                idRemove();
            } else {
            player = ((player === player1) ? player2 : player1)
            printTurn(player);
            }
        }
        aiCheck();
    }
    
    //Variable to be updated in click event on cell
    let _arrPos = 10;
    //Click will get position clicked and run game function
    idRepo.container.addEventListener('click', e => {
        _arrPos = e.target.id.slice(-1);
        game();
    })

    return {reset, aiCheck, printTurn, player, runCComand}
    
})();

const buttons = (() => {
    let rstBtn = document.getElementById('reset');
    rstBtn.addEventListener('click', e => {
        //Remove gameBoard divs and reset gameArr/current player
        gameBoard.reset();
        runGame.reset();
        //Unhide the first input display and hide the game-info div and resetBtn
        document.getElementById('front-page').classList.toggle('hidden');
        document.getElementById('game-info').classList.toggle('hidden');
        document.getElementById('reset').classList.toggle('hidden');
    })
    
    let startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', e => {
        //Hide first input display and unhide div where turn/winner is printed to
        document.getElementById('front-page').classList.toggle('hidden');
        document.getElementById('game-info').classList.toggle('hidden');
        //Run function to create the baord
        gameBoard.createBoard();
        //reassign player's command property if necessary
        runGame.runCComand();
        //Runs first turn if player 1 is AI
        runGame.aiCheck();
        //Prints the first turn to the game-info div
        runGame.printTurn(runGame.player);
    })
})();

