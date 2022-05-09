const playerFactory = (name, input) => {
    let scoreCount = 0;
    let command = "human";
    return {name, input, scoreCount, command};
}

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
        createBoard();
    }

    return {createBoard, reset};

})();


const runGame = (() => {
    //Array to hold user inputs. 1 = empty slot.
    let gameArr = [1, 1, 1, 1, 1, 1, 1, 1, 1];

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
        if (gameArr[arrPos] === 1) {
            return true;
        }
    })

    //Add the player's X or O into the array
    const updateArray = ((user) => {
        gameArr[arrPos] = user;
    })

    //Add most recent player entry to screen
    const displayController = ((input) => {
        document.getElementById(`cell-${arrPos}`).innerText = input;
        //Reset arrPos to ensure no errors(there is no arr[10])
        arrPos = 10;
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
            Math.floor(Math.random()*9)
        }
    })
    
    // event listener triggers turn
    const game = () => {
        let input = player.input;
        //Automatically make move if player is AI
        if (player.command === "AI") {
            randomPick();
        }
        if (checkArray() === true) {
            updateArray(input);
            displayController(input);
            //Both instances below need a way to print results to screen
            if (checkWin() === 3) {   
                console.log(`${player.name} wins!`);
                idRemove();
                player.scoreCount++;
            } else if (checkWin() === 5) {
                console.log("It\'s a tie.")
                idRemove();
            }
            //Swap between players
            player = ((player === player1) ? player2 : player1)
        }
    }
    
    //Variable to be updated in click
    let arrPos = 10;
    //Click will get position clicked and run game function
    idRepo.container.addEventListener('click', e => {
        arrPos = e.target.id.slice(-1);
        game();
    })

    //Create two players, currently hardcoded
    const player1 = playerFactory("player1", "X");
    const player2 = playerFactory("player2", "O");

    //Start game with player 1
    let player = player1;
    
    //Run function to create the baord
    gameBoard.createBoard();

    return {reset}
    
})();

const buttons = (() => {
    let rstBtn = document.getElementById('reset');
    rstBtn.addEventListener('click', e => {
        gameBoard.reset();
        runGame.reset();
    })
    
})();

