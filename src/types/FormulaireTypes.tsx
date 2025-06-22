// components/Form/Form.tsx
import {
  Contact,
  FileImage,
  Lock,
  Mail,
  MapPin,
  User,
  VenusAndMars,
} from "lucide-react";
import {
  ChangeEvent,
  FormEventHandler,
  ReactNode,
  useCallback,
  useState,
} from "react";

type FormField = {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  nested?: boolean;
  // value: string | number;
  placeholder?: string;
  title?: string;
  options?: Array<{ value: string | number; label: string }>;
};

type GenericFormProps<T> = {
  fields: FormField[];
  onSubmit: (data: T) => Promise<void>;
  submitText: string;
  loadingText?: string;
  isLoading?: boolean;
  error?: string | null;
  initialValues: T;
  children?: ReactNode;
};

export const GenericForm = <T extends Record<string, string | boolean | unknown>>({
  fields,
  onSubmit,
  submitText,
  loadingText = "Chargement...",
  isLoading = false,
  error,
  initialValues,
  children,
}: GenericFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialValues);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const path = name.split(".");

      setFormData((prev) => {
        const newData = structuredClone(prev);
        let current: Record<string, unknown> = newData;

        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
          }
          current = current[key] as Record<string, unknown>;
        }

        const lastKey = path[path.length - 1];
        // Gestion correcte des fichiers
        if (type === "file") {
          const file = (e.target as HTMLInputElement).files?.[0] || null;
          current[lastKey] = file;
        } else {
          current[lastKey] = value;
        }

        return newData;
      });
    },
    []
  );

  const getNestedValue = useCallback((obj: T, path: string): string => {
    return path.split(".").reduce((acc: unknown, key) => {
      if (
        acc &&
        typeof acc === "object" &&
        key in (acc as Record<string, unknown>)
      ) {
        return (acc as Record<string, unknown>)[key];
      }
      return "";
    }, obj as unknown) as string;
  }, []);

  const renderInputField = (field: FormField) => {
    const value = getNestedValue(formData, field.name);

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={value}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            required={field.required}
            title={field?.label}
          >
            {" "}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "file":
        return (
          <input
            type="file"
            name={field.name}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            required={field.required}
            title={field?.label}
            placeholder={field?.label}
            aria-label={field?.label}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={handleChange}
            className="mt-1 p-2 border rounded"
            required={field.required}
            title={field?.label}
            placeholder={field?.label}
          />
        );
    }
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 p-2 border shadow-2xl"
      >
        {fields.map((field) => (
          <label key={field.name} className="flex flex-col p-2 w-full">
            <div className="flex gap-2 items-center">
              {getFieldIcon(field.label)}
              <span>{field.label}</span>
            </div>
            {renderInputField(field)}
          </label>
        ))}

        {children}

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? loadingText : submitText}
        </button>

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
};

// Helper function to get nested values
// Helper function with proper typing
// const getNestedValue = <T extends Record<string, unknown>>(
//   obj: T,
//   path: string
// ): string => {
//   return path.split(".").reduce((acc: unknown, key) => {
//     if (isRecord(acc)) {
//       return acc[key] ?? "";
//     }
//     return "";
//   }, obj) as string;
// };

// // Type guard for records
// const isRecord = (value: unknown): value is Record<string, unknown> => {
//   return typeof value === "object" && value !== null && !Array.isArray(value);
// };
// Helper function pour les icônes
const getFieldIcon = (label: string) => {
  const iconProps = { className: "inline", size: 20 };
  switch (label) {
    case "Email":
      return <Mail {...iconProps} />;
    case "Nom":
    case "Prénom":
      return <User {...iconProps} />;
    case "Mot de passe":
      return <Lock {...iconProps} />;
    case "Ville":
    case "Commune":
      return <MapPin {...iconProps} />;
    case "Numéro":
      return <Contact {...iconProps} />;
    case "Genre":
      return <VenusAndMars {...iconProps} />;
    case "Photo de profil":
      return <FileImage {...iconProps} />;
    default:
      return null;
  }
};
