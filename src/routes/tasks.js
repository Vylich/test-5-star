import express from "express";
import Task from "../models/Task.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware для проверки токена
const authenticate = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(401).send("Unauthorized");
    req.userId = decoded._id;
    next();
  });
};

// Создание задачи
router.post("/", authenticate, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.userId });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Получение задач пользователя
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Обновление задачи
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true },
    );
    if (!task) return res.status(404).send("Task not found");
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Удаление задачи
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) return res.status(404).send("Task not found");
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
