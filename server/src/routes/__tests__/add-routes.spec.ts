import { Express } from "express";
import { Route, RedisClient } from "../../types";
import { addRoutes } from "../add-routes";

describe("addRoutes function", () => {
  const app = { get: jest.fn(), post: jest.fn() } as any as Express;
  const cache = { mock: "cache value" } as any as RedisClient;

  const rootHandler = jest.fn().mockReturnValue("rootHandler");
  const healthHandler = jest.fn().mockReturnValue("healthHandler");
  const otherRouteHandler = jest.fn().mockReturnValue("otherRouteHandler");
  const withParamsHandler = jest.fn().mockReturnValue("withParamsHandler");

  const middlewareOne = jest.fn();
  const middlewareTwo = jest.fn();

  const routes: Route[] = [
    {
      path: "/",
      method: "get",
      handler: rootHandler,
    },
    {
      path: "/health",
      method: "get",
      handler: healthHandler,
    },
    {
      path: "/other/route",
      method: "post",
      middlewares: [middlewareOne],
      handler: otherRouteHandler,
    },
    {
      path: "/with/route-params/:one/and/:two",
      method: "post",
      middlewares: [middlewareOne, middlewareTwo],
      handler: withParamsHandler,
    },
  ];

  beforeAll(() => {
    // Arrange & Act
    addRoutes(app, cache, routes);
  });

  it("uses the routes' methods and endpoints, and middlewares when applicable", () => {
    // Assert
    expect(app.get).toHaveBeenCalledWith("/", "rootHandler");
    expect(app.get).toHaveBeenCalledWith("/health", "healthHandler");
    expect(app.post).toHaveBeenCalledWith(
      "/other/route",
      middlewareOne,
      "otherRouteHandler"
    );
    expect(app.post).toHaveBeenCalledWith(
      "/with/route-params/:one/and/:two",
      middlewareOne,
      middlewareTwo,
      "withParamsHandler"
    );
  });

  it("calls routes' handlers", () => {
    // Arrange
    const handlers = [
      rootHandler,
      healthHandler,
      otherRouteHandler,
      withParamsHandler,
    ];

    for (const handler of handlers) {
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(cache);
    }
  });
});
