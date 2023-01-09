const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectPostByIdQuery = async (idPost) => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.id, P.text, P.image, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS votes, P.createdAt
                FROM post P
                LEFT JOIN rate R ON P.id = R.idPost
                WHERE P.id = ?
                GROUP BY P.id
            `,
      [idPost]
    );

    const [coments] = await connection.query(
      `SELECT id, text FROM coments WHERE idPost = ?`,
      [idPost]
    );

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return {
      ...posts[0],
      coments,
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPostByIdQuery;
