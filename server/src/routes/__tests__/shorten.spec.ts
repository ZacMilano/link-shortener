import { Request, Response } from "express";
import { RedisClient } from "../../types";
import { createClient as createRedisClient } from "redis-mock";
import { shortenHandler } from "../shorten";
import * as Crypto from "crypto";

describe("/shorten route", () => {
  let cache: RedisClient;
  let handler: ReturnType<typeof shortenHandler>;
  let cryptoSpy: jest.SpyInstance;

  beforeEach(() => {
    cache = createRedisClient();
    handler = shortenHandler(cache);
    cryptoSpy = jest.spyOn(Crypto, "randomBytes");
  });

  describe("shortenHandler", () => {
    describe("cache behavior", () => {
      describe("the first-generated path has not been seen yet", () => {
        it("only `get`s from the cache once", () => {});

        it("only `set`s in the cache once", () => {});
      });
      describe("the first-generated path has been seen before", () => {
        it("`get`s from the cache until a novel string is generated", () => {});

        it("only `set`s in the cache once", () => {});
      });
    });

    it("adds 'http://' to the longUrl if not already present", () => {});

    describe("response", () => {
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
