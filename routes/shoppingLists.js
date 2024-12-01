const express = require("express");
const router = express.Router();
const authorize = require("../middleware/auth");
const ShoppingList = require("../models/ShoppingList");

// Add a new shopping list
router.post("/add", authorize("Owner"), async (req, res) => {
  const { title, description, ownerId } = req.body;

  if (!title || !ownerId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newShoppingList = new ShoppingList({
      title,
      ownerId,
    });

    await newShoppingList.save();
    res.status(201).json({ status: "success", shoppingListId: newShoppingList._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a shopping list
router.delete("/:id", authorize("Owner"), async (req, res) => {
  const { id } = req.params;

  try {
    const deletedList = await ShoppingList.findByIdAndDelete(id);
    if (!deletedList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all shopping lists
router.get("/", authorize("Owner"), async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find();
    res.status(200).json({ status: "success", shoppingLists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single shopping list
router.get("/:id", authorize("Member"), async (req, res) => {
  const { id } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(id);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.status(200).json({ status: "success", shoppingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
