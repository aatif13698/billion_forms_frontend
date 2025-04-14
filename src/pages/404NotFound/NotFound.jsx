import { Link } from "react-router-dom";
import images from "../../constant/images";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <img
        src={images?.notFound2}
        alt="Page Not Found"
        className="md:w-96 w-80 h-auto"
      />
      <h1 className="md:text-3xl text-1xl font-bold mt-4">Oops! Page Not Found</h1>
      <p className="text-gray-500 mt-2">The page you are looking for doesn’t exist.</p>
      <Link
        to="/"
        className="w-auto px-4 my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
        bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark 
         hover:bg-custom-gradient-button-dark dark:hover:bg-custom-gradient-button-light 
         flex items-center justify-center"      >
        Go Home
      </Link>
    </div>
  );
}
