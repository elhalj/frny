import { useState } from "react";
import { useVendorStore, VendorLogin } from "../../store/authvendor";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isLogin, authVendor } = useVendorStore();
  const [fields, setFields] = useState<VendorLogin>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev: VendorLogin) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(fields);
      if (authVendor) {
        navigate("/vendor/admin/dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500/70 to-purple-600/70 backdrop-blur-lg">
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-8 shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">
          Connexion
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-300 mb-2 "
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
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-transparent text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-300 mb-2 "
          >
            Password:
          </label>

          <input
            type="password"
            name="password"
            value={fields.password}
            onChange={handleChange}
            placeholder="*********"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-transparent text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          disabled={isLogin}
          className="w-full py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300 ease-in-out"
        >
          {isLogin ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
