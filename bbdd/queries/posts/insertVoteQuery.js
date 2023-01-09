const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const insertVoteQuery = async (value, idUser, idPost, timestamp) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos si ya se ha votado esta entrada.
    const [votes] = await connection.query(
      `SELECT id FROM rate WHERE idUser = ? AND idPost = ?`,
      [idUser, idPost]
    );

    if (votes.length > 0) {
      throw generateError("Ya has votado esta entrada", 403);
    }

    // Insertamos el voto.
    await connection.query(
      `
                INSERT INTO rate (value, idPost, idUser, createdAt) 
                VALUES (?, ?, ?, ?)
            `,
      [value, idUser, idPost, timestamp]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertVoteQuery;
