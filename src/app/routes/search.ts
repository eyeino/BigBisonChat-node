import express = require("express");
import { searchUsers } from "../../database";

const searchRouter = express.Router();

searchRouter.get("/users/:query", async (req, res) => {
  const usernameResults = await searchUsers(req.params.query + "%");
  res.json(usernameResults);
});

export { searchRouter };
