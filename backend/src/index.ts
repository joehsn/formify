import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(express.json());
// TODO: implement CORS functionality
// app.use(cors({}))

app.get("/", (_, res) => {
  res.status(200).json({
    Message: "Formify is running",
  });
});

app.listen(process.env.PORT, () =>
  console.log(
    `Formify server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
  ),
);
