import React, { useCallback, useEffect, useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { useMainContext } from "@/context/MainContext";
import { ShapeArticleFormCreation, ShapeUserData } from "@/types";
import { convertHtmlToPlainText, formatDate } from "@/utils";
import { toast } from "react-toastify";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import validationSchema from "./validation";
import Loading from "../../Loading";
import SEOMetadataForm from "../SeoMetadaForm";
import axios from "axios";
import draftToHtml from "draftjs-to-html";
import { getCookie } from "cookies-next";

const ArticleForm: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { handleSubmitArticle, isLoadingArticles } = useMainContext();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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
        metaTitle:
          "Click on the button GENERATE SEO to generate the metaTitle.",
        metaDescription:
          "Click on the button GENERATE SEO to generate the metaDescription.",
        keywords:
          "Click on the button GENERATE SEO to  generate all the keywords.",
      },
      validationSchema: validationSchema,
      onSubmit: (
        values: ShapeArticleFormCreation,
        helper: FormikHelpers<ShapeArticleFormCreation>
      ) => {
        handleSubmitArticle(values, helper);
        setEditorState(EditorState.createEmpty());
      },
    });

  useEffect(() => {
    if (userData) {
      setFieldValue("author", userData?.attributes[3].given_name);
      setFieldValue("authorProfilePhoto", userData?.attributes[6].picture);
    }
  }, [setFieldValue, userData]);

  const fetchMetadata = useCallback(async () => {
    if (values.content.length >= 100) {
      setFieldValue("metaTitle", "Loading...");
      setFieldValue("metaDescription", "Loading...");
      setFieldValue("keywords", "Loading...");
      const plainTextContent = convertHtmlToPlainText(values.content);
      const response = await axios.post(
        "https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/article/generate-seo-metadata",
        {
          content: plainTextContent,
        }
      );
      setFieldValue("metaTitle", response.data.metaTitle);
      setFieldValue("metaDescription", response.data.metaDescription);
      setFieldValue("keywords", response.data.keywords);
    } else {
      toast.error(
        "Your article should have at least 100 words to generate Metadata SEO !"
      );
    }
  }, [setFieldValue, values.content]);

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);

    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    setFieldValue("content", html);
  };

  if (isLoadingArticles) {
    return <Loading />;
  }

  return (
    <div className="p-4">
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
          <label className="block mb-2 text-md font-medium text-white">
            Article Content
          </label>
          <div data-testid="article-content">
            {isMounted && (
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
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

        <div className="mb-6 flex flex-col">
          <div className="flex justify-between">
            <label
              className="block mb-2 text-md font-medium text-white"
              htmlFor="author"
            >
              Seo Metadata (AI-generated)
            </label>

            <button
              type="button"
              onClick={fetchMetadata}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Generate SEO
            </button>
          </div>

          <SEOMetadataForm
            metadata={{
              keywords: values.keywords,
              metaDescription: values.metaDescription,
              metaTitle: values.metaTitle,
            }}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
          />
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
