import { ShapeArticleForm } from "@/types";
import * as Yup from "yup";

const initialMetaTitle =
  "Click on the button GENERATE SEO to generate the metaTitle.";
const initialMetaDescription =
  "Click on the button GENERATE SEO to generate the metaDescription.";
const initialKeywords =
  "Click on the button GENERATE SEO to  generate all the keywords.";

const validationSchema = Yup.object<ShapeArticleForm>().shape({
  title: Yup.string()
    .required("Title is required")
    .min(10, "Title should be at least 10 characters long"),
  content: Yup.string()
    .required("Content is required")
    .min(100, "Content should be at least 100 characters long"),
  category: Yup.string().required("Category is required"),
  author: Yup.string().required("Author name is required"),
  metaTitle: Yup.string()
    .required("Meta Title is required")
    .notOneOf([initialMetaTitle], "Meta Title needs to be generated"),
  metaDescription: Yup.string()
    .required("Meta Description is required")
    .notOneOf(
      [initialMetaDescription],
      "Meta Description needs to be generated"
    ),
  keywords: Yup.string()
    .required("Keywords are required")
    .notOneOf([initialKeywords], "Keywords need to be generated"),
});

export default validationSchema;
