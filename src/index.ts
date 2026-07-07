import express from "express";
import "dotenv/config";
import { S3 } from "aws-sdk";

const app = express();

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID!,
  secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  endpoint: process.env.ENDPOINT!,
});

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  console.log(id);

  const filePath = req.path;
  console.log(filePath);

  const content = await s3
    .getObject({
      Bucket: "vercel",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
      ? "text/css"
      : "application/javascript";
  res.set("content-type", type);
  res.send(content.Body);
});

app.listen(3001);
