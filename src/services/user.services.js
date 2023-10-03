import Services from "./class.services.js";
import factory from "../persistence/daos/factory.js";
import { logger } from "../utils/logger.js";
import UserRepository from "../persistence/daos/repository/user.repository.js";

const userRepository = new UserRepository();
const {userManager} = factory;

export default class UserService extends Services {
  constructor() {
    super (userManager)
  }

  register = async (user) => {
    try {
      const token = await userRepository.register (user);
      return token;
    } catch (error) {
      logger.error(error);
      throw new Error (error.message);
    }
  };
  
  login = async (user) => {
    try {
      const usuario = await this.manager.login (user);
      return usuario;
    } catch (error) {
      logger.error(error);
      throw new Error (error.message);
    }
  };

  getAll = async () => {
    try {
      const users = await userRepository.getAll();
      return users;      
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message);
    }
  }

  getUser = async (email) => await userRepository.getUser(email);

  getById = async (id) => {
    try {
      const getNew = await userRepository.getById(id);
      return getNew;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message);
    }
  };

  changePassword = async ({ email, newpassword }) =>
    await userRepository.resetPassword({ email, newpassword });

  recoverPassword = async (user) => await userRepository.recoverPassword(user)
  
  changeRole = async (uid) => await userRepository.changeRole(uid)

  updateUser = async (uid, newData) => await userRepository.updateUser(uid, newData);

  deleteUsers = async () => {
    try {
      const deleteUs = await userRepository.deleteUsers();
      return deleteUs;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message);
    }
  };


}
