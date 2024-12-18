'use strict'

var gBoard

var LIVES
var gflags

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}
onInit()

function onInit() {
    gflags = gLevel.MINES
    LIVES = 3
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    renderStats()
}

function buildBoard(boardSize) {
    const board = []

    for (var i = 0; i < boardSize; i++) {
        board[i] = []
        for (var j = 0; j < boardSize; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // Set the mines
    // if (gGame.isOn) {
    // setMines(board, gLevel.MINES)
    // setMinesNegsCount(board)
    // board[0][0].isMine = board[1][2].isMine = true
    // }

    return board
}

function setMinesNegsCount(board) {

    for (var cellI = 0; cellI < board.length; cellI++) {
        for (var cellJ = 0; cellJ < board[0].length; cellJ++) {

            var negCount = 0
            for (var i = cellI - 1; i <= cellI + 1; i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                    if (i === cellI && j === cellJ) continue
                    if (j < 0 || j >= board[i].length) continue

                    if (board[i][j].isMine) negCount++
                }
            }
            var cell = board[cellI][cellJ]

            if (cell.isMine || !negCount) continue

            cell.minesAroundCount = negCount
            renderCell(cellI, cellJ, negCount)
        }
    }
}

function renderBoard(board) {
    var strHTML = '<table><tbody>'
    var cellContent = ''

    for (var i = 0; i < board.length; i++) {

        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]

            // For a cell that is shown add shown class
            var className = (cell.isShown) ? 'shown' : ''

            // For a cell that is Marked add marked class
            if (cell.isMarked) {
                className += ' marked'
            }
            // ${cellContent} 
            strHTML += `\t<td data-i="${i}" data-j="${j}"  class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            oncontextmenu="onCellMarked(this , ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    strHTML += '</tbody></table>'

    const elCells = document.querySelector('.board-container')
    elCells.innerHTML = strHTML
    elCells.addEventListener("contextmenu", (e) => { e.preventDefault() })

}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true
        setMines(gBoard, gLevel.MINES, i, j)
        setMinesNegsCount(gBoard)
    }
    const cell = gBoard[i][j]
    if (cell.isMarked) return
    cell.isShown = true
    elCell.classList.add('shown')
    
    if (cell.isMine) {
        const elBtn = document.querySelector(`.reset`)
        elBtn.innerHTML = '🤯'
        setTimeout(() => {
            elBtn.innerHTML = '😃'
        }, 1000)
        LIVES--
        renderStats()
        if (!LIVES) gameOver()
    }else{
        expandShown(gBoard, elCell, i, j)
    }

}

function onCellMarked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (currCell.isShown) return
    if (currCell.isMarked) {
        currCell.isMarked = false
        if (currCell.isMine) {
            elCell.innerHTML = '💣'
        } else if (currCell.minesAroundCount) {
            elCell.innerHTML = currCell.minesAroundCount
        } else {
            elCell.innerHTML = ''
        }

        elCell.classList.remove(`mark`)
        gflags++

    } else if (gflags) {
        currCell.isMarked = true
        elCell.innerHTML = '🏳️'
        elCell.classList.add(`mark`)
        gflags--
    }
}

function checkGameOver() {
    //     Game ends when all mines are
    // marked, and all the other cells
    // are shown
}

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) continue
            var cell = board[cellI][cellJ]
            cell.isShown = true
            renderCell(i,j,'shown')
        }
    }
}

function setMines(board, amount, idx, jdx) {

    for (var i = 0; i < amount; i++) {
        var randIdx = getRandomInt(0, board.length)
        var randJdx = getRandomInt(0, board[0].length)
        var cell = board[randIdx][randJdx]
        if (cell.isMine || (randIdx === idx && randJdx === jdx)) {
            var emptyCellpos = findEmptyPos(board, idx, jdx)
            if (!emptyCellpos) return
            randIdx = emptyCellpos.i
            randJdx = emptyCellpos.j
            cell = board[randIdx][randJdx]
        }
        cell.isMine = true
        renderCell(randIdx, randJdx, '💣', 'mine')
    }
}

function gameOver() {
    console.log('Game Over')
    // gGame.isOn = false
    // showModal()
}

function resetGame() {
    gStartTime = 0
    gOnBoard = 0
    LIVES = 3

    // clearInterval(gBallInterval)
    // clearInterval(gGlueInterval)
    // clearInterval(gTimerInterval)
}

function renderCell(idx, jdx, value, addClass) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`[data-i="${idx}"][data-j="${jdx}"]`)
    elCell.innerHTML = value
    elCell.classList.add(addClass)
}

function renderStats() {
    const elLives = document.querySelector('.LIVES')
    // const elOnBoard = document.querySelector('.on-board')

    elLives.innerHTML = LIVES
    // elCollected.innerHTML = gCollected
}
