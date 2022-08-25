import request from "supertest";
import { startServer } from "../start-server";

describe("Link Shortening App", () => {
  let server: ReturnType<typeof startServer>;

  beforeEach(() => {
    server = startServer(0);
  });

  afterEach(() => {
    server.close();
  });

  describe("/health", () => {
    it("responds with status: available", async () => {
      // Arrange & Act
      const res = await request(server).get("/health");

      // Assert
      expect(res.body).toStrictEqual({ status: "available" });
      expect(res.statusCode).toBe(200);
      expect(res.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
  });
});
