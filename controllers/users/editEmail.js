const updateUserEmailQuery = require("../../bbdd/queries/users/updateUserEmailQuery");
const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const bcrypt = require("bcrypt");

const { generateError, sendMail } = require("../../helpers");

const editEmail = async (req, res, next) => {
  try {
    const { email, password, newEmail, repNewEmail } = req.body;

    if (!email || !newEmail || !repNewEmail || !password) {
      throw generateError("Faltan campos", 400);
    }

    if (newEmail !== repNewEmail) {
      throw generateError("El email no coincide", 400);
    }
    // Localizamos al usuario con el email del body.
    const user = await selectUserByEmailQuery(email);

    const username = user.username;

    // Comprobamos si las contraseñas coinciden. El método compare retorna
    // true o false en función de si las contraseñas coinciden o no.
    const validPassword = await bcrypt.compare(password, user.password);

    // Si la contraseña es incorrecta lanzamos un error.
    if (!validPassword) {
      throw generateError("Contraseña incorrecta", 401);
    }
    // Actualizamos el email del usuario.
    await updateUserEmailQuery(email, newEmail);

    //Enviamos correo al nuevo email del usuario confirmando que ha realizado el cambio.
    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
            Muy buenas ${username}, se ha realizado exitosamente el cambio de correo. A partir de ahora ${newEmail} será tu nuevo correo para logearte. 
            
            
            Muchas gracias por confiar en nuestro equipo.`;

    // Enviar un email con el código de recuperación al usuario.
    await sendMail(newEmail, emailContent);

    res.send({
      status: "ok",
      message:
        "Usuario actualizado, revise su correo. En caso de no recibir el correo pongase en contacto con Asistencia al Cliente",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editEmail;
