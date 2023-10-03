import passport from "passport";
import ProductManager from "../persistence/daos/mongodb/managers/product.manager.js";

const productManager = new ProductManager();

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (error, user, info) {
        if (error) return next(error);
        if (!user)
          return res.status(401).send({ error: `Error de credencial` });
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

// ! Función para redireccionar si el usuario esta logueado.
export const passportCallRedirect = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (error, user, info) {
        if (user) {
          req.user = user;
          return res.redirect("/products");
        }
        next();
      }
    )(req, res, next);
  };
};

export const authorizationRole = (roles) => {
  return async (req, res, next) => {
    const { role } = req.user;
    if (!role) return res.status(401).send({ error: `Unauthorizad` });
    if (!roles.includes(role))
      return res.status(403).send({ error: `No permissions` });
    next();
  };
};

//const authHeader = req.usser("Authorization")

export const checkOwnershipOrAdmin = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;

  try {
    const product = await productManager.getById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    if (product.owner.toString() === userId.toString() || req.user.role === "admin") {
      req.product = product;
      next();
    } else {
      return res
        .status(403)
        .json({ message: "No tienes permiso para realizar esta acción." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al verificar el propietario." });
  }
};
