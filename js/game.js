'use strict'

var gBoard

var LIVES
var gflags
var gStartTime
var gTimerInterval

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

function onInit() {
    resetGame()
    hideModal()
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    renderStats()
    gGame.isOn = true
}

function onLevel(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInit()
}

function buildBoard(boardSize, Idx, Jdx) {
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
    if (Idx >= 0 && Idx < board.length) {
        setMines(board, gLevel.MINES, Idx, Jdx)
        setMinesNegsCount(board)
    }
    return board
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
    }
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
        }
    }
}

function renderBoard(board) {
    var strHTML = '<table><tbody>'

    for (var i = 0; i < board.length; i++) {

        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]

            var className = (cell.isShown) ? 'shown' : ''
            var cellContent = ''

            if (cell.isMine) {
                cellContent = '💣'
            } else if (cell.minesAroundCount) {
                cellContent = cell.minesAroundCount
            }

            strHTML += `\t<td data-i="${i}" data-j="${j}"  class="cell ${className}" 
                            onclick="onCellClicked(${i}, ${j})"
                            oncontextmenu="onCellMarked(this , ${i}, ${j})" >
                         ${cellContent} 
                            </td>\n`
        }
        strHTML += `</tr>\n`
    }
    strHTML += '</tbody></table>'

    const elCells = document.querySelector('.board-container')
    elCells.innerHTML = strHTML
    elCells.addEventListener("contextmenu", (e) => { e.preventDefault() })
    document.querySelector('.flags').innerHTML = gflags

}

function onCellClicked(i, j) {
    console.log('gGame.isOn, gGame.shownCount', gGame.isOn, gGame.shownCount)
    if (!gGame.isOn) return
    if (!gGame.shownCount) {
        gBoard = buildBoard(gLevel.SIZE, i, j)
        renderBoard(gBoard)
        startTimer()
        renderStats()
    }
    const cell = gBoard[i][j]
    if (cell.isMarked) return
    if (!cell.isShown && !cell.isMine) {// 
        cell.isShown = true
        renderCellClass(i, j, 'shown')
        gGame.shownCount++
    }

    if (cell.isMine) {
        cell.isShown = true
        renderCellClass(i, j, 'shown')
        const elBtn = document.querySelector(`.reset`)
        elBtn.innerHTML = '🤯'
        LIVES--
        renderStats()
        console.log('LIVES', LIVES)
        if (!LIVES) {
            gameOver()
            console.log('1', 1)
        } else {
            setTimeout(() => {
                elBtn.innerHTML = '😃'//stepOnMine(elBtn, i, j)
            }, 1000)
            console.log('2', 2)
        }
    } else if (!cell.minesAroundCount) {
        expandShown(gBoard, i, j)
    }
    checkGameOver()
}

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            var cell = board[i][j]
            if (cell.isMine || cell.isMarked || cell.isShown) continue
            cell.isShown = true
            renderCellClass(i, j, 'shown')
            gGame.shownCount++
        }
    }
}

function onCellMarked(elCell, i, j) {
    var cell = gBoard[i][j]
    if ((cell.isShown && !cell.isMine) || !gGame.shownCount || !gGame.isOn) return
    if (cell.isMarked) {
        cell.isMarked = false
        if (cell.isMine) {
            elCell.innerHTML = '💣'
        } else if (cell.minesAroundCount) {
            elCell.innerHTML = cell.minesAroundCount
        } else {
            elCell.innerHTML = ''
        }

        elCell.classList.remove(`mark`)
        gGame.markedCount--

    } else if (gflags) {
        cell.isMarked = true
        elCell.innerHTML = '🏳️'
        elCell.classList.add(`mark`)
        gGame.markedCount++
        checkGameOver()
    } else {
        return
    }
    gflags = gLevel.MINES - gGame.markedCount
    document.querySelector('.flags').innerHTML = gflags
}

function checkGameOver() {
    var nonMineCells = (gLevel.SIZE ** 2) - gLevel.MINES

    if (gGame.shownCount === nonMineCells && gGame.markedCount === gLevel.MINES) {
        console.log('win')
        gGame.isOn = false
        showModal('You Won!')
    }
}

function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMarked && !cell.isMine) {
                renderCell(i, j, '❌')
            }
            if (cell.isMine) renderCellClass(i, j, 'shown')
        }
    }
    showModal('Game Over!')
}

function resetGame() {
    const elBtn = document.querySelector(`.reset`)
    elBtn.innerHTML = '😃'
    clearInterval(gTimerInterval)
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gflags = gLevel.MINES
    LIVES = 3
    renderStats()
}

function showModal(msg) {
    var elModal = document.querySelector('.modal')
    const elMsg = elModal.querySelector('h2')

    elMsg.innerText = msg
    elModal.classList.remove('hidden')
    clearInterval(gTimerInterval)
    gGame.isOn = false
    console.log('gGame.isOn', gGame.isOn)
}

function hideModal() {
    var elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}


function renderCell(idx, jdx, value, addClass) {
    // Select the elCell and set the value and class
    const elCell = document.querySelector(`[data-i="${idx}"][data-j="${jdx}"]`)
    elCell.innerHTML = value
    elCell.classList.add(addClass)
}

function renderCellClass(idx, jdx, addClass) {
    const elCell = document.querySelector(`[data-i="${idx}"][data-j="${jdx}"]`)
    elCell.classList.add(addClass)
}

function renderStats() {
    const elLives = document.querySelector('.LIVES')
    // const elOnBoard = document.querySelector('.on-board')

    elLives.innerHTML = LIVES
    // elCollected.innerHTML = gCollected

    document.querySelector('.timer').innerHTML = gGame.secsPassed
}

function startTimer() {
    gStartTime = Date.now()
    clearInterval(gTimerInterval)
    gTimerInterval = setInterval(timerTick, 101)
}

function timerTick() {
    var timePassed = Date.now() - gStartTime
    gGame.secsPassed = parseInt(timePassed / 1000)
    document.querySelector('.timer').innerHTML = gGame.secsPassed
}