import request from "supertest";
import { server } from "../index";

describe("Link Shortening App", () => {
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

  afterAll(() => {
    // Un-Arrange
    server.close();
  });
});
