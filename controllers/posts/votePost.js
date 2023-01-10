const selectPostByIdQuery = require("../../bbdd/queries/posts/selectPostByIdQuery");
const insertVoteQuery = require("../../bbdd/queries/posts/insertVoteQuery");

const { generateError } = require("../../helpers");

const votePost = async (req, res, next) => {
  try {
    const { idPost } = req.params;

    const { value } = req.body;

    // Obtenemos el post.
    const post = await selectPostByIdQuery(idPost);

    // Si somos los dueños del post restringimos el voto.
    if (post.idUser === req.user.id) {
      throw generateError("No puedes votar tu propio post", 403);
    }

    // Array con votos válidos.
    const validVotes = [1, 2, 3, 4, 5];

    // Si el voto no es un valor válido lanzamos un error.
    if (!validVotes.includes(value)) {
      throw generateError("Voto no válido", 400);
    }
    const timestamp = new Date();

    // Votamos el post.
    await insertVoteQuery(value, req.user.id, idPost, timestamp);

    res.send({
      status: "ok",
      message: "Voto enviado",
      createdAt: timestamp,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = votePost;
