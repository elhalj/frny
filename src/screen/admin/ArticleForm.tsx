import { LucideCamera } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useArticleStore } from "../../store/article";
import { FormArticle } from "../../constants/types";

type Article = {
  _id?: string;
  name: string;
  price: number;
  details: string;
  category: string;
  stock: number;
  rate?: number;
  image: File | null;
  vendor?:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
};
const ArticleForm = () => {
  const { articles, getVendorArticle, add, updateArticle, isError } =
    useArticleStore();
  const initialState = useMemo<Article>(
    () => ({
      name: "",
      price: 0,
      details: "",
      category: "",
      stock: 0,
      rate: 0,
      image: null,
      vendor: undefined,
    }),
    []
  );
  const [article, setArticle] = useState<Article>(initialState);
  const { id } = useParams<{ id: string }>();
  const imageRef = useRef<HTMLInputElement>(null);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setArticle({ ...article, [name]: files[0] });
    } else {
      setArticle({ ...article, [name]: value });
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isError) {
      console.log("Please fix the errors and try again" + isError);
      return;
    }
    const formData = new FormData();
    Object.entries(article).forEach(([key, value]) => {
      if (key !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });
    if (id) {
      // Update existing article
      formData.append("_id", id);
      await updateArticle(
        formData as unknown as import("../../store/article").Article,
        id
      );
    } else {
      // Add new article
      await add(formData as unknown as FormArticle);
      if (imageRef.current) {
        imageRef.current.value = ""; // Reset file input
      }
    }
  };
    
  useEffect(() => {
    const fetchArticles = async () => {
      await getVendorArticle();
    };
    if (id) {
      // If id is present, fetch the article to edit
      fetchArticles();
      const articleToEdit = articles?.find((art) => art._id === id);
      if (articleToEdit) {
        setArticle({
          name: articleToEdit.name ?? "",
          price: articleToEdit.price ?? 0,
          details: articleToEdit.details ?? "",
          category: articleToEdit.category ?? "",
          stock: articleToEdit.stock ?? 0,
          rate: articleToEdit.rate ?? 0,
          image: null, // Reset image to null for file input
          vendor: Array.isArray(articleToEdit.vendor)
            ? undefined
            : articleToEdit.vendor && typeof articleToEdit.vendor === "object"
            ? {
                _id: articleToEdit.vendor._id,
                name: articleToEdit.vendor.name,
                email: articleToEdit.vendor.email ?? "",
              }
            : articleToEdit.vendor,
        });
      }
    } else {
      // Reset form for adding a new article
      setArticle(initialState);
    }
  }, [id, articles, getVendorArticle, initialState]);
  return (
    <div className="w-full max-w-md mx-auto mt-10 bg-gray-100 bg-opacity-50 rounded-lg shadow-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Article Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            title="Enter the article name"
            placeholder="Article name"
            value={article.name}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Article Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            title="Enter the article price"
            placeholder="Article price"
            value={article.price}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700"
          >
            Article Details
          </label>
          <input
            type="text"
            id="details"
            name="details"
            title="Enter the article details"
            placeholder="Article details"
            value={article.details}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Article Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            title="Enter the category name"
            placeholder="Category name"
            value={article.category}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Article stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            title="Enter the article stock"
            placeholder="Article stock"
            value={article.stock}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Article Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            ref={imageRef}
            title="Upload the article image"
            placeholder="Article image"
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <img
            src={article.image ? URL.createObjectURL(article.image) : undefined}
            alt={article.name}
            className="w-20 h-20"
          />
          <LucideCamera className="w-6 h-6 text-gray-500" />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {article._id ? "Update Article" : " Add Article"}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm;
