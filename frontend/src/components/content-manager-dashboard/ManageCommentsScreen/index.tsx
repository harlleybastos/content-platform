import Loading from "@/components/Loading";
import { ShapeArticleForm } from "@/types";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageCommentsScreen = () => {
  const [articleWithComments, setArticleWithComments] = useState<
    ShapeArticleForm[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUnapprovedComments = useCallback(async () => {
    try {
      setArticleWithComments([]);
      setIsLoading(true);
      const { data } = await axios.get(
        "https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/unapproved-comments"
      );
      setArticleWithComments(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUnapprovedComments();
  }, [getUnapprovedComments]);

  const handleDenyComment = useCallback(
    async (article: ShapeArticleForm, commentIndex: number) => {
      try {
        await axios.put(
          `https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/${article.id}/comment/deny/${commentIndex}`,
          {
            title: article.title,
          }
        );
        getUnapprovedComments();
        toast.success("Comment succesfuly removed !");
      } catch (error) {
        toast.error("There was a error denying the comment !");
      }
    },
    [getUnapprovedComments]
  );

  const handleApproveComment = useCallback(
    async (article: ShapeArticleForm, commentIndex: number) => {
      try {
        await axios.put(
          `https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles/${article.id}/comment/approve/${commentIndex}`,
          {
            title: article.title,
          }
        );
        getUnapprovedComments();
        toast.success("Comment succesfuly approved !");
      } catch (error) {
        toast.error("There was a error approving the comment !");
      }
    },
    [getUnapprovedComments]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section
      className="flex flex-col p-10 w-full overflow-y-auto"
      data-testid="content-manager-comments-screen"
    >
      <div className="text-white font-semibold">
        <h1 className="text-3xl">Manage Comments</h1>
        <p>Here you will see all the comments that needs to approved.</p>
      </div>

      <div className="mt-10">
        {articleWithComments.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center text-white font-bold">
            <p className="text-3xl">No comments to be approved !</p>
          </div>
        ) : (
          <div>
            {articleWithComments.map((articleWithComment) => (
              <div key={articleWithComment.id} className="flex flex-col">
                <article className="p-6 mb-6 text-base bg-gray-900 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <p className="inline-flex items-center mr-3 text-sm text-white">
                        <Image
                          className="mr-2 w-6 h-6 rounded-full object-contain"
                          src={articleWithComment.authorProfilePhoto}
                          alt={articleWithComment.author}
                          width={24}
                          height={24}
                        />
                        {articleWithComment.author}
                      </p>
                      <p className="text-sm text-gray-400">
                        <time dateTime="2022-02-08" title="February 8th, 2022">
                          {articleWithComment.date}
                        </time>
                      </p>
                    </div>
                    <span className="text-white bg-green-700 p-2 rounded-lg">
                      {articleWithComment.category}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg text-white">
                      <span>{articleWithComment.title}</span>
                    </p>
                  </div>
                </article>
                {articleWithComment.comments.map((comment, index) => (
                  <div key={index}>
                    <article className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                      <div className="flex items-center gap-2">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                          <Image
                            className="mr-2 w-6 h-6 rounded-full object-contain"
                            src={comment.userPhoto}
                            alt={comment.userName}
                            width={24}
                            height={24}
                          />
                          {comment.userName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <time
                            dateTime="2022-02-12"
                            title="February 12th, 2022"
                          >
                            {comment.date}
                          </time>
                        </p>

                        {Array(comment.rating)
                          .fill("")
                          .map((_, idx) => (
                            <svg
                              key={idx}
                              className={`w-8 hover:cursor-pointer h-8  text-yellow-300`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          ))}
                      </div>

                      <p className="text-white">{comment.comment}</p>

                      <div className="mt-4 flex gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleApproveComment(
                              articleWithComment,
                              comment.index
                            )
                          }
                          className="hover:scale-125 transition-all ease-in-out text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDenyComment(articleWithComment, comment.index)
                          }
                          className="hover:scale-125 transition-all ease-in-out text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Deny
                        </button>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageCommentsScreen;
