const mongoose = require("mongoose");

// connect to db
mongoose
    .connect(process.env.DATABASE, {})
    .then(() => console.log("DB laundry-app is  Connected..."))
    .catch((err) => console.log(`DB Connection Error : ${err}`));
