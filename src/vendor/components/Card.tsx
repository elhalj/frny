import { useState } from "react";
import { Article } from "../../articles/store/article"

interface ArticleCardProps {
  articleVendor: Article;
}

const Card = ({ articleVendor }: ArticleCardProps) => {
  const [low, setLow] = useState(5)

  return (
    <>
      <div className="card bg-base-100 w-96 shadow-sm">
  {articleVendor.image && (<figure>
    
        <img 
          src={articleVendor.image} 
          alt={articleVendor.name} 
        />
      
  </figure>)}
  <div className="card-body">
    <h2 className="card-title">
     {articleVendor.name}
      <div className="badge badge-secondary">NEW</div>
    </h2>
    {articleVendor.details && (
          <p className="articleVendor-description">{articleVendor.details}</p>
          )}
          <span className="articleVendor-price">{articleVendor.price?.toFixed(2)} €</span>
          <span className="articleVendor-category">{articleVendor.category}</span>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">Fashion</div>
      <div className="badge badge-outline">Products</div>
          </div>
          {articleVendor.stock !== undefined && (
          <div className="articleVendor-stock">
            Stock : {articleVendor.stock > 0 
              ? (articleVendor.stock <= low 
                ? <span className="bg-red-200 px-2 py-1 rounded">{articleVendor.stock}</span> 
                : articleVendor.stock) 
              : "Épuisé"}
          </div>
          )}
          {typeof articleVendor.vendor === 'object' ? (
          <div className="articleVendor-vendor">
                      <p>Vendeur : {articleVendor.vendor.name}</p>
                      <p>ID : {articleVendor.vendor._id}</p>
          </div>
        ) : (
          <div className="articleVendor-vendor">
            Vendeur : {articleVendor.vendor}
          </div>
        )}
        </div>
         <div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {articleVendor._id ? "Modifier" : "Ajouter"}
                </button>
            </div>
</div>
           
    </>
  )
}

export default Card
