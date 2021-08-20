var path = window.location.pathname;
var page = path.split("/").pop();

if (page === "settings.html") {
    var boardSizeSlider = document.getElementById("board-size-slider-input")
    var boardSize = getCookie("board-size")
    var displayBoardSize = document.getElementById("display-board-size")
    document.getElementById("board-size-slider-input").value = getCookie("board-size")

    var mineAmountSlider = document.getElementById("mine-amount-slider-input")
    var mineAmount = getCookie("mine-amount")
    var displayMineAmount = document.getElementById("display-mine-amount")
    document.getElementById("mine-amount-slider-input").value = getCookie("mine-amount")

    setInterval(function() {
        boardSize = boardSizeSlider.value
        document.cookie = "board-size=" + boardSize
        displayBoardSize.innerHTML = "Choose a board size - " + boardSize + " tiles"

        mineAmount = mineAmountSlider.value
        document.cookie = "mine-amount=" + mineAmount
        displayMineAmount.innerHTML = "Choose a mine to tiles ratio - " + mineAmount + "%"
    }, 100)
    
}

export function getCookie(cookieName) {
    let name = cookieName + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c =c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}