import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { deleteCookie } from "cookies-next";
import MainDashboard from "@/pages";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock("cookies-next", () => ({
  getCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

describe("Dashboard", () => {
  it("redirects based on user group", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockUser = JSON.stringify({
      attributes: [{}, {}, { "custom:group": "client" }],
    });

    render(<MainDashboard user={mockUser} />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/client-dashboard");
    });
  });

  it("logs out the user", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockUser = JSON.stringify({
      attributes: [{}, {}, { "custom:group": "client" }],
    });

    render(<MainDashboard user={mockUser} />);

    const rightMenu = screen.getByTestId("right-menu");

    userEvent.click(rightMenu);

    const buttonLogout = await screen.findByTestId("button-logout");

    userEvent.click(buttonLogout);

    await waitFor(() => {
      expect(deleteCookie).toHaveBeenCalledWith("user");
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
      expect(toast.success).toHaveBeenCalledWith("Log out successfully !");
    });
  });
});
