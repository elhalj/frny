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
      const files = e.target.files;
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
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Inscription</h1>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">FirstName:</label>
          <input
            type="text"
            name="firstName"
            value={fields.firstName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
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
            placeholder="********"
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            name="address"
            value={fields.address}
            onChange={handleChange}
            placeholder="Abidjan rue 25 jean-chale"
            required
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            name="city"
            value={fields.city}
            onChange={handleChange}
            placeholder="Abidjan"
            required
          />
        </div>
        <div>
          <label htmlFor="municipality">Municipality:</label>
          <input
            type="text"
            name="municipality"
            value={fields.municipality}
            onChange={handleChange}
            placeholder="cocody"
            required
          />
        </div>
        <div>
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            name="street"
            value={fields.street}
            onChange={handleChange}
            placeholder="Street name"
            required
          />
        </div>
        <div>
          <label htmlFor="image">Profile Picture:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={imageRef}
            onChange={handleChange}
            title="Upload your profile picture"
            placeholder="Profile picture"
            required
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
        <button type="submit" disabled={isSignUp}>
          {isSignUp ? "Loading..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

