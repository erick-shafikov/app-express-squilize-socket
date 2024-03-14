import Post from "@app/models/post";

(async () => {
  await Post.sync({ alter: true });
})();
