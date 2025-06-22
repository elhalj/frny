import PublicArticles from "../articles/components/PublicArticles"

const Home = () => {
  return (
    <div className="min-h-screen bg-[#12192F] flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-600">Home</h1>
      <button type="button" className="btn btn-accent hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105">
        Bouton
      </button>
      <div className="mt-10 w-full max-w-4xl">
        <PublicArticles />
      </div>
    </div>
  )
}

export default Home

