import { ValidationError } from "sequelize";
import Error404 from "@app/core/errors/error404";
import { Express, Request, Response, NextFunction } from "express";

type Controller = (request: Request, _: Response, next: NextFunction) => void;

class Router {
  app: Express;
  constructor(app: Express) {
    this.app = app;
  }

  get(url: string, controller: Controller, middlewares: Controller[] = []) {
    this.app.get(url, ...middlewares, this.#handleErrors(controller));
  }

  post(url: string, controller: Controller, middlewares: Controller[] = []) {
    this.app.post(url, ...middlewares, this.#handleErrors(controller));
  }

  put(url: string, controller: Controller, middlewares: Controller[] = []) {
    this.app.put(url, ...middlewares, this.#handleErrors(controller));
  }

  patch(url: string, controller: Controller, middlewares: Controller[] = []) {
    this.app.patch(url, ...middlewares, this.#handleErrors(controller));
  }

  delete(url: string, controller: Controller, middlewares: Controller[] = []) {
    this.app.delete(url, ...middlewares, this.#handleErrors(controller));
  }

  #handleErrors(controller: Controller) {
    return async function (
      request: Request,
      response: Response,
      next: NextFunction
    ) {
      try {
        await controller(request, response, next);
      } catch (e: any) {
        if (e instanceof Error404) {
          response.status(404).end(JSON.stringify("Not found"));
          return;
        }

        if (e instanceof ValidationError) {
          response
            .status(422)
            .json(
              e.errors.map((err) => [
                err.path,
                err.validatorKey,
                err.validatorArgs,
              ])
            );
          return;
        }

        if (e.name === "SequelizeForeignKeyConstraintError") {
          response.status(422).json([[e.fields[0], "rel", []]]);
          return;
        }

        console.log("Router Error:", e);
        response.status(500).end(JSON.stringify("Server bug"));
      }
    };
  }
}

export default Router;
