import { Sequelize } from "sequelize";

const sequelize = new Sequelize("my-test-db", "root", "", {
  dialect: "mariadb",
});

(async function initSequelize() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
