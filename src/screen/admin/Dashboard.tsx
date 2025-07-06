import { NavLink } from "react-router-dom";
import { useArticleStore } from "../../store/article";
import { useEffect } from "react";

const vite_uploadUrl = import.meta.env.VITE_UPLOAD_URL_ADMIN_DASHBOARD;
const Dashboard = () => {
  const { getVendorArticle, vendorArticles } = useArticleStore();

  useEffect(() => {
    (async () => {
      await getVendorArticle();
    })();
  }, [getVendorArticle]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <NavLink
            to="/vendor/admin/dashboard/add"
            className="w-full block hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          >
            Add article
          </NavLink>
        </div>
        {Array.isArray(vendorArticles) && vendorArticles.length > 0 && (
          <ul className="w-full md:w-2/3">
            {vendorArticles.map((article) => (
              <li key={article._id} className="border-b py-2">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src={`${vite_uploadUrl}/${article.image}`}
                    alt={article.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div>
                    <p className="text-lg font-bold">{article.name}</p>
                    <p className="text-gray-600">{article.price}</p>
                    <p className="text-gray-600">{article.details}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

