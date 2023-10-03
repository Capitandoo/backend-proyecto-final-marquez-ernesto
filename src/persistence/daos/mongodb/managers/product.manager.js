import MongoDao from "../mongo.dao.js";
import { ProductsModel } from "../models/ProductModel.js";

export default class ProductManager extends MongoDao {

  constructor() {
    super (ProductsModel)
  }

  async getAll(page = 1, limit = 10, category, availability) {
      
    try {
      const query = {};
  
      if (category) {
        query.category = category;
      }
  
      if (availability) {
        query.availability = availability;
      }
  
      const response = await ProductsModel.paginate(query, { page, limit });
      return response;
    } catch (error){
      logger.error(error.message)
      throw new Error(error.message)
    } 
  };

};
