import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "src/theme";
import { Home } from "./home";

describe("Home", () => {
  test("renders", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>,
    );

    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });
});
