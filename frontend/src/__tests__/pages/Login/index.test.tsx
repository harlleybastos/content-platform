import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import axios from "axios";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Login", () => {
  it("renders the login form", () => {
    render(<Login />);
    expect(screen.getByLabelText(/Your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("allows the user to fill the email and password fields", async () => {
    render(<Login />);
    const inputEmail = screen.getByTestId("input-email");
    const inputPassword = screen.getByTestId("input-password");

    await userEvent.type(inputEmail, "vobehiqy@tutuapp.bid");
    expect(inputEmail).toHaveValue("vobehiqy@tutuapp.bid");
    await userEvent.type(inputPassword, "Maximum2023@!");
    expect(inputPassword).toHaveValue("Maximum2023@!");
  });

  it("submits the form", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (axios.post as jest.Mock).mockResolvedValue({
      data: "someUserData",
    });

    render(<Login />);

    const inputEmail = screen.getByTestId("input-email");
    const inputPassword = screen.getByTestId("input-password");
    const buttonSubmit = screen.getByTestId("button-submit");

    await userEvent.type(inputEmail, "vobehiqy@tutuapp.bid");
    await userEvent.type(inputPassword, "Maximum2023@!");
    userEvent.click(buttonSubmit);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith("/api/login", {
        username: "vobehiqy@tutuapp.bid",
        password: "Maximum2023@!",
      });
      expect(useRouter().push).toHaveBeenCalledWith("/");
    });
  });
});
