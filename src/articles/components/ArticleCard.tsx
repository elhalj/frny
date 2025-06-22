import { useState } from "react";
import { Article } from "../store/article";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [low, setLow] = useState(5)

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {article.image && (
        <img 
          src={article.image} 
          alt={article.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      
      <div className="p-4">
        <h3 className="text-2xl font-bold">{article.name}</h3>
        
        {article.details && (
          <p className="text-gray-600">{article.details}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{article.price?.toFixed(2)} €</span>
          <span className="text-gray-600">{article.category}</span>
        </div>

        {article.stock && (
          <div className="mt-2">
            Stock : {article.stock > 0 ? article.stock : article.stock >=  low ? (
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

        {typeof article.vendor === 'object' ? (
          <div className="mt-4">
                      <p className="text-gray-600">Vendeur : {article.vendor.name}</p>
                      <p className="text-gray-600">ID : {article.vendor._id}</p>
          </div>
        ) : (
          <div className="mt-4">
            Vendeur : {article.vendor}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
