import { Request, Response } from "express";
import { RedisClient } from "../../types";
import { routeToLongUrlHandler } from "../route-to-long-url";

describe("/shorten route", () => {
  let cache: RedisClient;
  let cacheDb: Record<string, string>;
  let handler: ReturnType<typeof routeToLongUrlHandler>;
  let cacheGetSpy: jest.SpyInstance;
  let cacheSetSpy: jest.SpyInstance;
  let mockReq: Request;
  let mockRes: Response;

  beforeEach(async () => {
    cache = {
      get isOpen() {
        return true;
      },
      get: (key: string) => {
        return cacheDb[key] ?? null;
      },
      set: (key: string, value: string) => {
        cacheDb[key] = value;
      },
    } as any as RedisClient;
    cacheGetSpy = jest.spyOn(cache, "get");
    cacheSetSpy = jest.spyOn(cache, "set");
    cacheDb = {};

    mockReq = {
      params: {
        shortenedPath: "tY",
      },
    } as any as Request;
    mockRes = {
      status: jest.fn(),
      send: jest.fn(),
      writeHead: jest.fn(),
    } as any as Response;

    handler = routeToLongUrlHandler(cache);
  });

  describe("/:shortenedPath handler", () => {
    describe("cache behavior", () => {
      beforeEach(async () => {
        // Arrange
        cacheDb[mockReq.params.shortenedPath] = "http://example.com";

        // Act
        await handler(mockReq, mockRes);
      });

      it("only `get`s from the cache once", () => {
        // Assert
        expect(cacheGetSpy).toHaveBeenCalledWith("tY");
        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
        expect(cacheGetSpy).toHaveReturnedWith("http://example.com");
      });

      it("does not `set` in the cache", () => {
        // Assert
        expect(cacheSetSpy).not.toHaveBeenCalled();
      });
    });

    describe("response", () => {
      it("sends 500 if there's no cache connection", async () => {
        // Arrange
        jest.spyOn(cache, "isOpen", "get").mockReturnValueOnce(false);

        // Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalled();
      });

      it("sends 404 if the given shortenedPath is not found in the cache", async () => {
        // Arrange & Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalled();
      });

      it("sends 301 with the Location header set to the `longUrl` if found in the cache", async () => {
        // Arrange
        const longUrl = "http://example.com";
        cacheDb[mockReq.params.shortenedPath] = longUrl;

        // Arrange & Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.writeHead).toHaveBeenCalledWith(301, {
          Location: longUrl,
        });
        expect(mockRes.send).toHaveBeenCalled();
      });
    });
  });
});
