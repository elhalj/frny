import { useRef, useState } from "react";
import { FormVendor } from "../../constants/types";
import { useVendorStore } from "../../store/authvendor";

const Signup = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const { signUp, isSignUp } = useVendorStore();
  const [fields, setFields] = useState<FormVendor>({
    name: "",
    firstName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    municipality: "",
    number: "",
    gender: "Homme", // Default value,
    profilePic: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (e.target instanceof HTMLInputElement) {
      const { files } = e.target;
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
    const data = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value as string | Blob);
      }
    });
    await signUp(data as unknown as FormVendor);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Inscription
        </h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-white mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={fields.name}
              onChange={handleChange}
              placeholder="John"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-white mb-2">
              FirstName:
            </label>
            <input
              type="text"
              name="firstName"
              value={fields.firstName}
              onChange={handleChange}
              placeholder="Doe"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="johndoe@gmail.com"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-2">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-white mb-2">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={fields.address}
              onChange={handleChange}
              placeholder="Abidjan rue 25 jean-chale"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-white mb-2">
              City:
            </label>
            <input
              type="text"
              name="city"
              value={fields.city}
              onChange={handleChange}
              placeholder="Abidjan"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="municipality" className="block text-white mb-2">
              Municipality:
            </label>
            <input
              type="text"
              name="municipality"
              value={fields.municipality}
              onChange={handleChange}
              placeholder="cocody"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="number" className="block text-white mb-2">
              Number:
            </label>
            <input
              type="text"
              name="number"
              value={fields.number}
              onChange={handleChange}
              placeholder="Your phone number"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-white mb-2">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={fields.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select your gender</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
          <div>
            <label htmlFor="profilePic" className="block text-white mb-2">
              Profile Picture:
            </label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              ref={imageRef}
              onChange={handleChange}
              title="Upload your profile picture"
              placeholder="Profile picture"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div>
              {fields.profilePic && (
                <img
                  src={URL.createObjectURL(fields.profilePic).toString()}
                  className="w-10 h-10"
                  alt="profile preview"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSignUp}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {isSignUp ? "Loading..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

