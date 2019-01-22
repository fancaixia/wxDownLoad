const express=require('express')

const route_index=express.Router();



route_index.get('/aaa',(req,res)=>{
    res.send('001').end();
})


module.exports= route_index;