const express = require("express");
const app = express();
app.use(express.json());
const userModel = require("../models/userModels");

const router = express.Router();

router.post("/send", async (req, resp) => {
  const { title, content } = req.body;
  try {
    const data = await userModel.create({
      title: title,
      content: content,
    });
    resp.status(201).json(data);
  } catch (err) {
    resp.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const data = await userModel.find();
  res.send(data);
});

router.get("/:id", async (req, res) => {
  if (req.params.id === "favicon.ico") {
    return res.status(404).send("Not Found");
  }
  try {
    const note = await userModel.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const result = await userModel.updateOne(
    { _id: id },
    { $set: { title: title, content: content } }
  );
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await userModel.deleteOne({
    _id: id,
  });
  res.send(result);
});

module.exports = router;
