import { useEffect } from "react";
import { useArticleStore } from "../store/article";
import ArticleCard from "./ArticleCard";
import './art.css'

const PublicArticles = () => {
  const { publicArticles, getAllArticle, isPublicLoading, publicError } = useArticleStore();

  useEffect(() => {
    getAllArticle();
  }, [getAllArticle]);

  if (isPublicLoading) return <div>Chargement des articles...</div>;
  if (publicError) return <div>Erreur : {publicError}</div>;

  return (
    <div className="public-articles-container">
      <h2>Tous nos produits</h2>
      <div className="articles-grid">
        {publicArticles?.length ? (
          publicArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <p>Aucun article disponible pour le moment</p>
        )}
      </div>
    </div>
  );
};

export default PublicArticles;