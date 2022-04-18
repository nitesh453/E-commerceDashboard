const db = require('mongoose')
  
const url ='mongodb://localhost:27017/ecom';

    db.connect(url,()=>{
        console.log('database connected');
    })