export interface ShapeComment {
  comment: string;
  index: number;
  date: string;
  rating: number;
  userPhoto: string;
  userName: string;
  isApproved: boolean;
}
export interface ShapeArticleFormCreation {
  title: string;
  content: string;
  category: string;
  author: string;
  authorProfilePhoto: string;
  date: string;
  comments: ShapeComment[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}
export interface ShapeArticleForm {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorProfilePhoto: string;
  date: string;
  draft: boolean;
  comments: ShapeComment[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface ShapeArticle {
  Items: ShapeArticleForm[];
}

export interface ShapeSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage?: string;
  group: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}

export interface UploadError {
  success: boolean;
  error: string;
}

export interface ShapeUserData {
  attributes: {
    [0]: {
      sub: string;
    };
    [1]: {
      email_verified: string;
    };
    [2]: {
      "custom:group": string;
    };
    [3]: {
      given_name: string;
    };
    [4]: {
      family_name: string;
    };
    [5]: {
      email: string;
    };
    [6]: {
      picture: string;
    };
  };
}

export interface ShapeMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}
