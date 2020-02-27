(function() {
  "use strict";

  const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

  const events = {
    in: {
      JOIN_GAME: "s2cJoinGame",
      MARK: "s2cMark",
      SET_TURN: "s2cSetTurn",
      GAME_OVER: "s2cGameOver",
      ERROR: "s2cError",
      QUIT: "s2cQuit"
    },
    out: {
      JOIN_GAME: "c2sJoinGame",
      MARK: "c2sMark",
      QUIT: "c2sQuit"
    }
  };

  let scoreBoard;
  let board;
  let thisPlayer = {};

  $(document).ready(() => {
    scoreBoard = [$("#p1score"), $("#p2score")];
    board = new Board(scoreBoard);
    board.onMark = (playerId, cellId) => {
      //TODO T3: Senden Sie events.out.MARK mit Hilfe von socket.send und makeMessage und 
      //übergeben Sie playerId und cellId als Parameter; als Beispiel sehen Sie sich JOIN_GAME
      //auf Zeile 43 an
    };
    $("#start-button").click(onStartClicked);
  });

  function onStartClicked() {
    const name = $("#nickname").val().trim();

    if (name.length > 0) {
      thisPlayer.name = name;
      document.title = document.title + " - " + name;
      socket.send(makeMessage(events.out.JOIN_GAME, { playerName: name }));
      $("#username-section").hide();
    }
  }

  function makeMessage(action, data) {
    const response = {
      action: action,
      data: data
    };
    return JSON.stringify(response);
  }

  function startGame() {
    if (board.players.length === 1) {
      scoreBoard[1].html("warte auf Gegner...");
    }
    $("#game-section").css("visibility", "visible");
    board.disableAll();
  }

  socket.onmessage = function(event) {
    const msg = JSON.parse(event.data);

    switch (msg.action) {
      case events.in.ERROR:
        board.showGameStatus(`Fehler: ${msg.data}`);
        break;
      case events.in.JOIN_GAME:
        board.addPlayer(msg.data);
        if (msg.data.name.playerName === thisPlayer.name) {
          thisPlayer = msg.data;
          startGame();
        }
        break;
      case events.in.MARK:
        //TODO T3: rufen Sie board.doMark mit der cellId und dem player label auf
        break;
      case events.in.SET_TURN:
        board.highlightScoreboard(msg.data);
        board.ready = true;
        if (msg.data.id === thisPlayer.id) {
          board.enableTurn();
        }
        break;
      case events.in.GAME_OVER:
        if (msg.data.player) {
          board.doWinner(msg.data.player);
        } else {
          board.doDraw();
        }
        socket.send(makeMessage(events.out.QUIT, thisPlayer.id));
        break;
      case events.in.QUIT:
        socket.close();
        break;
    }
  };
})();
