import { ShapeArticleForm } from "@/types";
import * as Yup from "yup";

const validationSchema = Yup.object<ShapeArticleForm>().shape({
  title: Yup.string()
    .required("Title is required")
    .min(10, "Title should be at least 10 characters long"),
  content: Yup.string()
    .required("Content is required")
    .min(100, "Content should be at least 100 characters long"),
  category: Yup.string().required("Category is required"),
  author: Yup.string().required("Author name is required"),
});

export default validationSchema;
