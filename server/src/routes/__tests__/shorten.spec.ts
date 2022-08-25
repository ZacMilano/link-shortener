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

    cryptoSpy = jest.spyOn(Crypto, "randomBytes");

    mockReq = {
      body: {
        longUrl: "http://example.com",
      },
    } as any as Request;
    mockRes = {
      status: jest.fn(),
      send: jest.fn(),
    } as any as Response;

    handler = shortenHandler(cache);
  });

  describe("shortenHandler", () => {
    describe("cache behavior", () => {
      describe("the first-generated path has not been seen yet", () => {
        const bytes = Buffer.from([0x12]);

        beforeEach(async () => {
          // Arrange
          cryptoSpy.mockReturnValue(bytes);

          // Act
          await handler(mockReq, mockRes);
        });

        it("only `get`s from the cache once", () => {
          // Assert
          expect(cacheGetSpy).toHaveBeenCalledWith(bytes.toString("base64url"));
          expect(cacheGetSpy).toHaveBeenCalledTimes(1);
          expect(cacheGetSpy).toHaveReturnedWith(null);
        });

        it("only `set`s in the cache once", () => {
          // Assert
          expect(cacheSetSpy).toHaveBeenCalledWith(
            bytes.toString("base64url"),
            mockReq.body.longUrl
          );
          expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("the first-generated path has been seen before", () => {
        beforeEach(async () => {
          // Arrange
          const iterations = [
            [0x12],
            [0x12, 0x34],
            [0x12, 0x34, 0x56],
            [0x12, 0x34, 0x56, 0x78],
          ].map((bytes) => Buffer.from(bytes));

          iterations.forEach((buffer) => {
            cacheDb[buffer.toString("base64url")] = "seen before!";
            cryptoSpy.mockReturnValueOnce(buffer);
          });

          cryptoSpy.mockReturnValueOnce(
            Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90])
          );

          // Act
          await handler(mockReq, mockRes);
        });

        it("`get`s from the cache until a novel string is generated", () => {
          // Assert
          expect(cacheGetSpy).toHaveBeenCalledTimes(5);
          expect(cacheGetSpy).toHaveBeenLastCalledWith(
            Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90]).toString("base64url")
          );
        });

        it("only `set`s in the cache once", () => {
          // Assert
          expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    it("does not add 'http://' to the longUrl if already present", async () => {
      // Arrange
      const bytes = Buffer.from([0x12]);
      cryptoSpy.mockReturnValue(bytes);
      const mockUrl =
        "http://example.com/test/path?search=queryyyy&params=populateddddd";
      mockReq.body.longUrl = mockUrl;

      // Act
      await handler(mockReq, mockRes);

      // Assert
      expect(cacheSetSpy).toHaveBeenCalledWith(
        bytes.toString("base64url"),
        mockUrl
      );
    });

    it("adds 'http://' to the longUrl if not already present", async () => {
      // Arrange
      const bytes = Buffer.from([0x12]);
      cryptoSpy.mockReturnValue(bytes);
      const mockUrl = "example.com/test/path?search=query&params=populated";
      mockReq.body.longUrl = mockUrl;

      // Act
      await handler(mockReq, mockRes);

      // Assert
      expect(cacheSetSpy).toHaveBeenCalledWith(
        bytes.toString("base64url"),
        `http://${mockUrl}`
      );
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

      it("sends 400 if there is no request boyd", async () => {
        // Arrange
        delete mockReq.body;

        // Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("Bad request body");
      });

      it("sends 400 if `longUrl` is not present in request body", async () => {
        // Arrange
        mockReq.body = { longaniza: "a type of sausage" };

        // Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("Bad request body");
      });

      it("sends 400 if `longUrl` is not a string", async () => {
        // Arrange
        mockReq.body = {
          longUrl: {
            protocol: "https",
            domain: "example.com",
            path: "/test-path",
            search: "?search=type&query=params",
          },
        };

        // Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("Bad request body");
      });

      it("sends 201 if successful", async () => {
        // Arrange & Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.send).toHaveBeenCalled();
      });

      describe("body", () => {
        const bytes = Buffer.from([0x12]);

        beforeEach(async () => {
          // Arrange
          cryptoSpy.mockReturnValue(bytes);

          // Act
          await handler(mockReq, mockRes);
        });

        it("contains `shortenedUrl`, `originalLength`, and `shortenedLength`", () => {
          // Assert
          expect(mockRes.send).toHaveBeenCalledWith({
            shortenedUrl: expect.any(String),
            originalLength: expect.any(Number),
            shortenedLength: expect.any(Number),
          });
        });

        it("`shortenedUrl` links to this server properly", () => {
          // Assert
          expect(mockRes.send).toHaveBeenCalledWith({
            shortenedUrl: expect.stringMatching(
              /^http:\/\/localhost:3001\/[a-zA-z\d_-]+/
            ),
            originalLength: expect.any(Number),
            shortenedLength: expect.any(Number),
          });
        });

        it("`originalLength` is the length of the given long-form link", () => {
          // Assert
          expect(mockRes.send).toHaveBeenCalledWith({
            shortenedUrl: expect.any(String),
            originalLength: "http://example.com".length,
            shortenedLength: expect.any(Number),
          });
        });

        it("`shortenedLength` is the length of the short-form link", () => {
          // Assert
          expect(mockRes.send).toHaveBeenCalledWith({
            shortenedUrl: expect.any(String),
            originalLength: expect.any(Number),
            shortenedLength: `http://localhost:3001/${bytes.toString(
              "base64url"
            )}`.length,
          });
        });
      });
    });
  });
});
