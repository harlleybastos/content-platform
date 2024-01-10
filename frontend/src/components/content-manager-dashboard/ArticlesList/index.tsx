import { useMainContext } from "@/context/MainContext";
import { ShapeArticleForm } from "@/types";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";

interface ShapeConditionalRender {
  [index: number]: JSX.Element;
}

const ArticlesList: React.FC = () => {
  const router = useRouter();

  const { articles, isLoadingArticles, currentIndex, handlePublishArticle } =
    useMainContext();

  if (isLoadingArticles) {
    return <Loading />;
  }

  const handleArticleClick = (article: ShapeArticleForm) => {
    window.sessionStorage.setItem("article", JSON.stringify(article));
    router.push(`/article/${article.id}`);
  };

  const conditionalRender: ShapeConditionalRender = {
    0: (
      <article className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto">
        {articles.Items.filter((item) => item.draft === false).map(
          (article) => (
            <div
              key={article.id}
              className="p-3 bg-[#111827] my-2 min-w-[300px] flex flex-col gap-2 rounded-xl justify-between"
            >
              <div className="flex items-center mb-4 space-x-4">
                <Image
                  className="w-10 h-10 rounded-full object-contain"
                  src={article.authorProfilePhoto}
                  alt={article.author}
                  width={40}
                  height={40}
                />
                <p className="text-gray-700 space-y-1 font-medium">
                  {article.author}
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    {article.date}
                  </span>
                </p>
              </div>

              <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                {article.title}
              </h3>

              <div
                className="text-white text-md relative mb-3"
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
      </article>
    ),
    1: (
      <article className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto">
        {articles.Items.map((article) => (
          <div
            key={article.id}
            className="p-3 bg-[#111827] my-2 min-w-[300px] flex flex-col gap-2 rounded-xl justify-between"
          >
            <div className="flex items-center mb-4 space-x-4">
              <Image
                className="w-10 h-10 rounded-full object-contain"
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
              className="text-white text-md relative mb-3"
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

            {article.draft && (
              <div className="text-white bg-red-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2">
                Draft
              </div>
            )}

            {currentIndex === 1 && article.draft && (
              <button
                type="button"
                onClick={() => handlePublishArticle(article)}
                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Publish
              </button>
            )}
          </div>
        ))}
      </article>
    ),
  };

  return <div>{conditionalRender[currentIndex]}</div>;
};

export default ArticlesList;
