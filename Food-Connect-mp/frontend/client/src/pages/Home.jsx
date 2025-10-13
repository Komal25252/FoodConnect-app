import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
        Welcome to FoodConnect
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-xl">
        Bridging the gap between restaurants and NGOs to reduce food waste and
        help communities in need.
      </p>

      {/* Auth Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NGO Section */}
        <div className="flex flex-col space-y-4 bg-white shadow-md rounded-2xl p-6 w-72">
          <h2 className="text-lg font-bold text-gray-700 text-center">
            NGO Access
          </h2>
          <Link
            to="/login-ngo"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition"
          >
            NGO Login
          </Link>
          <Link
            to="/register-ngo"
            className="bg-green-600 text-white py-2 px-4 rounded-lg text-center hover:bg-green-700 transition"
          >
            NGO Register
          </Link>
        </div>

        {/* Restaurant Section */}
        <div className="flex flex-col space-y-4 bg-white shadow-md rounded-2xl p-6 w-72">
          <h2 className="text-lg font-bold text-gray-700 text-center">
            Restaurant Access
          </h2>
          <Link
            to="/login-restaurant"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition"
          >
            Restaurant Login
          </Link>
          <Link
            to="/register-restaurant"
            className="bg-green-600 text-white py-2 px-4 rounded-lg text-center hover:bg-green-700 transition"
          >
            Restaurant Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;