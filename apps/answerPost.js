import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
import validateAnswerData from "../middlewares/answerValidation.js";

const answersRouter = Router();

answersRouter.get("/:questionID/answer", async (req, res) => {
  try {
    const questionID = new ObjectId(req.params.questionID);
    const collection = db.collection("questionPosts");

    const answerData = await collection
      .aggregate([
        { $match: { _id: questionID } },
        { $project: { _id: 0, answer: 1 } },
      ])

      .toArray();
    return res.json({
      data: answerData[0].answer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!, Please check id and try again",
    });
  }
});

answersRouter.get("/:questionID/answer/:answerID", async (req, res) => {
  try {
    const questionID = new ObjectId(req.params.questionID);
    const answerID = new ObjectId(req.params.answerID);
    const collection = db.collection("questionPosts");

    const answerData = await collection
      .aggregate([
        { $match: { _id: questionID } },
        { $project: { _id: 0, answer: 1 } },
        { $unwind: "$answer" },
        { $match: { "answer.id": answerID } },
      ])
      .toArray();
    return res.json({
      data: answerData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!, Please check id and try again",
    });
  }
});

answersRouter.post(
  "/:questionID/answer",
  validateAnswerData,
  async (req, res) => {
    try {
      const questionID = new ObjectId(req.params.questionID);
      const collection = db.collection("questionPosts");
      const answerData = {
        id: new ObjectId(),
        ...req.body,
        created_at: new Date(),
        upvotes: 0,
        downvotes: 0,
      };
      await collection.updateOne(
        {
          _id: questionID,
        },
        {
          $push: { answer: answerData },
        }
      );
      return res.json({
        message: "Answer has been created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "internal server error!, Please check id and try again",
      });
    }
  }
);

answersRouter.put("/:questo");

answersRouter.delete("/:questionID/answer/:answerID", async (req, res) => {
  try {
    const questionID = new ObjectId(req.params.questionID);
    const answerID = new ObjectId(req.params.answerID);
    const collection = db.collection("questionPosts");

    await collection.updateOne(
      { _id: questionID },
      { $pull: { answer: { id: answerID } } }
    );
    return res.json({
      message: "Answer has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!, Please check id and try again",
    });
  }
});
export default answersRouter;
