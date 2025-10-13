import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

const RegisterRestaurant = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register-restaurant", formData);
      toast.success("Restaurant registered successfully! Please login.");
      navigate("/login-restaurant");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Restaurant Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Restaurant Name" className="w-full p-3 border rounded-lg" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded-lg" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
