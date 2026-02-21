const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE NOTE
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.create({
    title,
    content,
    user: req.user.id,
  });

  res.json(note);
});

// GET ALL NOTES OF LOGGED-IN USER
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role === "admin") {
    // Admin sees all notes
    const notes = await Note.find();
    return res.json(notes);
  }

  // Normal user sees only their notes
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// UPDATE NOTE
router.put("/:id", authMiddleware, async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;

  await note.save();
  res.json(note);
});

// DELETE NOTE
router.delete("/:id", authMiddleware, async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  // If not admin AND not owner → deny
  if (
    req.user.role !== "admin" &&
    note.user.toString() !== req.user.id
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await note.deleteOne();
  res.json({ message: "Note deleted" });
});
module.exports = router;