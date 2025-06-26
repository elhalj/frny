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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          <label htmlFor="number">Number:</label>
          <input
            type="text"
            name="number"
            value={fields.number}
            onChange={handleChange}
            placeholder="Your phone number"
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={fields.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>
        <div>
          <label htmlFor="profilePic">Profile Picture:</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            ref={imageRef}
            onChange={handleChange}
            title="Upload your profile picture"
            placeholder="Profile picture"
            required
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
        <button type="submit" disabled={isSignUp}>
          {isSignUp ? "Loading..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

