import { HttpResponse } from "../utils/http.response.js";
import { logger } from "../utils/logger.js";

const httpResponse = new HttpResponse();

export default class Controllers {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const items = await this.service.getAll();
      httpResponse.Ok(res, items);
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item)
      httpResponse.NotFound(res, {
          method: "getById",
          error: "Item no encontrado",
        });
      else httpResponse.Ok(res, item);
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  create = async (req, res, next) => {
    try {
      const newItem = await this.service.create(req.body);
      if (!newItem)
      httpResponse.NotFound(res, {
          method: "create",
          error: "Error de validación",
        });
      else httpResponse.Ok(res, newItem);
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item)
      httpResponse.NotFound(res, {
          method: "update",
          error: "Item no encontrado!",
        });
      const itemUpd = await this.service.update(id, req.body);
      httpResponse.Ok(res, itemUpd);
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item)
      httpResponse.NotFound(res, {
          method: "delete",
          error: "Item no encontrado!",
        });
      await this.service.delete(id);
      httpResponse.Ok(res, "Producto eliminado correctamente!");
    } catch (error) {
      logger.error(error);
      next(error.message);
    }
  };
}
