import { useState } from "react";
import { useVendorStore, VendorLogin } from "../../store/authvendor";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isLogin } = useVendorStore();
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
      await login(fields); // Adapter le type de login côté store
      navigate("/")
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Inscription</h1>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="johndoe@gmail.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={fields.password}
            onChange={handleChange}
            placeholder="*********"
            required
          />
        </div>
        <button type="submit" disabled={isLogin}>
          {isLogin ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
