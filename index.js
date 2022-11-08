const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
//middle ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xgyce0q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run(){
    try{
         const serviceCollection = client.db('trueCare').collection('services')

         app.get('/service', async( req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
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