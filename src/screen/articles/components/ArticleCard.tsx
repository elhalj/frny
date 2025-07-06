// import { Button } from "@nextui-org/react";
import { Article } from "../../../constants/types";
import { useCartStore } from "../../../store/cart";

interface ArticleCardProps {
  article: Article;
}

const vite_uploadUrlHome = import.meta.env.VITE_UPLOAD_URL_ADMIN_DASHBOARD;
const ArticleCard = ({ article }: ArticleCardProps) => {
  const { addToCart } = useCartStore();
  const low = 5

  console.log("article.image", article.image);

  return (
    <div className="bg-white text-gray-500 rounded-lg shadow-md p-4">
      {article.image && (
        <img 
          src={
            typeof article.image === "string" && article.image
              ? `${vite_uploadUrlHome}/${article.image}`
              : article.image instanceof File
                ? URL.createObjectURL(article.image)
                : ""
          }
          alt={article.name}
          className="w-full h-48 object-cover  "
          style={{ transition: "transform 0.3s ease", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
      )}
      
      <div className="p-4">
        <h3 className="text-2xl font-bold">{article.name}</h3>
        
        {article.details && (
          <p className="text-gray-600">Details: {article.details}</p>
        )}

        <div className="flex flex-col justify-between">
          <span className="text-lg font-bold">{Number(article.price).toFixed(2)} €</span>
          <span className="text-gray-600">Category: {article.category}</span>
        </div>

        {article.stock && (
          <div className="mt-2">
            Stock : {article.stock > 0 ? article.stock : article.stock <=  low ? (
              <div className="bg-red-200 p-2 rounded-md">
                {article.stock}
              </div>
            ) : (
              <div className="bg-gray-200 p-2 rounded-md">
                Épuisé
              </div>
            )}
          </div>
        )}

        {typeof article.vendor === 'object' && !Array.isArray(article.vendor) ? (
          <div className="mt-4">
            <p className="text-gray-600">Vendeur : {article.vendor.name}</p>
          </div>
        ) : Array.isArray(article.vendor) ? (
          <div className="mt-4">
            Vendeur : {article.vendor.join(", ")}
          </div>
        ) : (
          <div className="mt-4">
            Vendeur : {article.vendor}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button type="button" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => addToCart(article)}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;

