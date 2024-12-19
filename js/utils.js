'use strict'

function renderBoard1(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function playSound(sorc) {
    const sound = new Audio(`sound/${sorc}.mp3`)
    sound.play()
}

function findEmptyPos(board, idx, jdx) {
    var emptyPoss = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell.isMine || (i === idx && j === jdx)) continue
            var pos = { i: i, j: j }
            emptyPoss.push(pos)
        }
    }

    if (emptyPoss.length === 0) return null
    var randIdx = getRandomInt(0, emptyPoss.length)
    var emptyPos = emptyPoss[randIdx]
    return emptyPos
}


function drawNum2() {
    var idx = getRandomInt(0, gNums2.length)
    var num = gNums2[idx]

    gNums2.splice(idx, 1)
    return num
}

function updateNeighboring() {
    var negCount = 0

    for (var i = gGamerPos.i - 1; i <= gGamerPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = gGamerPos.j - 1; j <= gGamerPos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === gGamerPos.i && j === gGamerPos.j) continue

            if (gBoard[i][j].gameElement === BALL) negCount++
        }
    }
    document.querySelector('.neighboring').innerHTML = '' + negCount
    return negCount
}


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
