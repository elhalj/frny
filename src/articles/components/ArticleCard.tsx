import { Article } from "../store/article";
import './art.css'

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div className="article-card">
      {article.image && (
        <img 
          src={article.image} 
          alt={article.name} 
          className="article-image"
        />
      )}
      
      <div className="article-content">
        <h3 className="article-title">{article.name}</h3>
        
        {article.details && (
          <p className="article-description">{article.details}</p>
        )}

        <div className="article-meta">
          <span className="article-price">{article.price?.toFixed(2)} €</span>
          <span className="article-category">{article.category}</span>
        </div>

        {article.stock && (
          <div className="article-stock">
            Stock : {article.stock > 0 ? article.stock : "Épuisé"}
          </div>
        )}

        {typeof article.vendor === 'object' ? (
          <div className="article-vendor">
                      <p>Vendeur : {article.vendor.name}</p>
                      <p>ID : {article.vendor._id}</p>
          </div>
        ) : (
          <div className="article-vendor">
            Vendeur : {article.vendor}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;