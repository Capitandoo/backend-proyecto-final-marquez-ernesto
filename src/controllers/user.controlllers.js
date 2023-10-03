import Controllers from "./class.controllers.js";
import UserService from "../services/user.services.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { transporter } from "../services/email.services.js";
import config from "../../config.js";
import UserDTO from "../persistence/dtos/user/user.dto.js";
import { HttpResponse } from "../utils/http.response.js";

const userService = new UserService();
const httpResponse = new HttpResponse();

export default class UserController extends Controllers {
  constructor(){
      super(userService)
  }  
  
  getAll = async (req, res, next) => {
    try {
      const users = await userService.getAll ();
      const userDtos = users.map(user => new UserDTO(user));
      return httpResponse.Ok(res, userDtos);
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const userData = await userService.register (req.body);
      return httpResponse.Ok(res, userData);
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };  
  
  login = async (req, res, next) => {
    try {
      const token = await this.service.login (req.body);
      if (!token) {
        return httpResponse.Unauthorized(res, { message: 'Unauthorized' });
    }
    res.cookie('token', token, { httpOnly: true });
    return httpResponse.Ok(res, token)
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };
  
  github = async (req, res, next) => {
    try {
      const { first_name, last_name, email, role, isGithub } = req.user;
      res.json({
        msg: "Register/Login Github OK",
        session: req.session,
        userData: {
          first_name,
          last_name,
          email,
          role,
          isGithub,
        },
      });
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  perfil = async (req, res, next) => {
    try {
      const {email} = req.user;
      const user = await userService.getUser(email);
      const userDto = new UserDTO(user);
      return httpResponse.Ok(res, {"Usuario Actual": userDto})
  } catch (error) {
    logger.error(error);
      next(error.message)
  }
  }
  
  logout = async (req, res, next) => {
    try {
      req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else{
            res.send("logout");
        };
    });
      //res.clearCookie("token").send("logout");
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  resetpassword = async (req, res, next) => {
    let { email, newpassword } = req.body;
    const user = await userService.getUser (email);
    if (user?.error)
      return httpResponse.NotFound(res, { error: `Usuario no encontrado` });
    if (isValidPassword(newpassword, user))
      return res.send({ error: `La nueva clave debe ser distinta de la antigüa` });
    newpassword = createHash(newpassword);
    let response = await userService.changePassword({ email, newpassword });
    response?.error
      ? httpResponse.Forbidden(res, { error: response.error })
      : httpResponse.Ok(res,{success: `Clave modificada correctamente.`});
  };

  recoverpassword = async (req, res) => {
    let { email } = req.body;
    const user = await userService.getUser(email);
    if (user?.error)
      return httpResponse.NotFound(res, { error: `Usuario no encontrado` });
    user.recover_password = {
      id_url: uuidv4(),
      createTime: new Date(),
    };
    await userService.recoverPassword(user);
    user.recover_password.id_url;
    let result = await transporter.sendMail({
      from: config.EMAIL,
      to: email,
      subject: "Recuperar contraseña",
      html: `<a href="http://localhost:8080/resetpassword/${user.recover_password.id_url}">Recuperar Contrasena</a>`
    })
    httpResponse.Ok(res, result);
  };

  changeRole = async (req, res, next) =>{
    const { uid } = req.params;
    try {
      const user = await userService.getById(uid);
      if (!user) {
        return httpResponse.NotFound(res, { error: `Usuario no encontrado` });
    }
    if (user.role === 'user' && !this.userHasRequiredDocuments(user)) {
        return httpResponse.Forbidden(res, { message: 'El usuario debe cargar los documentos requeridos para ser premium' });
    }
      let result = await userService.changeRole(uid)
      return httpResponse.Ok(res, result);
      
    } catch (error) {
      
    }
  }

  userHasRequiredDocuments(user) {
    const requiredDocuments = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];

    for (const requiredDocument of requiredDocuments) {
        const matchingDocument = user.documents.find(doc => {
            const docNameWithoutExtension = doc.name.split('.').slice(0, -1).join('.');
            return docNameWithoutExtension === requiredDocument;
        });

        if (!matchingDocument) {
            return false;
        }
    }
    return true;
}

uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const userDB = await userService.getById(userId);

        if (!userDB) {
            return httpResponse.NotFound(res, { error: "Usuario inexistente" });
        }

        const newDocuments = req.files.map(file => ({
            name: file.filename,
            reference: file.destination
        }));

        userDB.documents.push(...newDocuments);
        userDB.uploadedDocuments = true;
        const newData = {
          documents: userDB.documents,
          uploadedDocuments: userDB.uploadedDocuments
      }

        const result = await userService.updateUser(userId, newData);
        console.log('result====>',result)

        return httpResponse.Ok(res, { message: "Se subió correctamente", user: userDB });
    } catch (error) {
        logger.error(error);
        return httpResponse.ServerError(res, { error: "Error interno del servidor" });
    }
};

deleteUsers = async (req, res, next) => {
  try {
    const deletedCount = await userService.deleteUsers(); 
    return httpResponse.Ok(res, { message: `${deletedCount} usuarios eliminados`});
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

}
