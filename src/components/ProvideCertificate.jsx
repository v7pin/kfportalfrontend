import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; // Import BrowserRouter and Route
import axios from "axios";

const ProvideCertificate = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dateOfJoining: "",
    certificateType: "OFFER Letter",
  });
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchClaims = async () => {
      const response = await axios.get("http://localhost:5000/api/claims");
      setClaims(response.data);
    };
    fetchClaims();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendCertificate = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-certificate", {
        ...formData,
        id: selectedClaim.id,
      });
      setMessage("Certificate sent successfully!");
      setSelectedClaim(null);
      setFormData({ name: "", dateOfJoining: "", certificateType: "OFFER Letter" });
      const response = await axios.get("http://localhost:5000/api/claims");
      setClaims(response.data);
    } catch (error) {
      setMessage("Failed to send certificate.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClaims = claims.filter(claim =>
    claim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Provide Certificate</h1>
        {message && <p className="text-center text-green-500 mb-4">{message}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Claimed At</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((claim) => (
                <tr key={claim.id}>
                  <td className="py-2 px-4 border">{claim.name}</td>
                  <td className="py-2 px-4 border">{claim.email}</td>
                  <td className="py-2 px-4 border">{claim.claimed_at}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(filteredClaims.length / itemsPerPage)).keys()].map(number => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 mx-1 ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
        {selectedClaim && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Send Certificate</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSendCertificate(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Date of Joining</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Certificate Type</label>
                  <select
                    name="certificateType"
                    value={formData.certificateType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="OFFER Letter">OFFER Letter</option>
                    <option value="Experience Letter">Experience Letter</option>
                    <option value="Relieving Letter">Relieving Letter</option>
                    <option value="Appreciation Certificate">Appreciation Certificate</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                    onClick={() => setSelectedClaim(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/admin/sent-certificates" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Sent Certificates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProvideCertificate;
