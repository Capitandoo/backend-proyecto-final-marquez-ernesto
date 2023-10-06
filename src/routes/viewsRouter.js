import { Router } from "express";
import passport from "passport";
import ProductManager from "../persistence/daos/mongodb/managers/product.manager.js";
import CartDao from "../persistence/daos/mongodb/managers/cart.manager.js";
import UserManager from "../persistence/daos/mongodb/managers/user.manager.js";
import { passportCallRedirect, passportCall } from "../middlewares/sessions.js";

const router = Router ();
const productManager = new ProductManager ();
const userManager = new UserManager ();

router.get("/", async (req, res) => {
  res.render("login");
})

router.get("/login",  async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/perfil", passport.authenticate ("jwtCookies"), async (req, res) => {
  const {userId} = req.user;
  const userData = await userManager.getById (userId);
  res.render ("perfil", {
    userData: userData.toJSON(),
  });
});

router.get("/productos", passport.authenticate ("jwtCookies"), async (req, res) => { 
  const {userId} = req.user;
  const userData = await userManager.getById (userId);
  const productos = await productManager.getAll();
  res.render ("productos", {
    userData: userData.toJSON(),
    productos: productos.docs.map(product=>product.toJSON()),
  })
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/login");
});

router.get('/error-registro',(req,res)=>{
  res.render('errorRegistro')
})

router.get('/error-login',(req,res)=>{
  res.render('errorLogin')
})


export default router;
