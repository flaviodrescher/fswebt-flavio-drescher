class Board {
  constructor(scoreBoard) {
    this.players = [];
    this.ready = false;
    this.scoreBoard = scoreBoard;
    this.init();
  }

  init() {
    const $squares = $("td");
    $squares.click(event => {
      this.mark(event);
    });
  }

  doWinner(player) {
    this.showGameStatus(`${player.name.playerName} hat gewonnen!`);
    this.disableAll();
  }

  showGameStatus(status) {
    $("#game-status").text(status);
  }

  doDraw() {
    this.showGameStatus("Wir haben ein Unentschieden!");
  }

  enableAll() {
    $("td").addClass("active");
  }

  disableAll() {
    $("td").removeClass("active");
  }

  enableTurn() {
    this.enableAll();
  }

  mark(event) {
    const $square = $(event.target);

    if (this.ready && $square.hasClass("active")) {
      $square.removeClass("active");
      const sign = this.getCurrentPlayer();
      $square.append("<div class=" + sign + "-label" + ">" + sign + "</div>");
      const playerId = parseInt($(".current-player").data("playerid"));
      const cellId = parseInt($square.attr("id"));
      this.onMark(playerId, cellId);
      this.disableAll();
    }
  }

  highlightScoreboard(player) {
    this.scoreBoard.forEach(sb => {
      sb.removeClass("current-player");
    });
    this.scoreBoard[player.id - 1].addClass("current-player");
  }

  getCurrentPlayer() {
    return $(".current-player").data("sign");
  }

  doMark(cellId, sign) {
    const $square = $("#" + cellId);
    $square.html("<div class=" + sign + "-label" + ">" + sign + "</div>");
  }

  getCellContent(cellId) {
    return $("td").get(cellId).textContent;
  }

  isNewPlayer(player) {
    return this.players.filter(p => p.id === player.id).length === 0;
  }

  addPlayer(player) {
    if (this.players.length < 2 && this.isNewPlayer(player)) {
      this.players.push(player);
      this.ready = this.players.length === 2;

      const $playerScore = this.scoreBoard[this.players.length - 1];
      if (this.players.length === 1) {
        $playerScore.html(player.label + " " + player.name.playerName);
      } else {
        $playerScore.html(player.name.playerName + " " + player.label);
      }
      $playerScore.data("sign", player.label);
      $playerScore.data("playerid", player.id);

      if (this.ready) {
        this.enableAll();
      }
    }
  }
}
