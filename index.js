const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwezd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("E-learning working");
});

client.connect((err) => {
  const videoCollection = client.db("E-learning").collection("videos");

  app.post("/videos", (req, res) => {
    const newVideo = req.body;
    console.log("new video:", newVideo);
    videoCollection.insertOne(newVideo).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/videos", (req, res) => {
    videoCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get('/videos/:title',(req,res)=>{
    videoCollection.find({title:req.params.title})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
})

});

app.listen(process.env.PORT || 5000);
