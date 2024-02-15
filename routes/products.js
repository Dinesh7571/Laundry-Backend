const express = require("express");
const router = express.Router();

const Products = require("../models/products");
const Service = require("../models/service");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// getting feature products
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Products.find(
      {},
      {
        _id: 1,
        title: 1,
        price: 1,
        image: 1,
        reviews: 1,
        stock: 1,
      }
    )
      .sort({ "reviews.rate": -1, "reviews.counts": -1 })
      .limit(3);

    return res.json(featuredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to handle auto-suggestions based on search string
router.get("/suggestions", async (req, res) => {
  try {
    const search = req.query.search;
    // Use regular expression to match title or description
    const regex = new RegExp(search.toLowerCase(), "i");
    const products = await Products.find({ title: regex })
      .select("_id title")
      .limit(10); // Limit results to 10 for faster response

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Getting single product details
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Getting products information
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 50;
  const startIndex = (page - 1) * perPage;
  const queryService = req.query.service || null;
  const querySearch = req.query.search || null;

  try {
    let query = {};

    if (queryService) {
      const service = await Service.findOne({
        name: queryService,
      }).exec();

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      query.service = service._id;
    }

    if (querySearch) {
      query.title = { $regex: querySearch, $options: "i" };
    }

    const products = await Products.find(query, {
      _id: 1,
      title: 1,
      price: 1,
      image: 1,
    //  reviews: 1,
       quantity: 1,
    })
      .skip(startIndex)
      .limit(perPage);

    const totalProducts = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / perPage);

    return res.json({
      products,
      currentPage: page,
      postPerPage: perPage,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// post products
router.post("/", async (req, res) => {
  try {
    const newProduct = new Products({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity,
      service: req.body.service,
     // reviews: req.body.reviews,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// delete products by admin
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted Successfully!" });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
