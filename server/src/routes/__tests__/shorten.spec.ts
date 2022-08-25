import { Request, Response } from "express";
import { RedisClient } from "../../types";
import { shortenHandler } from "../shorten";
import * as Crypto from "crypto";
jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
}));

describe("/shorten route", () => {
  let cache: RedisClient;
  let cacheDb: Record<string, string>;
  let handler: ReturnType<typeof shortenHandler>;
  let cryptoSpy: jest.SpyInstance;

  const mockReq = {
    body: {
      longUrl: "example.com",
    },
  } as any as Request;

  const mockRes = {
    status: jest.fn(),
    send: jest.fn(),
  } as any as Response;

  beforeEach(async () => {
    cache = {
      get: (key: string) => {
        return cacheDb[key] ?? null;
      },
      set: (key: string, value: string) => {
        cacheDb[key] = value;
      },
    } as any as RedisClient;
    cacheDb = {};
    handler = shortenHandler(cache);
    cryptoSpy = jest.spyOn(Crypto, "randomBytes");
  });

  describe("shortenHandler", () => {
    describe("cache behavior", () => {
      describe("the first-generated path has not been seen yet", () => {
        it("only `get`s from the cache once", async () => {
          // Arrange
          cache.get = jest.fn().mockImplementation(cache.get);
          const bytes = Buffer.from([0x12]);
          cryptoSpy.mockReturnValue(bytes);

          // Act
          handler(mockReq, mockRes);

          // Assert
          expect(cache.get).toHaveBeenCalledWith(bytes.toString("base64url"));
          expect(cache.get).toHaveBeenCalledTimes(1);
        });

        it("only `set`s in the cache once", () => {});
      });
      describe("the first-generated path has been seen before", () => {
        it("`get`s from the cache until a novel string is generated", () => {});

        it("only `set`s in the cache once", () => {});
      });
    });

    it("adds 'http://' to the longUrl if not already present", () => {});

    describe("response", () => {
      it("sends 500 if there's no cache connection", () => {});

      it("sends 400 if `longUrl` is not present in request body", () => {});

      it("sends 400 if `longUrl` is not a string", () => {});

      it("sends 201 if successful", () => {});

      describe("body", () => {
        it("contains `shortenedUrl`, `originalLength`, and `shortenedLength`", () => {});

        it("`shortenedUrl` links to this server properly", () => {});

        it("`originalLength` is the length of the given long-form link", () => {});

        it("`shortenedLength` is the length of the short-form link", () => {});
      });
    });
  });
});
