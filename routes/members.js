const express = require("express");
const router = express.Router();
const authorize = require("../middleware/auth");
const ShoppingList = require("../models/ShoppingList");

// Add a member
router.post("/add", authorize("Owner"), async (req, res) => {
  const { shoppingListId, memberName } = req.body;

  if (!shoppingListId || !memberName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    shoppingList.members.push({ name: memberName });
    await shoppingList.save();
    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a member
router.delete("/:shoppingListId/:memberId", authorize("Owner"), async (req, res) => {
  const { shoppingListId, memberId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    shoppingList.members = shoppingList.members.filter((m) => m._id.toString() !== memberId);
    await shoppingList.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Member leaves the shopping list
router.delete("/:shoppingListId/leave", authorize("Member"), async (req, res) => {
  const { shoppingListId } = req.params;
  const memberId = req.headers["member-id"];

  if (!memberId) {
    return res.status(400).json({ error: "Member ID is required in headers" });
  }

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    shoppingList.members = shoppingList.members.filter((m) => m._id.toString() !== memberId);
    await shoppingList.save();

    res.status(200).json({ status: "success", message: "You have left the shopping list" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
