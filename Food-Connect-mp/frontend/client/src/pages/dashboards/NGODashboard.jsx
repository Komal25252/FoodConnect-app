import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

const NGODashboard = () => {
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first!");
      navigate("/ngo-login");
    } else {
      setNgo(JSON.parse(storedUser));
      initializeNGO();
    }
  }, [navigate]);

  const initializeNGO = async () => {
    try {
      // Ensure NGO profile exists
      await api.post("/donations/migrate-user");
      fetchAvailableDonations();
      fetchMyRequests();
    } catch (error) {
      console.error("Error initializing NGO:", error);
      fetchAvailableDonations(); // Try to fetch anyway
      fetchMyRequests();
    }
  };
  
  const fetchAvailableDonations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/donations/available");
      setAvailableDonations(response.data.donations || []);
    } catch (error) {
      console.error("Error fetching available donations:", error);
      toast.error("Failed to load available donations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get("/donations/my-requests");
      setMyRequests(response.data.donations || []);
    } catch (error) {
      console.error("Error fetching my requests:", error);
      toast.error("Failed to load your requests");
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

  if (!ngo) return null;

  const handleRequestDonation = async (donationId) => {
    try {
      await api.post(`/donations/request/${donationId}`);
      toast.success("Request sent successfully!");
      fetchAvailableDonations();
      fetchMyRequests();
    } catch (error) {
      console.error("Error requesting donation:", error);
      toast.error("Failed to send request");
    }
  };

  const handleCompleteDonation = async (donationId) => {
    try {
      await api.post(`/donations/complete/${donationId}`);
      toast.success("Donation marked as completed!");
      fetchMyRequests();
    } catch (error) {
      console.error("Error completing donation:", error);
      toast.error("Failed to mark donation as completed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome, {ngo.name} 👋
        </h1>
        <p className="text-gray-700 mb-6">
          This is your NGO dashboard. From here, you can manage food requests,
          track donations, and collaborate with restaurants.
        </p>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => {
              setActiveTab("available");
              fetchAvailableDonations();
            }}
          >
            Available Donations
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "myRequests"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => {
              setActiveTab("myRequests");
              fetchMyRequests();
            }}
          >
            My Requests
          </button>
        </div>

        {/* Available Donations */}
        {activeTab === "available" && (
          <div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Available Donations</h2>
            
            {loading ? (
              <p className="text-gray-500">Loading donations...</p>
            ) : availableDonations.length === 0 ? (
              <p className="text-gray-500">No available donations at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDonations.map((donation) => (
                  <div key={donation._id} className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-lg">{donation.foodType}</h3>
                    <p className="text-gray-600">Quantity: {donation.quantity}</p>
                    <p className="text-gray-600">
                      Expiry: {new Date(donation.expiryTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Donor: {donation.restaurant?.name || "Anonymous Restaurant"}
                    </p>
                    <p className="text-gray-600">
                      Pickup Location: {donation.pickupLocation}
                    </p>
                    <p className="text-gray-600">
                      Preferred Option: {donation.preferredOption}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => handleRequestDonation(donation._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Request Donation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Requests */}
        {activeTab === "myRequests" && (
          <div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">My Requests</h2>
            
            {loading ? (
              <p className="text-gray-500">Loading your requests...</p>
            ) : myRequests.length === 0 ? (
              <p className="text-gray-500">You haven't made any requests yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRequests.map((donation) => (
                  <div key={donation._id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{donation.foodType}</h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        donation.status === "Requested" ? "bg-yellow-100 text-yellow-800" :
                        donation.status === "Accepted" ? "bg-green-100 text-green-800" :
                        donation.status === "Completed" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                    <p className="text-gray-600">Quantity: {donation.quantity}</p>
                    <p className="text-gray-600">
                      Expiry: {new Date(donation.expiryTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Restaurant: {donation.restaurant?.name || "Unknown Restaurant"}
                    </p>
                    <p className="text-gray-600">
                      Pickup Location: {donation.pickupLocation}
                    </p>
                    <p className="text-gray-600">
                      Preferred Option: {donation.preferredOption}
                    </p>
                    {donation.requestedAt && (
                      <p className="text-gray-500 text-sm mt-2">
                        Requested: {new Date(donation.requestedAt).toLocaleString()}
                      </p>
                    )}
                    {donation.acceptedAt && (
                      <p className="text-green-600 text-sm">
                        Accepted: {new Date(donation.acceptedAt).toLocaleString()}
                      </p>
                    )}
                    {donation.completedAt && (
                      <p className="text-blue-600 text-sm">
                        Completed: {new Date(donation.completedAt).toLocaleString()}
                      </p>
                    )}
                    
                    {donation.status === "Accepted" && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleCompleteDonation(donation._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
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

export default NGODashboard;
