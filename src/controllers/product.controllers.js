import Controllers from "./class.controllers.js";
import ProductService from "../services/product.services.js";
import { logger } from "../utils/logger.js";
import { sendProductDeletionEmail } from "./email.controllers.js";
import { HttpResponse } from "../utils/http.response.js"

const productService = new ProductService();
const httpResponse = new HttpResponse();

export default class ProductController extends Controllers {
  constructor() {
    super(productService);
  }

  getAll = async (req, res, next) => {
    try {
      const { page, limit, category, availability } = req.query;
      const docs = await productService.getProducts(page, limit, category, availability);

      const status = "succes";
      const payload = docs.docs;
      const totalPages = docs.totalPages;
      const prevPage = docs.prevPage;
      const nextPage = docs.nextPage;
      const currentpage = docs.page;
      const hasPrevPage = docs.hasPrevPage;
      const hasNextPage = docs.hasNextPage;
      const prevLink = hasPrevPage
        ? `http://localhost:8080/products?page=${docs.hasPrevPage}`
        : null;
      const nextLink = hasNextPage
        ? `http://localhost:8080/products?page=${docs.hasNextPage}`
        : null;
      res.json({
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        currentpage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  createMocksProducts = async (req, res, next) => {
    try {
      const response = await productService.createMocksProducts();
      httpResponse.Ok(res, { products: response });
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { ...body } = req.body;
      let product = { ...body, status: true, owner: userId };
      //let thumbnails = files.map ((file) => file.originalname);
      //product.thumbnails = thumbnails || [];      
      const response = await productService.saveProduct(product);
      return httpResponse.Ok(res, response);
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  deleteProduct = async (req, res, next) => {
    const { userId, role, email } = req.user;
    const id = req.params.id;
    if (role === "premium") {
      let response = await productService.getProduct(id);
      if (response.owner.toString() !== userId) {
        return httpResponse.Unauthorized(res, { error: "No tenes permisos para realizar esta acción" });
      }
    }
      let response = await productService.deleteProduct(id);
      await sendProductDeletionEmail(email, response.title)
      return httpResponse.Ok(res, response);
  };
}
