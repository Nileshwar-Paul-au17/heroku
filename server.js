const express = require('express')
const { MongoClient ,ObjectId } = require('mongodb')
const dbURL = `mongodb+srv://paul:k9jlqNaq27EbmVif@cluster0.gltre.mongodb.net/BookDetails?retryWrites=true&w=majority`
const client = new MongoClient(dbURL)
const app = express()
let db = null
let collectionRef = null
const port_num = process.env.PORT || 4000
app.listen(port_num , () => { //Starting the Server
    console.log('Server Started!!!!')
})
async function init(){
    //connect to the database
    await client.connect()

    //get reference of the database by the name
    db = client.db('BookDetails')

    //get the reference of collection from the database
    collectionRef = db.collection('bookinfo')
}
init()
app.use(express.urlencoded({extended: true}))
app.post('/books' , async ( req , res ) => {  
    //inserting the data into my database
    const insertResult = await collectionRef.insertOne(req.body)
    res.send(insertResult)
})
app.get('/books', async (req, res) => { 
    const data = await collectionRef.find({}).toArray()
    res.send(data)
})
app.get('/books/:uniqueId', async (req, res) => {
    await client.connect()
    let dbRef = client.db('BookDetails')
    const productColRef = dbRef.collection('bookinfo')
    const idObj = new ObjectId(req.params.uniqueId)
    const product = await productColRef.findOne({ "_id": idObj })
    res.json(product)
})
app.delete('/books/:uniqueId', async (req, res) => { //REST APIS  4th Functionality
    await client.connect()
    let dbRef = client.db('BookDetails')
    const productColRef = dbRef.collection('bookinfo')
    const idObj = new ObjectId(req.params.uniqueId)
    const product = await productColRef.deleteOne({ "_id": idObj })
    res.json(product)
})
app.put('/books/:uniqueId', async (req, res) => {
    await client.connect()
    let dbRef = client.db('BookDetails')
    const productColRef = dbRef.collection('bookinfo')
    const newData =  req.body
    const idObj = new ObjectId(req.params.uniqueId)
    const insertedResult = await productColRef.updateOne({_id: idObj}, {$set: newData })
    res.json(insertedResult)
})
app.get('/', (req, res) => { // To get the Home page  
    res.sendFile(`${__dirname}/survey.html`)
})
