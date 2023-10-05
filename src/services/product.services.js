import Services from "./class.services.js";
import factory from "../persistence/daos/factory.js";
import ProductRepository from "../persistence/daos/repository/product.repository.js";
import { generateProduct } from "../utils/utils.js";

const {productManager} = factory;
const productRepository = new ProductRepository();

export default class ProductService extends Services {
  constructor() {
    super (productManager)
  }

  getProducts = async (page, limit, category, availability) => {
    const getProds = await productRepository.getProducts (page, limit, category, availability);
    return getProds;
  };

  getProduct = async (id) => {
    const getProd = await productRepository.getProduct(id);
    return getProd;
  };

  saveProduct = async (product) => {
    const saveProd = await productRepository.addProduct(product);
    return saveProd;
  };

  deleteProduct = async (id) => {
    const delProd = await productRepository.deleteProduct(id);
    return delProd;
  };

  updateProduct = async (id, product) =>{
    const upProd = await productRepository.updateProduct(id, product);
    return upProd;
  };

  createMocksProducts = async () => {
    let product = [];
    for (let i = 0; i < 10; i++) {
      product.push(generateProduct());
    }
    const products = await productRepository.addProduct(product);
    return products;
  };

};
