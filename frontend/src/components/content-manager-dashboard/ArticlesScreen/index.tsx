import React from "react";
import ArticlesList from "../ArticlesList";

const ArticlesScreen = () => {
  return (
    <section className="flex flex-col p-10 w-full overflow-y-auto" data-testid="content-manager-articles-screen">
      <div className="text-white font-semibold">
        <h1 className="text-3xl">Articles</h1>
        <p>
          Here you will see all the articles that are current published or not.
        </p>
      </div>

      <div className="mt-10">
        <ArticlesList />
      </div>
    </section>
  );
};

export default ArticlesScreen;
