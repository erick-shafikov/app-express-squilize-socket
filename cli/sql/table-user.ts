import User from "@app/models/user";

(async () => {
  await User.sync({ alter: true });
})();
