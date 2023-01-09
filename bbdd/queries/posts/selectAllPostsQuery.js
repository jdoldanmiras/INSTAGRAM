const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectAllPostsQuery = async (idUser, keyword = "") => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.id, P.text, P.image, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS rate, P.idUser = ? AS owner, P.createdAt
                FROM post P
                LEFT JOIN rate R ON P.id = R.idPost
                WHERE P.text LIKE ?
                GROUP BY P.id
            `,
      [idUser, `%${keyword}%`]
    );

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return posts;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllPostsQuery;
