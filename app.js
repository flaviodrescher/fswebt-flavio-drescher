const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const SocketServer = require('ws').Server;
const Board = require("./models/board");
const Player = require("./models/player");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => console.log(`Web Server Listening on ${ PORT }`));
const wss = new SocketServer({ server: httpServer });

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://mongodb/tictactoe').then(connection => {
  console.log('DB connected')
}).catch(error => {
  console.log('ERROR:', error);
});

let board = new Board();

const events = {
  incoming: {
    JOIN_GAME: "c2sJoinGame",
    MARK: "c2sMark",
    QUIT: "c2sQuit"
  },
  outgoing: {
    JOIN_GAME: "s2cJoinGame",
    MARK: "s2cMark",
    SET_TURN: "s2cSetTurn",
    OPPONENT_READY: "s2cOpponentReady",
    GAME_OVER: "s2cGameOver",
    ERROR: "s2cError",
    QUIT: "s2cQuit"
  }
};

function makeMessage(action, data) {
  const resp = {
    action: action,
    data: data
  };
  return JSON.stringify(resp);
}

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  board.on(Board.events.PLAYER_CONNECTED, () => {
    wss.clients.forEach(client => {
      board.players.forEach(player => {
        client.send(makeMessage(events.outgoing.JOIN_GAME, player));
      });
    });
  });

  board.on(Board.events.GAME_READY, player => {
    wss.clients.forEach(client => {
      client.send(makeMessage(events.outgoing.SET_TURN, player));
    });
  });

  board.on(Board.events.CELL_MARKED, event => {
    wss.clients.forEach(client => {
      client.send(makeMessage(events.outgoing.MARK, event));
    });
  });

  board.on(Board.events.CHANGE_TURN, player => {
    wss.clients.forEach(client => {
      client.send(makeMessage(events.outgoing.SET_TURN, player));
    });
  });

  board.on(Board.events.WINNER, event => {
    wss.clients.forEach(client => {
      client.send(makeMessage(events.outgoing.GAME_OVER, event));
    });
  });

  board.on(Board.events.DRAW, event => {
    wss.clients.forEach(client => {
      client.send(makeMessage(events.outgoing.GAME_OVER, event));
    });
  });

  ws.on("message", function incoming(msg) {
    try {
      msg = JSON.parse(msg);
    } catch (error) {
      ws.send(makeMessage(events.outgoing.ERROR, "Invalid action"));
      return;
    }

    try {
      switch (msg.action) {
        case events.incoming.JOIN_GAME:
          const player = new Player(
            board.players.length + 1,
            board.players.length === 0 ? "X" : "O",
            msg.data
          );
          board.addPlayer(player);
          break;
        case events.incoming.MARK:
          //TODO T3: rufen Sie board.mark auf wenn der übergebene Spieler an der Reihe
          //ist (board.checkTurn)
          break;
        case events.incoming.QUIT:
          board = new Board();
          wss.clients.forEach(client =>
            client.send(makeMessage(events.outgoing.QUIT, {}))
          );
          break;
        default:
          console.error(`Unknown action ${msg.action}`);
      }
    } catch (error) {
      ws.send(makeMessage(events.outgoing.ERROR, error.message));
    }
  });
});

console.log(`Websocket Server listening on port ${PORT}`);
