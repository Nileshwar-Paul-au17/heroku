const express = require('express')

const { MongoClient ,ObjectId } = require('mongodb') //Importing MongClient and ObjectID from mongdb package

// mongoclient will use to connect the database n ObjectId will use to get the data by Uniquq Id in REST api get request


const dbURL = `mongodb+srv://paul:k9jlqNaq27EbmVif@cluster0.gltre.mongodb.net/BookDetails?retryWrites=true&w=majority`
const client = new MongoClient(dbURL)


let db = null
let collectionRef = null

async function init(){
    //connect to the database
    await client.connect()

    //get reference of the database by the name
    db = client.db('BookDetails')

    //get the reference of collection from the database
    collectionRef = db.collection('bookinfo')
}

init()

const app = express()

app.use(express.urlencoded({extended: true}))

app.post('/books' , async ( req , res ) => {  //REST API's Second functionality

    console.log(req.body)

    //inserting the data into my database
    const insertResult = await collectionRef.insertOne(req.body)

    res.send(insertResult)
})


//k9jlqNaq27EbmVif
app.get('/books', async (req, res) => { //REST API's first functionality

    const data = await collectionRef.find({}).toArray()

    res.send(data)

})


//get specific product
app.get('/books/:uniqueId', async (req, res) => {  //REST API's 5th functionality


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

//update specific product
app.put('/books/:uniqueId', async (req, res) => { //REST APIS  3rd Functionality


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


app.listen(4000, () => { //Starting the Server
    console.log('Server Started!!!!')
})
 