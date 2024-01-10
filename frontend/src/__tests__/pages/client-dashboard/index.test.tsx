import React from "react";
import { render, act, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import { MainContext } from "@/context/MainContext";
import userEvent from "@testing-library/user-event";
import ClientDashboard from "@/pages/client-dashboard";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("ContentManagerDashboard", () => {
  it("should render the dashboard and allow screen changes", async () => {
    await act(async () => {
      // Mock router values
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockImplementation(() => ({
        push: mockPush,
      }));

      const mockUser = JSON.stringify({
        message: "Login successful!",
        attributes: [
          { sub: "71dd05a6-d0be-467c-b8bb-31e330754878" },
          { email_verified: "true" },
          { "custom:group": "client" },
          { given_name: "Harlley" },
          { family_name: "Bastos" },
          { email: "harlleygtm@gmail.com" },
          {
            picture:
              "https://content-platform-profile-photos-dev.s3.amazonaws.com/harlley.jpg",
          },
        ],
      });

      render(
        <MainContext.Provider
          value={{
            handleSubmitArticle: jest.fn(),
            isLoadingArticles: false,
            articles: { Items: [] },
            currentIndex: 0,
            handleFetchArticles: async () => {},
            setCurrentIndex: jest.fn(),
            handlePublishArticle: async () => {},
          }}
        >
          <ClientDashboard user={mockUser} />
        </MainContext.Provider>
      );
    });
    // Check if the dashboard button is rendered
    const dashboardButton = screen.queryByTestId(
      "dashboard-screen-client-dashboard"
    );
    expect(dashboardButton).toBeInTheDocument();

    // Check if the new article button is rendered
    const newArticleButton = screen.queryByTestId("new-article");
    expect(newArticleButton).toBeInTheDocument();

    // Check if the right menu button is rendered
    const rightMenuButton = screen.getByTestId("right-menu");

    userEvent.click(rightMenuButton);

    expect(rightMenuButton).toBeInTheDocument();

    waitFor(async () => {
      const logoutButton = await screen.findByTestId("button-logout");
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
