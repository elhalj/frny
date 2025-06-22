import { useEffect } from "react";
import { useArticleStore } from "../../articles/store/article";
import CrudLayout from "../components/_layout";
import Card from "../components/Card";
import CrudBar from "../components/CrudBar";
import NavBarVendor from "../components/NavBar";
import { useVendorStore } from "../store/authvendor";

const Dashboard = () => {
  const { vendorArticles, isVendorLoading, vendorError, getVendorArticle } = useArticleStore();
  const { checkAuthVendor, authVendor } = useVendorStore();
  console.log('Articles du vendeur:', vendorArticles)

 useEffect(() => { 
  const initializeAuth = async () => {
    await checkAuthVendor();
  };
  initializeAuth();
}, [checkAuthVendor]);

useEffect(() => {
  if (authVendor) {
    getVendorArticle();
  }
}, [authVendor, getVendorArticle]);

    // if (isVendorLoading) return <div>Chargement des articles...</div>;
    // if (vendorError) return <div>Erreur : {vendorError}</div>;


  return (
    <div className="flex">
      <CrudBar />
      <div className="w-full">
        <NavBarVendor />
        <CrudLayout>
          <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {isVendorLoading ? (
              <div className="text-center py-8">
                <p>Chargement des articles...</p>
              </div>
            ) : vendorError ? (
              <div className="text-center py-8 text-red-500">
                <p>Erreur : {vendorError}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {vendorArticles?.map((art) => (
                  <Card 
                    key={art._id} 
                    articleVendor={art}
                  />
                ))}
                {!vendorArticles?.length && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Aucun article disponible actuellement
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CrudLayout>
      </div>
    </div>
);
}

export default Dashboard;
