const db = require('mongoose');

const productStore = new db.Schema({
    name: String,
    price: String,
    category:String,
    company: String
});


module.exports = db.model('productstores',productStore);
