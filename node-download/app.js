const express = require('express');
const index = require('./route/index')

let server = new express();

server.use(express.static('./upload'))
server.use('/getFiles',index)

server.listen(8080)