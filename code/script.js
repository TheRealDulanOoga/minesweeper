import { createBoard, markTile, revealTile, checkWin, checkLose, nearbyTiles, doubleClickTile, TILE_STATUSES } from "./minesweeper.js";
import { getCookie } from "./settings.js";

console.log(getCookie("board-size"))

const BOARD_SIZE = getCookie("board-size")
const NUMBER_OF_MINES = Math.floor(Math.pow(BOARD_SIZE, 2) * getCookie("mine-amount") * .01)

var displaySettingsOptions = document.getElementById("settings-values")
displaySettingsOptions.innerHTML = "Board Size: " + BOARD_SIZE + " |----| Mines Ratio: " + getCookie("mine-amount") + "%"

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftCount = document.querySelector("[data-mine-count")
const revealedTilesCount = document.querySelector("[data-revealed-tiles-count]")
const messageText = document.querySelector(".game-over-text")
let windowHeight = window.innerHeight
let startingTile = board[1][1]
let i = 0

while (i !== 1000) {
    startingTile = board[Math.floor(Math.random() * BOARD_SIZE)][Math.floor(Math.random() * BOARD_SIZE)]
    const adjacentTiles = nearbyTiles(board, startingTile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (i >= 200) {
        location.reload()
    }
    i++
    if (mines.length === 0) {
        document.getElementById('disable-link').style.pointerEvents = ""
        revealTile(board, startingTile)
        listTilesRevealed()
        listMinesLeft()
        var play = true
        timer()
        i = 1000
    }
}

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            listTilesRevealed()
            checkGameEnd()
        });
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        });
        tile.element.addEventListener('dblclick', () => {
            doubleClickTile(board, tile)
            listTilesRevealed()
            checkGameEnd()
        });
    })
})

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftCount.textContent = NUMBER_OF_MINES - markedTilesCount
}

function listTilesRevealed() {
    const revealedTiles = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.NUMBER).length
    }, 0)

    revealedTilesCount.textContent = revealedTiles
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        play = false

        document.getElementById("game-over-nav").style.zIndex = "1"
        document.getElementById("game-over-nav").style.backgroundColor = "rgba(0,0,0,0.5)"
        document.getElementById("game-over-nav").style.color = "rgba(203, 255, 231, 1)"

        document.querySelector('.overlay').addEventListener('click', () =>{
            document.getElementById("game-over-nav").style.transitionDuration = "0.25s"
            document.getElementById("game-over-nav").style.zIndex = "-1"
            document.getElementById("game-over-nav").style.backgroundColor = "rgba(0,0,0,0)"
            document.getElementById("game-over-nav").style.color = "rgba(0,0,0,0)"
        })
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })
        boardElement.addEventListener('dbclick', stopProp, { capture: true })
    }

    if (win) {
        messageText.textContent = "You Win!"
    }

    if (lose) {
        messageText.textContent = "Game Over"
        board.forEach(row => {
            row.forEach(tile =>{
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

var boxSize = (windowHeight - 250) / (BOARD_SIZE) - 5
boardElement.style.setProperty('--size', BOARD_SIZE)
boardElement.style.setProperty('--box-size', boxSize / 12 + "vh")
boardElement.style.setProperty('--board-font-size', boxSize / 27.5 + "vh")
boardElement.style.setProperty('--board-box-radius', windowHeight / 200 / Math.ceil(Math.pow(BOARD_SIZE, .9)) + "vh")


function timer() {
    var sec = 0
    var min = 0
    var timeDisplay = "00:00"
    var timer = setInterval(function() {
        
        if (sec < 10) {
            var stringSec = "0" + sec
        } else stringSec = sec

        if (min < 10) {
            var stringMin = "0" + min
        } else stringMin = min

        timeDisplay = stringMin + ':' + stringSec

        if (play) {
            sec++
            if (sec === 60) {
                sec = 0
                min++
            }
        }
        document.getElementById('timer-display').innerHTML = timeDisplay
    }, 1000)
}

function stopProp(e) {
    e.stopImmediatePropagation()
}