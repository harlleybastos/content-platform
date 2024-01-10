import { ShapeArticleFormCreation, ShapeMetadata } from "@/types";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";

type Props = {
  metadata: ShapeMetadata;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<ShapeArticleFormCreation>> | Promise<void>;
  errors: FormikErrors<ShapeArticleFormCreation>;
  touched: FormikTouched<ShapeArticleFormCreation>;
};

const SEOMetadataForm: React.FC<Props> = ({
  metadata,
  setFieldValue,
  errors,
  touched,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label className="text-white text-sm my-2">Meta Title:</label>
        <input
          type="text"
          value={metadata.metaTitle.replace('Meta title:', '')}
          onChange={(e) => setFieldValue("metaTitle", e.target.value)}
          className={`${
            metadata.metaTitle ===
            "Click on the button GENERATE SEO to generate the metaTitle."
              ? "bg-gray-400 hover:cursor-not-allowed border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              : "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          }`}
          disabled={
            metadata.metaTitle ===
            "Click on the button GENERATE SEO to generate the metaTitle."
          }
        />
        {touched.metaTitle && errors.metaTitle ? (
          <div className="text-red-500 text-xs mt-1">{errors.metaTitle}</div>
        ) : null}
      </div>
      <div className="flex flex-col">
        <label className="text-white text-sm my-2">Meta Description:</label>
        <input
          type="text"
          value={metadata.metaDescription.replace('Meta description:', '')}
          onChange={(e) => setFieldValue("metaDescription", e.target.value)}
          className={`${
            metadata.metaDescription ===
            "Click on the button GENERATE SEO to generate the metaDescription."
              ? "bg-gray-400 hover:cursor-not-allowed border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              : "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          }`}
          disabled={
            metadata.metaDescription ===
            "Click on the button GENERATE SEO to generate the metaDescription."
          }
        />
        {touched.metaDescription && errors.metaDescription ? (
          <div className="text-red-500 text-xs mt-1">
            {errors.metaDescription}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <label className="text-white text-sm my-2">Keywords:</label>
        <input
          type="text"
          value={metadata.keywords.replace('Keywords:', '')}
          onChange={(e) => setFieldValue("keywords", e.target.value)}
          className={`${
            metadata.keywords ===
            "Click on the button GENERATE SEO to  generate all the keywords."
              ? "bg-gray-400 hover:cursor-not-allowed border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              : "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          }`}
          disabled={
            metadata.keywords ===
            "Click on the button GENERATE SEO to  generate all the keywords."
          }
        />
        {touched.keywords && errors.keywords ? (
          <div className="text-red-500 text-xs mt-1">
            {errors.keywords}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SEOMetadataForm;
