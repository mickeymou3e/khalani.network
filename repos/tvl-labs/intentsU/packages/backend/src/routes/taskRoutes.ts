import { Request, Response, Router } from "express";
import { Db } from "mongodb";

const router = Router();

router.get("/tasks", async (req: Request, res: Response) => {
  const db = req.db as Db;
  if (!db) {
    return res.status(500).json({ message: "Database not available" });
  }

  try {
    const tasksCollection = db.collection("tasks");
    const tasks = await tasksCollection.find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Failed to retrieve tasks:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Add other task routes (POST, PUT, DELETE) here similarly

export default router;
