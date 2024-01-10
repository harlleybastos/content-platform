import React from "react";
import ArticlesList from "../ArticlesList";

const DashboardScreen = () => {
  return (
    <section className="flex flex-col w-full p-10 h-screen overflow-y-auto" data-testid="content-manager-dashboard-screen">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <h1 className="text-6xl font-semibold">Good Morning !</h1>
          <p className="pl-2">We are collecting artcicles for you</p>
        </div>
      </div>

      <div className="mt-10 flex justify-between items-center gap-10 w-full">
        <div className="flex flex-col">
          <h1 className="text-white text-3xl font-semibold">New Articles</h1>

          <ArticlesList />
        </div>
      </div>
    </section>
  );
};

export default DashboardScreen;
