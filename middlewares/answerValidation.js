function validateAnswerData(req, res, next) {
  const answer = String(req.body.content);
  try {
    if (answer.length > 300) {
      return res.json({
        message: "Answer must not be over 300 characters",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Error!!!",
    });
  }
}

export default validateAnswerData;
