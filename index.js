const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
// const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
//middle ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xgyce0q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req,res,next){
//    const authHeader = req.headers.authorization;
//    if(!authHeader){
//       res.status(401).send({message: 'unauthorized access'})
//    }
//    const token = authHeader.split(' ')[1]; 
//    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//       if(err){
//          res.status(401).send({message: 'Forbidden access'})
//       }
//       req.decoded = decoded
//       next()
//    })
//  }
async function run(){
    try{
         const serviceCollection = client.db('trueCare').collection('services')
         const reviewCollection = client.db('trueCare').collection('reviews')

         // app.post('/jwt', (req,res) =>{
         //    const user = req.body
         //    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1d'})
         //    res.send({token})
         // })

         app.get('/services', async( req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services =  (await cursor.limit(3).toArray());
            // const reversed = [...services].reverse();
            res.send(services)
         })
         app.get('/allServices', async( req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
         })

         app.get('/services/:id', async( req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
         })
         app.post('/services', async(req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(result)
         }) 

         //review services
         app.get('/reviews', async(req, res) => {
            // const decoded = req.decoded;
            // if(decoded.email !== req.query.email){
            //    res.status(403).send({message: 'unauthorized access'})
            // }
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
         })
 
         app.get('/reviews/:id', async( req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.findOne(query)
            res.send(result)
         })
          
         app.post('/reviews', async(req, res) =>{
            
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
         }) 
         //update messege
         app.put('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                  message : user.message
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedUser, option);
            res.send(result);
         }) 
         app.delete('/reviews/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
         }) 
    }
    finally{

    }
}

run().catch(err => console.log(err))

app.get('/', (req, res)=>{
    res.send("true care server is running")
})

app.listen(port, () =>{
    console.log(`true server is running on ${port}`)
})