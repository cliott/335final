/*
    require("dotenv").config();
*/
const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

    const EntrySchema = new mongoose.Schema({
      text: {
        type: String,
        required: true
      }
    });

    const Entry = mongoose.model("Entry", EntrySchema);

    const router = express.Router();

    router.get("/", async (req, res) => {
      const entries = await Entry.find({});

      const apiRes = await axios.get(
        "https://dog.ceo/api/breeds/image/random"
      );

      res.render("index", {
        entries,
        image: apiRes.data.message
      });
    });

    router.post("/add", async (req, res) => {
      await Entry.create({ text: req.body.text });
      res.redirect("/");
    });

    router.post("/clear", async (req, res) => {
        await Entry.deleteMany({});
        res.redirect("/");
    });

    app.use("/", router);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );

  } catch (err) {
    console.error(err);
  }
})();