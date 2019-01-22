const express=require('express');

let server = new express();

server.use(express.static('./upload'))

server.listen(8080)