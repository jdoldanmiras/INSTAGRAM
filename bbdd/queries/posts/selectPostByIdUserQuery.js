const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectPostByIdUserQuery = async (idUser) => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.text, P.image, P.place, P.idUser, P.createdAt
                FROM user U
                INNER JOIN post P ON U.id = P.idUser
                WHERE U.id = ?
                GROUP BY P.id
            `,
      [idUser]
    );

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ningun post", 404);
    }

    return posts;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPostByIdUserQuery;
