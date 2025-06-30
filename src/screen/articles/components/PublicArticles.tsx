import { useEffect } from "react";
import { useArticleStore } from "../../../store/article";
import ArticleCard from "./ArticleCard";

const PublicArticles = () => {
  const { publicArticles, getAllArticle, isPublicLoading, publicError } = useArticleStore();

  useEffect(() => {
    getAllArticle();
  }, [getAllArticle]);

  if (isPublicLoading) return <div className="text-center text-lg py-4">Chargement des articles...</div>;
  if (publicError) return <div className="text-center text-red-500 py-4">Erreur : {publicError}</div>;

  return (
    <div className="public-articles-container bg-gray-100 rounded-lg shadow-md p-6 backdrop-blur-md bg-opacity-50">
      <h2 className="text-3xl font-bold text-center mb-6">Tous nos produits</h2>
      <div className="articles-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicArticles?.length ? (
          publicArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun article disponible pour le moment</p>
        )}
      </div>
    </div>
  );
};

export default PublicArticles;
