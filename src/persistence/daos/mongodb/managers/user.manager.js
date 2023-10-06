import { userModel } from "../models/UsersModels.js";
import { createHash, isValidPassword } from "../../../../utils/utils.js";
import { generateToken } from "../../../../middlewares/auth.js";
import CartDao from "./cart.manager.js";
import MongoDao from "../mongo.dao.js";
import { logger } from "../../../../utils/logger.js";
import { sendAccountDeletionEmail } from "../../../../controllers/email.controllers.js";


const cartDao = new CartDao ();

export default class UserManager extends MongoDao {
  constructor() {
    super (userModel)
  }

  async register (user) {
    try {
      const { first_name, last_name, email, age, password, role } = user;
      const existUser = await this.model.find({ email });
      if (existUser.length === 0) {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          return await this.model.create({
            ...user,
            password: createHash(password),
            role: "admin",
          });
        } else {
          const newCart = await cartDao.addCart ();
          const newUser = await this.model.create ({
            ...user,
            password: createHash(password),
            cart: newCart._id
          });
          const token = generateToken (newUser);
          //const userData = ({newUser, token});
          return token;
        }
      } else {
        return null;
      }
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async login(user) {
    try {
      const { email, password } = user;
      let userExist = await this.model.findOne({ email });
      if (userExist) {
        const passValid = isValidPassword(password, userExist);
        if (!passValid) return false;
        else {
          const currentDate = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
          await this.model.updateOne(
            { email },
            { $set: { last_connection: currentDate }}
          );
          const token = generateToken (userExist);
          return token;
        }
      }
      return false;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async getByEmail(email) {
    try {
      const userExist = await this.model.findOne({ email });
      if (userExist) {
        return userExist;
      }
      return false;
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  async updatePassword({ email, newpassword }) {
    try {
      let user = await this.getByEmail(email);
      if (user?.error) throw new Error(user.error);
      let result = await this.model.updateOne(
        { email },
        { $set: { password: newpassword, recover_password: 
          {
            id_url: null,
            createTime: null
          } 
        } 
      }
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  async recoverPassword(user){
    try {
      let result = await this.model.updateOne(
        { email: user.email },
        { $set: { recover_password: user.recover_password } }
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  async resetRecoverPassword(email){
    try {
      let result = await this.model.updateOne(
        { email },
        { $set: { recover_password: 
            {
              id_url: null,
              createTime: null
            } 
          } 
        }
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkResetUrl(idurl) { 
    try{ 
      let result = await this.model.findOne({"recover_password.id_url":idurl}).lean();
      return result;
    }catch (error){
      return { error: error.message };
    }
  }

  async changeRole(uid) {
    try {
      let user = await this.model.findOne({ _id: uid }, { __v: 0 }).lean();
      if (!user) throw new Error(`User not exists.`);
      let newRole = (user.role === "user") ? "premium" : "user";
      let result = await this.model.updateOne(
        { _id: uid },
        { $set: { role: newRole }}
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateUser(uid, newData){
    try {
      const {documents, uploadedDocuments} = newData;
      const result = await this.model.updateOne({ _id: uid }, { $set: {documents: documents, uploadedDocuments: uploadedDocuments} });
      return result;
    } catch (error) {
        logger.error(error)
    }
  }

  async getAll() {
    try {
      const users = await this.model.find().populate('cart');
      return users;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteUsers() {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
      const deletedUsers = await this.model.find({
        last_connection: { $lt: twoDaysAgo },
      }).select('email');
  
      const result = await this.model.deleteMany({
        last_connection: { $lt: twoDaysAgo },
      });
  
      for (const deletedUser of deletedUsers) {
        await sendAccountDeletionEmail(deletedUser.email);
      }
  
      return result.deletedCount;
    } catch (error) {
      logger.error(error);
    }
  } 

}
