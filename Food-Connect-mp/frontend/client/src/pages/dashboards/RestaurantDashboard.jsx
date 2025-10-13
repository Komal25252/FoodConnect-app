import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DonationForm from "../../components/DonationForm";
import api from "../../api";

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("addDonation");

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first!");
      navigate("/restaurant-login");
    } else {
      setRestaurant(JSON.parse(storedUser));
      initializeRestaurant();
    }
  }, [navigate]);

  const initializeRestaurant = async () => {
    try {
      // Ensure restaurant profile exists
      await api.post("/donations/migrate-user");
      fetchDonations();
    } catch (error) {
      console.error("Error initializing restaurant:", error);
      fetchDonations(); // Try to fetch anyway
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/donations/requests");
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  if (!restaurant) return null;

  const handleDonationAdded = (newDonation) => {
    fetchDonations();
    setActiveTab("requests");
  };

  const handleAcceptRequest = async (donationId) => {
    try {
      await api.post(`/donations/accept/${donationId}`);
      toast.success("Request accepted successfully!");
      fetchDonations();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (donationId) => {
    try {
      await api.post(`/donations/reject/${donationId}`);
      toast.success("Request rejected successfully!");
      fetchDonations();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Welcome, {restaurant.name} 🍴
        </h1>
        <p className="text-gray-700 mb-6">
          This is your Restaurant dashboard. From here, you can manage food
          donations, view NGO requests, and track your impact.
        </p>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "addDonation"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-green-500"
              }`}
            onClick={() => setActiveTab("addDonation")}
          >
            Add Donation
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "requests"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-green-500"
              }`}
            onClick={() => setActiveTab("requests")}
          >
            NGO Requests {donations.length > 0 && `(${donations.length})`}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "addDonation" && (
          <DonationForm onDonationAdded={handleDonationAdded} />
        )}

        {activeTab === "requests" && (
          <div className="bg-white rounded-lg">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">NGO Requests</h2>

            {loading ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : donations.length === 0 ? (
              <p className="text-gray-500">No pending requests at the moment.</p>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation._id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{donation.foodType}</h3>
                        <p className="text-gray-600">Quantity: {donation.quantity}</p>
                        <p className="text-gray-600">
                          Expiry: {new Date(donation.expiryTime).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          Requested by: {donation.requestedBy?.name || "Unknown NGO"}
                        </p>
                        <p className="text-gray-600">
                          Requested at: {new Date(donation.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleAcceptRequest(donation._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(donation._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
