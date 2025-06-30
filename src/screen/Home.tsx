import PublicArticles from "./articles/components/PublicArticles"

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12192F] to-[#1F2A48] flex flex-col items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-600">Home</h1>
        <button type="button" className="btn btn-accent bg-indigo-500 hover:bg-indigo-400 transition duration-300 ease-in-out transform hover:scale-105">
          Bouton
        </button>
        <div className="mt-10">
          <PublicArticles />
        </div>
      </div>
    </div>
  )
}

export default Home

