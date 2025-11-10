import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa';

function SoldCars() {
  const { translate } = useLanguage();
  const [soldCars, setSoldCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSoldCars();
  }, []);

  const fetchSoldCars = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sold-cars");
      setSoldCars(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sold cars:", error);
      setError("Failed to load sold cars");
      // Fallback to placeholder data if API fails
      setSoldCars([
        {
          id: 1,
          name: "Toyota Camry 2023",
          image:
            "https://di-uploads-pod25.dealerinspire.com/edmarktoyota/uploads/2022/09/2023-Toyota-Camry-_05-1024x578.jpg",
          description: "Toyota",
          soldDate: "2023-09-15",
        },
        {
          id: 2,
          name: "Honda Civic 2023",
          image:
            "https://images.hgmsites.net/med/2023-honda-civic-sdn_100862114_m.jpg",
          description: "Honda",
          soldDate: "2023-09-20",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">
            {translate("soldCars.title")}
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600 text-red-400 px-6 py-4 rounded-lg mb-8 backdrop-blur-sm">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : soldCars.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gold-400/60 text-xl">
              {translate("soldCars.empty")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {soldCars.map((car) => (
              <div
                key={car._id || car.id}
                className="group bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden 
                         border border-red-900/30 hover:border-red-600/50 
                         transform hover:-translate-y-1 transition-all duration-300
                         shadow-lg hover:shadow-red-900/20"
              >
                <div className="relative h-56 overflow-hidden">
                  {car.image ? (
                    <img
                      src={
                        car.image.startsWith("http")
                          ? car.image
                          : `${
                              import.meta.env.VITE_API_URL?.replace("/api", "") ||
                              "http://localhost:5001"
                            }${car.image}`
                      }
                      alt={car.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full
                                shadow-lg transform -rotate-12">
                    <FaTrophy className="inline-block mr-2" />
                    SOLD
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gold-300 mb-2 group-hover:text-gold-400">
                    {car.name}
                  </h3>
                  <p className="text-gold-400/80 mb-4">{car.description}</p>
                  <div className="flex items-center text-sm text-gold-400/60">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      Sold on: {new Date(car.soldDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SoldCars;
