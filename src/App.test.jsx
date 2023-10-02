import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

describe("App", () => {
  test("renders the component", () => {
    render(<App />);
    const headingElement = screen.getByText("People born today!!");
    expect(headingElement).toBeDefined();
  });

  test("Find the fetch button, it should be enabled", () => {
    render(<App />);
    const buttonElement = screen.getByText("Lets Go");
    expect(buttonElement).toBeEnabled();
  });

  test("displays PeopleTable component when data is present", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ name: "John Doe", age: 30 }]),
      })
    );

    render(<App />);
    const buttonElement = screen.getByText("Lets Go");
    fireEvent.click(buttonElement);

    await waitFor(() => {
      const peopleTableElement = screen.getByTestId("people-table");
      expect(peopleTableElement).toBeInTheDocument();
    });
    global.fetch.mockClear();
  });
});
