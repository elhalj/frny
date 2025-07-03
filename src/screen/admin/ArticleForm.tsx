import { LucideCamera } from "lucide-react";
import { useMemo, useRef, useState, useCallback } from "react";
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

// Define validation errors type
type ValidationErrors = {
  name?: string;
  price?: string;
  details?: string;
  category?: string;
  stock?: string;
  image?: string;
};

const ArticleForm = () => {
  const { add, isAdd, isError } = useArticleStore(); // Article store hooks
  const { authVendor } = useVendorStore(); // Vendor store hooks
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for image URL
  const [isUploading, setIsUploading] = useState(false); // State for upload status
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Validation function
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!article.name.trim()) {
      errors.name = "Article name is required";
    }

    if (article.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!article.details.trim()) {
      errors.details = "Article details are required";
    }

    if (!article.category.trim()) {
      errors.category = "Category is required";
    }

    if (article.stock < 0) {
      errors.stock = "Stock cannot be negative";
    }

    if (!imageUrl && !article.image) {
      errors.image = "Image is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [article, imageUrl]);

  // Function to upload the image
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.url) {
        throw new Error("No URL returned from upload");
      }

      setImageUrl(response.data.url);
      return response.data.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown upload error";
      setUploadError(`Upload failed: ${message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle input changes
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    // Clear validation error for the field being changed
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size must be less than 5MB");
        return;
      }
      
      setArticle(prev => ({ ...prev, image: file }));
      
      try {
        await uploadImage(file);
        // Clear any previous upload errors
        setUploadError(null);
      } catch (error) {
        console.error("Upload failed:", error);
        // Error is already set in uploadImage function
      }
    } else {
      // Handle other input types
      const processedValue = name === "price" || name === "stock" 
        ? Number(value) 
        : value;
      
      setArticle(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  // Reset form function
  const resetForm = useCallback(() => {
    setArticle(initialState);
    setImageUrl(null);
    setUploadError(null);
    setValidationErrors({});
    setSuccessMessage(null);
    
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  }, [initialState]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting || isAdd) {
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if image is still uploading
    if (isUploading) {
      setUploadError("Please wait for image upload to complete");
      return;
    }

    // Check if we have an image URL
    if (!imageUrl) {
      setUploadError("Image not uploaded yet");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparing article data for submission
      const articleData: FormArticle = {
        name: article.name.trim(),
        price: article.price,
        details: article.details.trim(),
        category: article.category.trim(),
        stock: article.stock,
        image: imageUrl,
      };

      console.log("Submitting article:", articleData);

      await add(articleData);
      
      // Show success message
      setSuccessMessage("Article added successfully!");
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 2000); // Reset after 2 seconds to show success message
      
    } catch (error) {
      console.error("Failed to submit article:", error);
      // Error handling is managed by the store, but we can add additional UI feedback here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = isAdd || isSubmitting || isUploading;

  return (
    <div className="w-full max-w-md mx-auto mt-10 bg-gray-100 bg-opacity-50 rounded-lg shadow-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Article Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            title="Enter the article name"
            placeholder="Article name"
            value={article.name}
            onChange={handleChange}
            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Article Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            title="Enter the article price"
            placeholder="Article price"
            value={article.price}
            onChange={handleChange}
            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.price && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700"
          >
            Article Details *
          </label>
          <input
            type="text"
            id="details"
            name="details"
            title="Enter the article details"
            placeholder="Article details"
            value={article.details}
            onChange={handleChange}
            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.details ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.details && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.details}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Article Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            title="Enter the category name"
            placeholder="Category name"
            value={article.category}
            onChange={handleChange}
            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.category && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Article Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            title="Enter the article stock"
            placeholder="Article stock"
            value={article.stock}
            onChange={handleChange}
            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.stock && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.stock}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Article Image *
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            ref={imageRef}
            onChange={handleChange}
            className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              validationErrors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isUploading}
            required
          />

          {/* Image upload status and preview */}
          {isUploading && (
            <div className="mt-2 flex items-center text-blue-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Upload in progress...
            </div>
          )}

          {uploadError && (
            <div className="mt-2 text-red-500">{uploadError}</div>
          )}

          {validationErrors.image && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.image}</p>
          )}

          {/* Image preview */}
          {article.image && !uploadError && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(article.image)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
              {imageUrl && (
                <div className="text-green-500 text-sm mt-1">✓ Upload successful</div>
              )}
            </div>
          )}

          {!article.image && !imageUrl && (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 flex items-center justify-center mt-2">
              <LucideCamera className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isSubmitDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={isSubmitDisabled}
        >
          {isSubmitting || isAdd ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isUploading ? "Uploading..." : "Adding Article..."}
            </>
          ) : (
            "Add Article"
          )}
        </button>

        {/* Error display */}
        {isError && (
          <div className="text-red-500 py-2 bg-red-50 border border-red-200 rounded p-3">
            <strong>Error:</strong> {isError}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="text-green-500 py-2 bg-green-50 border border-green-200 rounded p-3">
            <strong>Success:</strong> {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default ArticleForm;