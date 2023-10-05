import Services from "./class.services.js";
import factory from "../persistence/daos/factory.js";
import CartRepository from "../persistence/daos/repository/cart.repository.js";

const { cartManager } = factory;
const cartRepository = new CartRepository();

export default class CartService extends Services {
  constructor() {
    super(cartManager);
  }

  getCart = async (id) => await cartRepository.getCart(id);
  createCart = async () => await cartRepository.addCart();
  deleteCart = async (id) => await cartRepository.deleteAllProducts(id);
  updateCart = async (id, data) => await cartRepository.updateProducts(id, data);
  updateProductInCart = async (cid, pid, quantity) => await cartRepository.updateProductQuantity(cid, pid, quantity);
  addProductInCart = async (cid, pid) => await cartRepository.addProductToCart(cid, pid)
  deleteProductInCart = async (cid, pid) => await cartRepository.deleteProduct(cid, pid)
}

