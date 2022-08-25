import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./home";

test("renders learn react link", () => {
  render(<HomePage />);
  const titleElement = screen.getByText(/ZALSA/i);
  expect(titleElement).toBeInTheDocument();
});
