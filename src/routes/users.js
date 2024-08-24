import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Регистрация пользователя
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Аутентификация пользователя
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).send("Invalid credentials");
    }
    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "1h" });
    res.send({ token });
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
