import { Express } from "express";
import { Route, RedisClient } from "../../types";

describe("addRoutes function", () => {
  const cache = { mock: "cache value" } as any as RedisClient;
  const app = { get: jest.fn(), set: jest.fn() } as any as Express;

  const rootHandler = jest.fn();
  const healthHandler = jest.fn();
  const otherRouteHandler = jest.fn();
  const withParamsHandler = jest.fn();

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
      path: "/with/routeParams/:one/and/:two",
      method: "post",
      middlewares: [middlewareOne, middlewareTwo],
      handler: withParamsHandler,
    },
  ];

  it("adds the appropriate endpoint onto `app`", () => {});

  it("adds middlewares when applicable", () => {});

  it("calls routes' handlers", () => {});
});
