import "module-alias/register";
import express, { Express } from "express";
import dotenv from "dotenv";
import "@app/global/sequelize";
import registerRoutes from "@app/router";
import { PORT } from "@app/constants/global";
import initKernel from "@app/kernel";

// import "./cli/sql/table-post";
// import "./cli/sql/table-user"
// import "./cli/sql/table-message";

dotenv.config();

const app: Express = express();
initKernel(app);

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

registerRoutes(app, server);
