import { ArrowBigLeftDashIcon, ArrowBigRightDash } from "lucide-react";
import { Link } from "react-router-dom";

const InfoAdmin = () => {
  return (
    <div>
      <h2>Vous souhaitez devenir vendeur ?</h2>
      <Link to="/vendor/sign-up">
        <button type="submit" className="flex">
          <ArrowBigRightDash /> cliquer ici <ArrowBigLeftDashIcon />
        </button>
      </Link>
    </div>
  );
};

export default InfoAdmin;
