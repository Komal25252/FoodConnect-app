import { Link } from "react-scroll";
import About from "./about";
import Contact from "./Contact";

const LandingPage = () => {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-600">FoodConnect</h1>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link to="home" smooth={true} duration={500} className="cursor-pointer hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="about" smooth={true} duration={500} className="cursor-pointer hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="contact" smooth={true} duration={500} className="cursor-pointer hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sections */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
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
            <a
              href="/login-ngo"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition"
            >
              NGO Login
            </a>
            <a
              href="/register-ngo"
              className="bg-green-600 text-white py-2 px-4 rounded-lg text-center hover:bg-green-700 transition"
            >
              NGO Register
            </a>
          </div>

          {/* Restaurant Section */}
          <div className="flex flex-col space-y-4 bg-white shadow-md rounded-2xl p-6 w-72">
            <h2 className="text-lg font-bold text-gray-700 text-center">
              Restaurant Access
            </h2>
            <a
              href="/login-restaurant"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition"
            >
              Restaurant Login
            </a>
            <a
              href="/register-restaurant"
              className="bg-green-600 text-white py-2 px-4 rounded-lg text-center hover:bg-green-700 transition"
            >
              Restaurant Register
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-white">
        <About />
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center bg-gray-100">
        <Contact />
      </section>
    </div>
  );
};

export default LandingPage;
