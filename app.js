import express from "express";
import { client } from "./utils/db.js";
import questionsRouter from "./apps/questionPost.js";
import logging from "./middlewares/logging.js";
import answersRouter from "./apps/answerPost.js";

async function init() {
  const app = express();
  const port = 4000;

  await client.connect();

  app.use(logging);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/question", questionsRouter);
  app.use("/question", answersRouter);

  app.get("/", (req, res) => {
    return res.json("Hello Skill Checkpoint #2");
  });

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
