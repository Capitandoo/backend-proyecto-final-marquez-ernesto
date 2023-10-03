import factory from "../factory.js";
import UserDTO from "../../dtos/user/user.dto.js";

const { userManager } = factory;

export default class UserRepository {
  constructor() {
    this.dao = userManager;
  }

  async register(user) {
    return await this.dao.register(user);
  }

  async getUser(email) {
    return await this.dao.getByEmail(email);
  }

  async getById(id){
    return await this.dao.getById(id)
}

  async resetPassword({ email, newpassword }) {
    return await this.dao.updatePassword({ email, newpassword });
  }

  async recoverPassword(user) {
    return await this.dao.recoverPassword(user)
  }

  async changeRole(uid) {
    return await this.dao.changeRole(uid);
  }

  async updateUser(uid, newData) {
    return await this.dao.updateUser(uid, newData);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async deleteUsers(){
    return await this.dao.deleteUsers()
}

}
