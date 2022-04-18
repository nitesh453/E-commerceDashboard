const db = require('mongoose')

const productSchema = new db.Schema({
    name :{
        type: String,
        required: true
    },
    gmail:{
        type: String,
        required:true
    },
    password:{
        type:String
    }
});


module.exports = db.model('products',productSchema);