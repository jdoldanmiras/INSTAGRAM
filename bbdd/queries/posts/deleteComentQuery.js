const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteComentQuery = async (idUser, idComent) => {
  let connection;

  try {
    connection = await getConnection();

    // Seleccionamos el comentario.
    const [Coment] = await connection.query(
      `SELECT idUser FROM coments WHERE id = ?`,
      [idComent]
    );

    // Comprobamos si la persona que está intentando eliminar el comentario
    // es la propietaria del comentario.
    if (Coment[0].idUser !== idUser) {
      throw generateError("No tienes suficientes permisos", 401);
    }

    // Borramos el comentario.
    await connection.query(`DELETE FROM coments WHERE id = ?`, [idComent]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteComentQuery;
