const bcrypt = require('bcryptjs');

const { registerSchema, loginSchema } = require('../utils/validators');
const { generarToken } = require('../utils/jwt');
const {
  findByUsernameOrEmail,
  findByUsername,
  addUser,
} = require('../repositories/user.repository');

function serializarUsuario(usuario) {
  // Excluye la contraseña de las respuestas.
  const { id, username, email, rol, plan } = usuario;
  return { id, username, email, rol, plan };
}

async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        error: error.details.map((d) => d.message),
      });
    }

    const { username, email, password } = value;

    const existente = await findByUsernameOrEmail(username, email);
    if (existente) {
      return res.status(409).json({ error: 'El usuario o email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await addUser({
      username,
      email,
      passwordHash,
      rol: 'user',
      plan: 'plus',
    });

    // Inicia la sesión junto con el registro.
    const token = generarToken({
      id: nuevoUsuario.id,
      username: nuevoUsuario.username,
      rol: nuevoUsuario.rol,
      plan: nuevoUsuario.plan,
    });

    return res.status(201).json({
      usuario: serializarUsuario(nuevoUsuario),
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details.map((d) => d.message),
      });
    }

    const { username, password } = value;
    const usuario = await findByUsername(username);

    const credencialesValidas =
      usuario && (await bcrypt.compare(password, usuario.passwordHash));

    if (!credencialesValidas) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken({
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      plan: usuario.plan,
    });

    return res.status(200).json({
      usuario: serializarUsuario(usuario),
      token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
