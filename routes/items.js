const express = require("express");
const router = express.Router();
const authorize = require("../middleware/auth");
const ShoppingList = require("../models/ShoppingList");

// Add an item
router.post("/add", authorize("Member"), async (req, res) => {
  const { shoppingListId, itemName, quantity } = req.body;

  if (!shoppingListId || !itemName || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const newItem = { name: itemName, quantity, status: "unresolved" };
    shoppingList.items.push(newItem);
    await shoppingList.save();

    res.status(201).json({ status: "success", itemId: shoppingList.items.slice(-1)[0]._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item
router.delete("/:shoppingListId/:itemId", authorize("Owner"), async (req, res) => {
  const { shoppingListId, itemId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    shoppingList.items = shoppingList.items.filter((item) => item._id.toString() !== itemId);
    await shoppingList.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle item status
router.put("/:shoppingListId/:itemId", authorize("Member"), async (req, res) => {
  const { shoppingListId, itemId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Missing required status field" });
  }

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const item = shoppingList.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    item.status = status;
    await shoppingList.save();

    res.status(200).json({ status: "success", updatedStatus: status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
