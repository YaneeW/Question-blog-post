import fs from "fs/promises";

const logging = async (req, res, next) => {
  try {
    const text = `\nIP: ${req.ip},Method: ${req.method}, Endpoint: ${req.originalUrl}`;
    await fs.appendFile("logs.text", text);
    console.log(text);
  } catch {
    await fs.appendFile(
      "logs.text",
      `\nLogging Error on IP: ${req.ip},Method: ${req.method}, Endpoint: ${req.originalUrl}`
    );
  }
  next();
};

export default logging;
