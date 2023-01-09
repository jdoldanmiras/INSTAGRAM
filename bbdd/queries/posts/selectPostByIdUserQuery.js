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
    //ESTO TENDRIA QUE SER UN LOOP, PARA VER UN COMENTARIO TIENES QUE ENTRAR EN EL POST
    //const [coments] = await connection.query(
    //`SELECT id, text FROM coments WHERE idPost = ?`,
    // [idUser]
    //);

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return posts;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPostByIdUserQuery;
/*
const [posts] = await connection.query(
  `
            SELECT P.id, P.text, P.image, P.place, P.idUser, P.createdAt
            FROM user U
            LEFT JOIN post P ON U.id = P.idUser
            WHERE P.id = ?
            GROUP BY P.idUser
        `,
  [idUser]
);*/
