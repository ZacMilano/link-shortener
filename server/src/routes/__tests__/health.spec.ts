import { Request, Response } from "express";
// import express from "express";
// import request from "supertest";
import { healthHandler } from "../health";

describe("/health route", () => {
  describe("healthHandler", () => {
    const handler = healthHandler();

    it("sends its status", () => {
      // Arrange
      const req = {} as Request;
      const res = {
        send: jest.fn(),
      } as any as Response;

      // Act
      handler(req, res);

      // Assert
      expect(res.send).toBeCalledWith({ status: "available" });
      console.log(res);
    });
  });
});
