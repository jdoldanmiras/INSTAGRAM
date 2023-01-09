const insertPostQuery = require("../../bbdd/queries/posts/insertPostQuery");

const { generateError, savePhoto } = require("../../helpers");

const newPost = async (req, res, next) => {
  try {
    const { image, place, text } = req.body;

    if (!place || !text) {
      throw generateError("Faltan campos", 400);
    }

    const timestamp = new Date();

    let imageName, idPost;
    // Si "req.files" tiene fotos las guardamos.
    if (req.files && Object.keys(req.files).length > 0) {
      //Object.values(req.files)[0]
      // Recorremos las fotos y por si las moscas nos quedamos únicamente
      // con las tres fotos.
      for (const photoData of Object.values(req.files).slice(0, 1)) {
        imageName = await savePhoto(photoData, 1);
        // Guardamos la foto en la base de datos.
        // await insertPhotoQuery(image, idPost);
        // Insertamos la entrada y obtenemos el id que se le ha asignado
        // en la base de datos.
        idPost = await insertPostQuery(
          imageName,
          place,
          text,
          timestamp,
          req.user.id
        );
      }
    }

    res.send({
      status: "ok",
      data: {
        post: {
          id: idPost,
          imageName,
          place,
          text,
          idUser: req.user.id,
          createdAt: timestamp,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newPost;
