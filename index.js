const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.np0as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("cradleShop");
        const serviceCollection = database.collection("products");

        //GET Api
        app.get("/services", async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        const reviewCollection = database.collection("review");
        // POST review
        app.post("/review", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json({ result });
        });
        // GET for review
        app.get("/review", async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            console.log(reviews);
            res.send(reviews);
        });

        const orderCollection = database.collection("order");

        // POST API
        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json({ result });
        });
        app.get("/order", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const getOrders = await cursor.toArray();
            res.send(getOrders);
        });

        // GET to get all orders.
        app.get("/allOrders", async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        app.post("/productAdded", async (req, res) => {
            const product = req.body;
            const result = await serviceCollection.insertOne(product);
            res.json({ result });
        });
        // DELETE API
        app.delete("/deleteOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log("deleting user with id ", result);

            res.json(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log("Server is running at port", port);
});
