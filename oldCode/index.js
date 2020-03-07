const app = require('express')()
const http = require('http').Server(app)
//const io = require('socket.io')(http)
const bodyParser = require('body-parser')
bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "https://jobie-96006.firebaseapp.com");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

const map = require('./maps')
map.geoMatx( app, jsonParser )

//const chat = require('./chat')
//chat.socket( io )

http.listen(process.env.PORT || 8080, () => {
  console.log('listening on *:8080');
})
