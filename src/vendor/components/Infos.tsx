import { ArrowBigLeftDashIcon, ArrowBigRightDash } from "lucide-react";
import { Link } from "react-router-dom";

const InfoAdmin = (isScolling: { isScrolling: boolean}) => {
  return (
    <div className={` p-2 rounded-lg text-white  transition-all duration-300 ease-in-out ${isScolling.isScrolling ? "bg-indigo-900/50 backdrop-blur-lg shadow-lg" : "bg-indigo-900"}`}>
      <h2>Vous souhaitez devenir vendeur ?</h2>
      <Link to="/vendor/sign-up">
        <button type="submit" className="flex uppercase">
          <ArrowBigRightDash className="animate-bounce" /> cliquer ici <ArrowBigLeftDashIcon className="animate-bounce"/>
        </button>
      </Link>
    </div>
  );
};

export default InfoAdmin;
