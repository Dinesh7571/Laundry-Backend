const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./db/connectDB");

const app = express();
const PORT = process.env.PORT || 5000;

// import routes
const userRoutes = require("./routes/users");
const serviceRoutes = require("./routes/service");
const productsRoutes = require("./routes/products");


// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/service", express.static(__dirname + "/upload/service"));
app.use("/profile", express.static(__dirname + "/upload/profiles"));
app.use("/products", express.static(__dirname + "/upload/products"));


// adding routes
app.use("/api/user", userRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
    console.log(`Laundry server is running on PORT: ${PORT}`);
});
