import React from "react";
import ArticleForm from "../ArticleForm";

const AddArticleScreen = () => {
  return (
    <section className="flex flex-col p-10 w-full px-10 overflow-y-auto" data-testid="client-dashboard-add-article-screen">
      <div className="text-white font-semibold">
        <h1 className="text-3xl">Articles</h1>
        <p>Here you will can add a new Article by filling the following form</p>
      </div>

      <div className="mt-10">
        <ArticleForm />
      </div>
    </section>
  );
};

export default AddArticleScreen;
