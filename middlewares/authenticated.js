import { jwt } from "../utils/index.js";

function asureAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ msg: "La petición no tiene la cabecera de autenticación" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.decoded(token);
    
    if (!payload) {
      return res.status(401).send({ msg: "Token inválido" });
    }

    const hasExpired = jwt.hasExpiredToken(token);

    if (hasExpired) {
      return res.status(401).send({ msg: "El token ha expirado" });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Error al procesar el token" });
  }
}

export const mdAuth = {
  asureAuth,
};
