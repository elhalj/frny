import { useState } from "react";
import { FormArticle } from "../../constants/types";
import { useArticleStore } from "../../store/article";
import { Book, Calculator, Castle, Image, ShoppingBasket, Upload } from "lucide-react";


interface AddError {
  name?: string;
  price?: string;
  details?: string;
  category?: string;
  stock?: string;
  image?: string;
}

const AddArticleForm: React.FC = () => {
  const {add} = useArticleStore()
  const [formData, setFormData] = useState<FormArticle>({
    name: "",
    price: "2000",
    details: "",
    category: "",
    stock: "4",
    image:  null as File | null
  })

  const [errors, setErrors] = useState<AddError>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newError: AddError = {};

    if (!formData.name.trim()) {
      newError.name = "Le nom de l'article est requis"
    } else if (formData.name.length < 4) {
      newError.name = "Le nom de l'article doit au moins depasser 4 lettres"
    }

    if (!formData.details.trim()) {
     newError.details = "Les détails de l'article sont réquis"
    }
    
    if (!formData.category.trim()) {
      newError.category = "Vous devez ajouter un category de l'article"
    }

    if (!formData.image) {
      newError.image = "Veuillez sélectionner une image";
    }
    setErrors(newError);
    return Object.keys(newError).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof AddError]) {
      setErrors((prev) => ({...prev, [name]: undefined}))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({...prev, image: "La taille de l'image ne doit pas depasser  5MB"}))
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Le type de fichier n'est pas autorisé" }))
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      }
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("details", formData.details);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);

    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }
      
    await add(formDataToSend)
    } catch (error) {
      console.error("Erreur", error)
      alert("Erreur de connexion au server");
    } finally {
      setLoading(false);
    }
  }

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Ajouter un  article</h2>
          <p className="text-gray-600">Rejoignez notre communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Upload Image"
                  name="image"
                />
              </label>
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm text-center">{errors.image}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Price"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details *
            </label>
            <div className="relative">
              <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.details ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Entrez les détails de l'article"
                title="Détails de l'article"
              />
            </div>
            {errors.details && (
              <p className="text-red-500 text-sm mt-1">{errors.details}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <div className="relative">
              <Castle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Catégory"
              />
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <div className="relative">
              <ShoppingBasket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Stock"
              />
            </div>
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
            )}
          </div>

         

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </form>

        
      </div>
    </div>
  )
}

export default AddArticleForm