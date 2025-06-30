import { useState } from "react";
import { UserLogin, useUserStore } from "../../store/authuser";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isLogin } = useUserStore();
  const [fields, setFields] = useState<UserLogin>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(fields);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center text-white mb-6">Connexion</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-2">Email:</label>
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
        <div className="mb-6">
          <label htmlFor="password" className="block text-white mb-2">Password:</label>
          <input
            type="password"
            name="password"
            value={fields.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          disabled={isLogin}
          className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded transition duration-300 ease-in-out"
        >
          {isLogin ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
