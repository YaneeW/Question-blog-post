import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionsRouter = Router();

questionsRouter.get("/", async (req, res) => {
  const title = req.query.title;
  const categories = req.query.categories;
  const query = {};

  if (categories) {
    query.categories = new RegExp(categories, "i");
  }
  if (title) {
    query.title = new RegExp(title, "i");
  }
  const collection = db.collection("questionPosts");
  const questionData = await collection
    .find(query)
    .sort({ created_time: -1 })
    .toArray();
  return res.json({ data: questionData });
});

questionsRouter.get("/:questionID", async (req, res) => {
  try {
    const questionID = new ObjectId(req.params.questionID);
    const collection = db.collection("questionPosts");
    const hasFound = await collection.findOne({ _id: questionID });
    if (!hasFound) {
      return res.status(404).json({
        message: `Question id:${questionID} not found`,
      });
    }
    const questionData = await collection.find({ _id: questionID }).toArray();
    return res.json({ data: questionData[0] });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!, Please check id and try again",
    });
  }
});

questionsRouter.post("/", async (req, res) => {
  const collection = db.collection("questionPosts");
  const questionData = {
    ...req.body,
    created_time: new Date(),
  };
  await collection.insertOne(questionData);
  return res.json({
    message: "Question has been created successfully",
  });
});

questionsRouter.put("/:questionID", async (req, res) => {
  try {
    const collection = db.collection("questionPosts");
    const questionID = new ObjectId(req.params.questionID);
    const hasFound = await collection.findOne({ _id: questionID });
    if (!hasFound) {
      return res.status(404).json({
        message: `Question ${questionID} not found`,
      });
    }
    if (Object.keys(req.body).length === 0) {
      return res.json({
        message: "New update question does not exist",
      });
    }
    const newQuestionData = { ...req.body, edit_time: new Date() };
    await collection.updateOne(
      {
        _id: questionID,
      },
      {
        $set: newQuestionData,
      }
    );
    return res.json({
      message: "Question has been changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!, Please check id and try again",
    });
  }
});

questionsRouter.delete("/:questionID", async (req, res) => {
  try {
    const collection = db.collection("questionPosts");
    const questionID = new ObjectId(req.params.questionID);
    const hasFound = await collection.findOne({ _id: questionID });

    if (!hasFound) {
      return res.status(404).json({
        message: `Question ${questionID} not found`,
      });
    }
    await collection.deleteOne({
      _id: questionID,
    });
    return res.json({
      message: "Question has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!, Please check id and try again",
    });
  }
});

export default questionsRouter;
