import Loading from "@/components/Loading";
import { useMainContext } from "@/context/MainContext";
import { ShapeArticleForm } from "@/types";
import Image from "next/image";
import { useRouter } from "next/router";

const ArticlesList: React.FC = () => {
  const router = useRouter();

  const { articles, isLoadingArticles } = useMainContext();

  if (isLoadingArticles) {
    return <Loading />;
  }

  const handleArticleClick = (article: ShapeArticleForm) => {
    window.sessionStorage.setItem("article", JSON.stringify(article));
    router.push(`/article/${article.id}`);
  };

  return (
    <article className="mt-4 overflow-y-auto h-screen">
      {articles.Items.filter((article) => !article.draft).length === 0 ? (
        <div className="p-3 bg-[#111827] hover:cursor-pointer my-2 min-w-[300px] flex flex-col gap-2 rounded-xl">
          <h1>No articles to show !</h1>
        </div>
      ) : (
        <div className="grid  gap-10 grid-cols-2 lg:grid-cols-3">
          {articles.Items.filter((article) => !article.draft).map(
            (article, index) => (
              <div
                key={index}
                className="p-3 bg-[#111827] my-2 flex flex-col gap-2 rounded-xl"
              >
                <div className="flex items-center mb-4 space-x-4">
                  <Image
                    className="w-10 h-10 rounded-full object-cover"
                    src={article.authorProfilePhoto}
                    alt={article.author}
                    width={40}
                    height={40}
                  />
                  <div className="space-y-1 font-medium dark:text-white">
                    <p className="text-gray-700">
                      {article.author}
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        {article.date}
                      </span>
                    </p>
                  </div>
                </div>

                <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {article.title}
                </h3>

                <div
                  className="text-md relative mb-3 text-white"
                  dangerouslySetInnerHTML={{
                    __html: article.content.substring(0, 150).concat("..."),
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleArticleClick(article)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                </button>
              </div>
            )
          )}
        </div>
      )}
    </article>
  );
};

export default ArticlesList;
