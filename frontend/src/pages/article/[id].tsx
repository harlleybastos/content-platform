import React, { useState, useCallback, useEffect } from "react";
import { useMainContext } from "@/context/MainContext";
import axios from "axios";
import { formatDate } from "@/utils";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";
import { GetServerSideProps } from "next";
import { ShapeArticleForm, ShapeComment, ShapeUserData } from "@/types";
import { toast } from "react-toastify";
import Head from "next/head";
import { getCookie } from "cookies-next";

const Article = () => {
  const { handleFetchArticles } = useMainContext();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<ShapeUserData>();
  const [articleData, setArticleData] = useState<ShapeArticleForm>();
  const [isDataFetched, setDataFetched] = useState(false);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  useEffect(() => {
    const storeUser = getCookie("user");
    if (storeUser) {
      setUserData(JSON?.parse(storeUser));
    }
  }, []);

  useEffect(() => {
    const storedState = sessionStorage.getItem("article");
    if (storedState) {
      setArticleData(JSON?.parse(storedState));
    }
  }, []);

  useEffect(() => {
    if (!isDataFetched && articleData?.title) {
      const getData = async () => {
        const response = await axios.post(
          `https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/${id}`,
          {
            title: articleData?.title,
          }
        );
        setArticleData(response.data);
        setDataFetched(true);
      };
      getData();
    }
  }, [id, articleData?.title, isDataFetched]);

  const handleSubmitFeedback = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        setIsLoading(true);

        // Put the new comment on the table
        await axios.post(
          `https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/${id}/comment`,
          {
            title: articleData?.title,
            userName: userData?.attributes[3].given_name,
            userPhoto: userData?.attributes[6].picture,
            comment: comment,
            rating: rating,
            date: formatDate(),
            isApproved: false,
          }
        );

        const { data: articles } = await axios.get(
          "https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/unapproved-comments"
        );

        let foundComment;
        let foundArticle;

        for (const article of articles) {
          foundComment = article.comments.find(
            (item: ShapeComment) =>
              item.comment === comment && item.isApproved === false
          );
          if (foundComment) {
            foundArticle = article;
            break;
          }
        }

        if (foundComment && foundArticle) {
          // If found, you can now use foundComment.index to get the index
          const { data: responseProcess } = await axios.post(
            `https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/${foundArticle.id}/comment/processComment/${foundComment.index}`,
            { title: foundArticle.title, commentText: foundComment.comment }
          );
          handleFetchArticles();
          toast.success(responseProcess);
          setDataFetched(false);
          setRating(0);
          setComment("");
        } else {
          // Handle the case where the comment was not found
          toast.error("Comment not found in the list of unapproved comments.");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      articleData?.title,
      comment,
      handleFetchArticles,
      id,
      rating,
      userData?.attributes,
    ]
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen">
      <Head>
        <title>{articleData?.metaTitle}</title>
        <meta name="description" content={articleData?.metaDescription} />
        <meta name="keywords" content={articleData?.keywords} />
      </Head>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <header className="mb-4 lg:mb-6 not-format">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-white">
                  <Image
                    className="mr-4 w-16 h-16 rounded-full object-cover"
                    src={
                      articleData?.authorProfilePhoto! ??
                      "https://img.freepik.com/free-icon/user_318-159711.jpg?w=2000"
                    }
                    alt={articleData?.author! ?? "User profile photo"}
                    width={64}
                    height={64}
                  />
                  <div>
                    <a
                      href="#"
                      rel="author"
                      className="text-xl font-bold text-white"
                    >
                      {articleData?.author}
                    </a>

                    <p className="text-base font-light text-gray-500 dark:text-gray-400">
                      <span>{articleData?.date}</span>
                    </p>
                  </div>
                </div>
              </address>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight lg:mb-6 lg:text-4xl text-white">
                {articleData?.title}
              </h1>
            </header>
            <div
              className="text-white text-2xl my-10 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: articleData?.content! }}
            />
            <section className="not-format">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-white">
                  Discussion (
                  {
                    articleData?.comments.filter((item) => item.isApproved)
                      .length
                  }
                  )
                </h2>
              </div>
              <form className="mb-6" onSubmit={(e) => handleSubmitFeedback(e)}>
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <label htmlFor="comment" className="sr-only">
                    Your comment
                  </label>
                  <textarea
                    id="comment"
                    rows={6}
                    onChange={(event) => setComment(event.target.value)}
                    className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                    placeholder="Write a comment..."
                    required
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Post comment
                  </button>

                  <div className="flex">
                    {Array(5)
                      .fill("")
                      .map((_, idx) => (
                        <svg
                          key={idx}
                          className={`w-8 hover:cursor-pointer h-8 ${
                            idx < rating
                              ? "text-yellow-300"
                              : "text-gray-300 dark:text-gray-500"
                          }`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                          onClick={() => handleRating(idx + 1)}
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                  </div>
                </div>
              </form>
              {articleData?.comments
                .filter((item) => item.isApproved)
                .map((comment, index) => (
                  <article
                    key={index}
                    className="p-6 mb-6 text-base bg-gray-900"
                  >
                    <footer className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-white">
                          <Image
                            className="mr-2 w-6 h-6 rounded-full"
                            src={comment.userPhoto}
                            alt={comment.userName}
                            width={24}
                            height={24}
                          />
                          {comment.userName}
                        </p>
                        <p className="text-sm text-gray-400">
                          <time
                            dateTime="2022-02-08"
                            title="February 8th, 2022"
                          >
                            {comment.date}
                          </time>
                        </p>
                      </div>
                      <div className="flex">
                        {Array(comment.rating)
                          .fill("")
                          .map((_, idx) => (
                            <svg
                              key={idx}
                              className={`w-6 h-6 text-yellow-300`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          ))}
                      </div>
                    </footer>
                    <p className="text-white">{comment.comment}</p>
                  </article>
                ))}
            </section>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Article;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie;

  const userCookie = cookie && cookie.includes("user");

  if (!userCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
