import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "./src/routes/users.js";
import taskRoutes from "./src/routes/tasks.js";

const app = express();
app.use(bodyParser.json());

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost/task-manager").then(() => {
  console.log("Connected to MongoDB");
});

// Маршруты
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
