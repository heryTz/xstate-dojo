import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "../theme";
import { Route } from "./index";

describe("Home", () => {
  test("renders", () => {
    const Home = Route.options.component;
    if (!Home) throw new Error("Home route has no component");

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>,
    );

    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });
});
