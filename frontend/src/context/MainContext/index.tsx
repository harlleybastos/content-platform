import {
  ShapeArticleForm,
  ShapeArticleFormCreation,
  ShapeUserData,
} from "@/types";
import axios from "axios";
import { FormikHelpers } from "formik";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { formatDate } from "@/utils";
import { getCookie } from "cookies-next";
interface ShapeArticle {
  Items: ShapeArticleForm[];
}

type ShapeMainContext = {
  articles: ShapeArticle;
  isLoadingArticles: boolean;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  handlePublishArticle: (article: ShapeArticleForm) => Promise<void>;
  handleSubmitArticle: (
    values: ShapeArticleFormCreation,
    helper: FormikHelpers<ShapeArticleFormCreation>
  ) => Promise<void>;
  handleFetchArticles: () => Promise<void>;
};

export const MainContext = createContext<ShapeMainContext | undefined>(undefined);

type MainContextProps = {
  children: ReactNode;
};

export const MainContextProvider: React.FC<MainContextProps> = ({
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [articles, setArticles] = useState<ShapeArticle>({
    Items: [],
  });
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(true);
  const [userData, setUserData] = useState<ShapeUserData>();

  useEffect(() => {
    const storeUser = getCookie("user");
    if (storeUser) {
      setUserData(JSON?.parse(storeUser));
    }
  }, []);

  const handleFetchArticles = useCallback(async () => {
    try {
      setIsLoadingArticles(true);
      setArticles({
        Items: [],
      });
      const response = await axios.get("/api/getArticles");
      setArticles(response.data);
    } catch (error) {
      console.log("Error fetching articles:", error);
    } finally {
      setIsLoadingArticles(false);
    }
  }, []);

  useEffect(() => {
    handleFetchArticles();
  }, [handleFetchArticles]);

  const handlePublishArticle = useCallback(
    async (article: ShapeArticleForm) => {
      try {
        setIsLoadingArticles(true);
        await axios.put(`/api/publishArticle`, {
          id: article.id,
          title: article.title,
          content: article.content,
          author: userData?.attributes[3].given_name,
          category: article.category,
          authorProfilePhoto: userData?.attributes[6].picture,
          date: formatDate(),
          draft: false,
          comments: [],
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          keywords: article.keywords,
        });
        handleFetchArticles();
        toast.success("Article successfully published!");
      } catch (error) {
        toast.error("There was an error publishing the article!");
      } finally {
        setIsLoadingArticles(false);
      }
    },
    [handleFetchArticles, userData?.attributes]
  );

  const handleCreateArticle = useCallback(
    async (
      values: ShapeArticleFormCreation,
      helper: FormikHelpers<ShapeArticleFormCreation>
    ) => {
      try {
        setIsLoadingArticles(true);
        await axios.post("/api/createArticle", values);
        handleFetchArticles();
        toast.success("Your article has been sent for approval!");
        helper.resetForm();
      } catch (error) {
        console.log("Error creating the article:", error);
        toast.error("Error creating the article !");
      } finally {
        setIsLoadingArticles(false);
      }
    },
    [handleFetchArticles]
  );

  return (
    <MainContext.Provider
      value={{
        articles,
        currentIndex,
        isLoadingArticles,
        setCurrentIndex,
        handlePublishArticle,
        handleSubmitArticle: handleCreateArticle,
        handleFetchArticles,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error(
      "useMainContext must be used within an MainContextProvider"
    );
  }
  return context;
};
