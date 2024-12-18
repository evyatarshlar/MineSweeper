'use strict'

var gBoard
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
    gBoard = buildBoard(gLevel.SIZE)
    console.log('gboard', gBoard)
    renderBoard(gBoard)
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
    // setMines(board, gLevel.MINES)
    board[0][0].isMine = board[1][2].isMine = true
    setMinesNegsCount(board)
    return board
}

function setMinesNegsCount(board) {
    var negCount = 0

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
            board[cellI][cellJ].minesAroundCount = negCount
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '<table><tbody>'
    var display = ''

    for (var i = 0; i < board.length; i++) {

        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            display = cell.minesAroundCount

            // For a cell that is shown add shown class
            var className = (cell.isShown) ? 'shown' : ''

            // For a cell of type MINE add mine class
            if (cell.isMine) {
                className += ' mine'
                display = '💣'
            }

            // For a cell that is Marked add marked class
            if (cell.isMarked) {
                className += ' marked'
            }

            strHTML += `\t<td data-i="${i}" data-j="${j}"  class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            oncontextmenu="onCellMarked(this)" >
                             ${display}
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    strHTML += '</tbody></table>'

    const elCells = document.querySelector('.board-container')
    elCells.innerHTML = strHTML

}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isMarked) return
    cell.isShown = true
    elCell.classList.add('shown')
    if (cell.isMine) gameOver()
}

function onCellMarked(elCell) {
    // Called when a cell is rightclicked
    //      hide the context menu on right click
    //     const div = document.getElementById("????");
    // div.addEventListener("contextmenu", (e) => {e.preventDefault()});
}

function checkGameOver() {
    //     Game ends when all mines are
    // marked, and all the other cells
    // are shown
}

function expandShown(board, elCell, i, j) {
    //     When user clicks a cell with no
    // mines around, we need to open
    // not only that cell, but also its
    // neighbors.
    // NOTE: start with a basic
    // implementation that only opens
    // the non-mine 1st degree
    // neighbors
    // BONUS: if you have the time
    // later, try to work more like the
    // real algorithm (see description
    // at the Bonuses section below)
}

function setMines(board, amount) {

    for (var i = 0; i < amount; i++) {
        var randIdx = getRandomInt(0, board.length)
        var randJdx = getRandomInt(0, board[0].length)
        var cell = board[randIdx][randJdx]
        if (cell.isMine) {
            var emptyCellpos = findEmptyPos(board)
            if (!emptyCellpos) return
            cell = board[emptyCellpos.i][emptyCellpos.j]
        }
        cell.isMine = true
    }
}

function gameOver() {
    console.log('Game Over')
    gGame.isOn = false
    // showModal()
}