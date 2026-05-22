require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get("/", (req, res) => {
  res.json({
    message: "Vercel API running 🚀"
  });
});

app.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price");

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

module.exports = app;