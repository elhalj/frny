import { useState } from "react";
import { useUserStore } from "../../store/authuser";
import { FormUser } from "../../constants/types";
import { Image, LocateFixed, LocateIcon, Lock, Mail, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SignupUserPropsError {
  name?: string;
  firstName?: string;
  email?: string;
  password?: string;
  address?: string;
  city?: string;
  street?: string;
  municipality?: string;
  image?: string;
}
const Signup = () => {
  const { signUp, isSignUp } = useUserStore();
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormUser>({
    name: "",
    firstName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    street: "",
    municipality: "",
    image: null as File | null,
  });
  const [errors, setErrors] = useState<SignupUserPropsError>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: SignupUserPropsError = {};

    if (!fields.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (fields.name.length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!fields.firstName.trim()) {
      newErrors.firstName = "Le prenom est requis";
    } else if (fields.firstName.length < 2) {
      newErrors.firstName = "Le prenom doit contenir au moins 2 caractères";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(fields.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!fields.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (fields.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!fields.address) {
      newErrors.address = "L'address est requise";
    }

    if (!fields.city) {
      newErrors.city = "La ville est requise";
    }
    if (!fields.municipality) {
      newErrors.municipality = "La commune est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof SignupUserPropsError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        //2 MB limit
        setErrors((prev) => ({
          ...prev,
          image: "La taille de l'image ne doit pas depasser 2MB",
        }));
        return;
      }

      const allowedFileType = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedFileType.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image:
            "Le type de fichier doit etre de type [JPEG, PNG, GIF, WEBP]",
        }));
        return;
      }
      setFields((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", fields.name);
      formData.append("firstName", fields.firstName);
      formData.append("email", fields.email);
      formData.append("password", fields.password);
      formData.append("address", fields.address);
      formData.append("city", fields.city);
      formData.append("street", fields.street);
      formData.append("municipality", fields.municipality);

      if (fields.image) {
        formData.append("image", fields.image);
      }
      await signUp(formData);
      navigate("/user/sign-in");
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Une erreur est survenue lors de l'inscription",
      }));
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
          <p className="text-gray-600">Faites vos achats en toute tranquilité</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-400">
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
                  arria-label="Upload profile image"
                  placeholder="Upload profile image"
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
                Nom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Nom"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prenom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="firstName"
                  value={fields.firstName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Prenom"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                name="password"
                value={fields.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Mot de passe"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <div className="relative">
              <LocateIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="address"
                value={fields.address}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Adresse"
                title="Veuillez entrer votre adresse"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              name="city"
              value={fields.city}
              onChange={handleInputChange}
              className={`w-full pl-3 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ville"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commune *
            </label>
            <input
              type="text"
              name="municipality"
              value={fields.municipality}
              onChange={handleInputChange}
              className={`w-full pl-3 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.municipality ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Commune"
            />
            {errors.municipality && (
              <p className="text-red-500 text-sm mt-1">{errors.municipality}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartier
            </label>
            <div className="relative">
              <LocateFixed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="street"
                value={fields.street}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Quartier"
              />
            </div>
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && isSignUp ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <a href="/user/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

