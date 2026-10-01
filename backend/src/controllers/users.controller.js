const { findById, updatePlan } = require('../repositories/user.repository');
const { generarToken } = require('../utils/jwt');

function serializarUsuario(usuario) {
  const { id, username, email, rol, plan } = usuario;
  return { id, username, email, rol, plan };
}

async function updateMyPlanController(req, res, next) {
  try {
    const usuario = await findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (usuario.plan !== 'plus') {
      // El usuario solo puede pasar de plus a premium.
      return res.status(409).json({
        message: 'Solo se puede cambiar de plan si estás en plus',
      });
    }

    const actualizado = await updatePlan(usuario.id, 'premium');

    // El token debe reflejar el plan actualizado.
    const token = generarToken({
      id: actualizado.id,
      username: actualizado.username,
      rol: actualizado.rol,
      plan: actualizado.plan,
    });

    res.status(200).json({
      usuario: serializarUsuario(actualizado),
      token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateMyPlanController };