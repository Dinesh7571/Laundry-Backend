const express = require("express");
const router = express.Router();
const Service = require("../models/service");

// Get all services
router.get("/", async (req, res) => {
    try {
        const services = await Service.find().sort("name");
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

//Adding new category
router.post("/", async (req, res) => {
    try {
        const service = new Service({
            name: req.body.name,
            image: req.body.image,
        });

        await service.save();
        res.status(201).json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
