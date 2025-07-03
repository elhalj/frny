import { LucideCamera } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useArticleStore } from "../../store/article";
import { useVendorStore } from "../../store/authvendor";
import api from "../../services/api";
import { FormArticle } from "../../constants/types";

// Define the type for the article
type Article = {
  name: string;
  price: number;
  details: string;
  category: string;
  stock: number;
  rate?: number;
  image?: File | null;
  vendor?:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
};

const ArticleForm = () => {
  const { add, isAdd, isError } = useArticleStore(); // Article store hooks
  const { authVendor } = useVendorStore(); // Vendor store hooks
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for image URL
  const [isUploading, setIsUploading] = useState(false); // State for upload status

  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initial state for the article form
  const initialState = useMemo<Article>(
    () => ({
      name: "",
      price: 2000,
      details: "",
      category: "",
      stock: 0,
      image: null,
      vendor: authVendor?._id || "", // Vendor ID
    }),
    [authVendor]
  );

  const [article, setArticle] = useState<Article>(initialState); // Article state
  const imageRef = useRef<HTMLInputElement>(null); // Reference for the image input

  // Function to upload the image
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload", formData);

      setImageUrl(response.data.url);
      return response.data.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      setUploadError(`Échec de l'upload: ${message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle input changes
 
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setArticle(prev => ({ ...prev, image: file }));
      
      try {
        const url = await uploadImage(file);
        setImageUrl(url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    } else {
      setArticle(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Article ajouté:", article);
    console.log("Image URL:", imageUrl);
    if (!imageUrl) {
      console.error("Image not uploaded yet");
      return;
    }

    // Preparing article data for submission
    const articleData: FormArticle = {
      name: article.name,
      price: article.price,
      details: article.details,
      category: article.category,
      stock: article.stock,
      image: imageUrl, // Utiliser l'URL directement
      // Le vendeur est géré par le backend via le token
    };

    await add(articleData);
    console.log("Article ajouté:", articleData);
    console.log("Image URL:", imageUrl);
    setArticle(initialState);
    setImageUrl(null);
    setUploadError(null); // Réinitialiser les erreurs

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

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
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="mt-2 text-blue-500">Upload en cours...</div>
          ) : uploadError ? (
            <div className="mt-2 text-red-500">{uploadError}</div>
          ) : article.image ? (
            <img
              src={URL.createObjectURL(article.image)}
              alt="Preview"
              className="w-20 h-20 object-cover mt-2"
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-20 h-20 object-cover mt-2"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 flex items-center justify-center mt-2">
              <LucideCamera className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isAdd }
        >
          {isAdd ? "Loading..." : "Add Article"}
        </button>
        {isError && <div className="text-red-500 py-2">Erreur: {isError}</div>}
      </form>
    </div>
  );
};

export default ArticleForm;
