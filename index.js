const express = require('express');
const Users = require('./db/users');
const app = express();
require('./db/config')
const Product =require('./db/Product')
const cores  = require('cors')
const jwt = require('jsonwebtoken')

app.use(express.json())

const jwtKey = 'ecom';
// const connectdb = async ()=>{
//     db.connect(url);
//     const productSchema = new db.Schema({});
//     const product =db.model('products',productSchema);
//     const data = await product.find();
   
//     console.log(data);
// }
//  connectdb();
 app.use(cores());

app.post('/register',async(req,res)=>{
    let user = new Users(req.body);
    let result = await user.save();
    result = result.toObject();                  //object me convert karke password delete kar diya
    delete result.password
    jwt.sign({result},jwtKey,{expiresIn : "2h"},(err,token)=>{

        if(err){
            res.send('something went wrong')
        }
        res.send({result, auth: token})
    });
})
app.post('/login',async(req,res)=>{
    if(req.body.gmail && req.body.password) {
        let user = await Users.findOne(req.body).select('-password')
        if(user){
           jwt.sign({user},jwtKey,{expiresIn : "2h"},(err,token)=>{

               if(err){
                   res.send('something went wrong')
               }
               res.send({user, auth: token})
           });
              
              
            // res.send(user)
            // console.log({token: token});
            
        }else{
            res.send('user not found')
        }
    }
    
})

app.post('/add-product',varifytoken, async(req,res)=>{
   let  product = new Product(req.body)
   let result = await product.save();
   res.send(result)
})

app.get('/products',varifytoken, async(req,res)=>{
  let products = await Product.find();
  if(products.length>0){
      res.send(products)
  }
  else {
      res.send('no product found')
  }
})

app.delete('/product/:id',varifytoken, async(req,res)=>{
    const result = await Product.deleteOne({_id:req.params.id})
  res.send(result)
})

app.get('/product/:id',varifytoken, async(req,res)=>{
    let result = await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }else {
        res.send('enter correct id')
    }
})

app.put('/product/:id',async(req,res)=>{
     let result = await Product.updateOne(
         {_id:req.params.id},
         {
            $set: req.body
         }
        )
     res.send(result)   
})

app.get('/search/:key', async (req,res)=>{
    let result = await Product.find({
        "$or" : [
            {name:{$regex :req.params.key}}, 
            {company:{$regex: req.params.key}}
        ]
    });
    
    res.send(result)
})

function varifytoken(req,res,next){
  let token =  req.headers['authorization'];

  console.log(token);
  if(token){
        let result= jwt.verify(token,jwtKey)
         console.log(result);
        
  }else {
    res.send('please add the token with headers')
}
//   if(token){
//       token = token.split(' ');
//       console.log(token);
//       jwt.verify(token,jwtKey,(err,valid)=>{
//           if(err){
//             res.status(401).send('please provide valid token')
//           }else {
//            next();
//           }
//       })
//   } else {
//       res.send('please add the token with headers')
//   }
    next();
}
app.get('/',(req,res)=>{
    res.send('hello from express')
})

app.listen(8000,()=> console.log('listening 8000'))