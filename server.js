require("dotenv").config();
const express = require("express");
const connectDB = require("./db"); 

const app = express();
connectDB();

app.use(express.json());

// Import routes
const shoppingListsRoutes = require("./routes/shoppingLists"); 
const itemsRoutes = require("./routes/items"); 
const membersRoutes = require("./routes/members"); 

// Use routes
app.use("/shoppingLists", shoppingListsRoutes);
app.use("/items", itemsRoutes);
app.use("/members", membersRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
