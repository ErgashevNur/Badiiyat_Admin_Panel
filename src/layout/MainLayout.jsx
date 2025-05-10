import { Toaster } from "sonner";
import Navbar from "../components/Navbar";
import { Navigate } from "react-router-dom";

function MainLayout() {
  return (
    <div
      className="bg-[length:1000px_900px] bg-[position:860px_450px] bg-no-repeat"
      style={{ backgroundImage: "url('/bg.svg')" }}
    >
      <Navbar className="border-b border-[#292929]" />
      {children}

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default MainLayout;
