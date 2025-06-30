import { useRef, useState } from "react";
import { useUserStore } from "../../store/authuser";
import { FormUser } from "../../constants/types";

const Signup = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const { signUp, isSignUp } = useUserStore();
  const [fields, setFields] = useState<FormUser>({
    name: "",
    firstName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    municipality: "",
    street: "",
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (e.target instanceof HTMLInputElement) {
      const {files} = e.target;
      setFields((prev) => ({
        ...prev,
        [name]: type === "file" ? (files && files[0]) || null : value,
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Si ton backend attend un FormData (cas courant avec fichiers)
    const data = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null) { data.append(key, value as string | Blob)};
    });
    await signUp(data as unknown as FormUser); // Adapter le type de signUp côté store
    if (imageRef.current) {
      imageRef.current.value = "";
    } // reset champ fichier si besoin
  };

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="John"
            required

            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            FirstName:
          </label>
          <input
            type="text"
            name="firstName"
            value={fields.firstName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="johndoe@gmail.com"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={fields.password}
            onChange={handleChange}
            placeholder="********"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address:
          </label>
          <input
            type="text"
            name="address"
            value={fields.address}
            onChange={handleChange}
            placeholder="Abidjan rue 25 jean-chale"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="city"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            City:
          </label>
          <input
            type="text"
            name="city"
            value={fields.city}
            onChange={handleChange}
            placeholder="Abidjan"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="municipality"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Municipality:
          </label>
          <input
            type="text"
            name="municipality"
            value={fields.municipality}
            onChange={handleChange}
            placeholder="cocody"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="street"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Street:
          </label>
          <input
            type="text"
            name="street"
            value={fields.street}
            onChange={handleChange}
            placeholder="Street name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Profile Picture:
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={imageRef}
            onChange={handleChange}
            title="Upload your profile picture"
            placeholder="Profile picture"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div>
            {fields.image && (
              <img
                src={URL.createObjectURL(fields.image).toString()}
                className="w-10 h-10"
                alt="profile preview"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSignUp}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isSignUp ? "Loading..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

