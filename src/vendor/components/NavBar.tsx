import { User } from "lucide-react";
import { useVendorStore } from "../store/authvendor";
import { useState } from "react";

const NavBar = () => {
  const { authVendor, logout } = useVendorStore();
  const [showLog, setShowLog] = useState(false);
  return (
    <nav className="w-full">
      <div>
        <div className="flex fle-col gap-4 rounded-lg bg-slate-50 duration-300 ">
          {authVendor ? (
            <div className="flex flex-col gap-2 rounded-lg bg-slate-50 duration-300">
              <div
                className="relative cursor-pointer bg-slate-50 rounded-lg text-black"
                onClick={() => setShowLog(!showLog)}
              >
                <img
                  src={authVendor.image}
                  alt={authVendor.name}
                  sizes="22"
                  className="rounded-full"
                />
      {authVendor && <h1>Welcome {authVendor.name} {authVendor.image}</h1>}

              </div>
              {showLog && (
                <div
                  onClick={() => {
                    logout();
                  }}
                  className="absolute top-4 left-6 bg-slate-600  p-4 rounded-lg "
                >
                  Se deconnecter
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => setShowLog(!showLog)}
              className="relative flex flex-col gap-2 bg-amber-200 p-2 m-2 rounded-full text-black border border-amber-400  cursor-pointer"
            >
              {" "}
                              <User />
                              {showLog && (<div className="absolute bottom-0 bg-slate-600 translate-y-20 p-4 rounded-lg">
                                  Se connecter
                              </div>)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
