import Message from "@app/models/message";

(async () => {
  await Message.sync({ alter: true });
})();
