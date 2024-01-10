import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMainContext } from "@/context/MainContext";
import { ShapeUserData } from "@/types";
import { formatDate } from "@/utils";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import validationSchema from "./validation";
import Loading from "../../Loading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getCookie } from "cookies-next";

const ArticleForm: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { handleSubmitArticle, isLoadingArticles } = useMainContext();

  const [userData, setUserData] = useState<ShapeUserData>();

  useEffect(() => {
    const storeUser = getCookie("user");
    if (storeUser) {
      setUserData(JSON?.parse(storeUser));
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const { handleChange, handleSubmit, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        title: "",
        content: "",
        category: "",
        author: "",
        authorProfilePhoto: "",
        date: formatDate(),
        comments: [
          {
            comment: "",
            date: "",
            rating: 0,
            userName: "",
            userPhoto: "",
            isApproved: false,
            index: 0,
          },
        ],
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
      validationSchema: validationSchema,
      onSubmit: handleSubmitArticle,
    });

  useEffect(() => {
    if (userData) {
      setFieldValue("author", userData?.attributes[3].given_name);
      setFieldValue("authorProfilePhoto", userData?.attributes[6].picture);
    }
  }, [setFieldValue, userData]);

  // if (isLoadingArticles) {
  //   return <Loading />;
  // }

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block mb-2 text-md font-medium text-white"
            htmlFor="title"
          >
            Article Title
          </label>
          <input
            data-testid="article-title"
            id="title"
            name="title"
            type="text"
            onChange={(e) => setFieldValue("title", e.target.value)}
            value={values.title}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {touched.title && errors.title ? (
            <div className="text-red-500 text-xs mt-1">{errors.title}</div>
          ) : null}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-white">
            Article Content
          </label>
          <div data-testid="article-content">
            {isMounted && (
              <ReactQuill
                value={values.content}
                onChange={(content) => setFieldValue("content", content)}
                placeholder="Your content here"
                theme="snow"
                className="text-white"
              />
            )}
          </div>
          {touched.content && errors.content ? (
            <div className="text-red-500 text-xs mt-1">{errors.content}</div>
          ) : null}
        </div>

        <div className="mb-6">
          <label
            className="block mb-2 text-md font-medium text-white"
            htmlFor="category"
          >
            Article Category/Tag
          </label>
          <input
            data-testid="article-category"
            id="category"
            name="category"
            type="text"
            onChange={handleChange}
            value={values.category}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {touched.category && errors.category ? (
            <div className="text-red-500 text-xs mt-1">{errors.category}</div>
          ) : null}
        </div>

        <div className="mb-6">
          <label
            className="block mb-2 text-md font-medium text-white"
            htmlFor="author"
          >
            Author Name
          </label>
          <input
            data-testid="article-author"
            id="author"
            name="author"
            type="text"
            onChange={handleChange}
            value={values.author}
            className="bg-gray-400 hover:cursor-not-allowed border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            disabled
          />
          {touched.author && errors.author ? (
            <div className="text-red-500 text-xs mt-1">{errors.author}</div>
          ) : null}
        </div>

        <div className="mb-6">
          <button
            data-testid="article-submit"
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center uppercase transition-all ease-in-out "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
