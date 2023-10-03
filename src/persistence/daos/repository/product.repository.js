import factory from "../factory.js";
import ProductDTO from "../../dtos/product/product.dto.js";

const { productManager } = factory;

export default class ProductRepository {
  constructor() {
    this.dao = productManager;
  }

  async getProducts(page , limit, category , availability) {
    return await this.dao.getAll(page , limit, category , availability);
  }

  async getProduct(id) {
    return await this.dao.getById(id);
  }

  async addProduct(product) {
    //let productDBFormat = new ProductDTO(product);
    return await this.dao.create(product);
  }

  async updateProduct(id, newParams) {
    return await this.dao.update(id, newParams);
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }
}
