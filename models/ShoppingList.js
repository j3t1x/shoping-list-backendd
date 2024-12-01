const mongoose = require("mongoose");

// Schema for members
const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Schema for items
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: "unresolved" },
});

// Schema for shopping lists
const ShoppingListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ownerId: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  members: [MemberSchema],
  items: [ItemSchema],
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
