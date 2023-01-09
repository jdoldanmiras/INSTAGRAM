const getConnection = require("../../getConnection");

const insertPostQuery = async (imageName, place, text, timestamp, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertamos la entrada y obtenemos los datos de la misma.
    const [newPost] = await connection.query(
      `
                INSERT INTO post (text, image, place, idUser, updatedAt, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
      [text, imageName, place, idUser, timestamp, timestamp]
    );

    //console.log(newPost);

    // Retornamos el id que le ha asignado la base de datos a esta nueva entrada.
    return newPost.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertPostQuery;
