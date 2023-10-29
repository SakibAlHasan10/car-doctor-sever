const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// MeddleWare

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.nwipcoy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const carDoctor = client.db("carDoctor").collection("services");
    const bookings = client.db("carDoctor").collection("bookings");
    // get single services data
    app.get(`/services/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await carDoctor.findOne(filter);
      res.send(result);
    });

    // bookings
    app.get(`/bookings`, async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query?.email };
      }
      const result = await bookings.find(query).toArray();
      res.send(result);
    });
    app.post(`/bookings`, async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookings.insertOne(booking);
      res.send(result);
    });
    app.delete(`/bookings/:id`, async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result= await bookings.deleteOne(query)
      res.send(result)
      // console.log(query)
    })
    // get all services data
    app.get("/services", async (req, res) => {
      const cursor = carDoctor.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running car doctor..");
});
app.listen(port, () => {
  console.log(`Running car doctor port ${port}`);
});
