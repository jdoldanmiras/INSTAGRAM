const selectAllPostsQuery = require("../../bbdd/queries/posts/selectAllPostsQuery");

const listPosts = async (req, res, next) => {
  try {
    // Obtenemos la palabra que queremos filtrar.
    const { keyword } = req.query;

    const posts = await selectAllPostsQuery(req.user?.id, keyword);

    res.send({
      status: "ok",
      data: {
        posts,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = listPosts;
