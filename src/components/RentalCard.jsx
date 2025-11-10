import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import { useLanguage } from "../context/LanguageContext";

export default function RentalCard({ rental }) {
  const { translate } = useLanguage();

  if (!rental) {
    return null;
  }

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-[1100px] w-full mx-auto bg-gray-900 rounded-xl shadow-xl overflow-hidden flex flex-col sm:flex-row">
      {/* Car Image */}
      <div className="sm:w-1/2 w-full">
        <img
          src={
            getImageUrl(rental.image) ||
            "https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg"
          }
          alt={rental.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg";
          }}
        />
      </div>

      {/* Info Panel */}
      <div className="sm:w-1/2 w-full flex flex-col justify-between p-6 bg-gray-800 text-white">
        {/* Title + Availability */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold tracking-wide text-yellow-400">
            {rental.name}
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
            {translate("rental.card.available")}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-6">
          <div>
            <span className="block text-gray-400">
              {translate("car.brand")}
            </span>
            <span className="font-semibold">{rental.brand}</span>
          </div>
          <div>
            <span className="block text-gray-400">
              {translate("car.model")}
            </span>
            <span className="font-semibold">{rental.model}</span>
          </div>
          <div>
            <span className="block text-gray-400">
              {translate("car.engine")}
            </span>
            <span className="font-semibold">{rental.engine}</span>
          </div>
          <div>
            <span className="block text-gray-400">
              {translate("car.fuelType")}
            </span>
            <span className="font-semibold">{rental.fuel}</span>
          </div>
          <div>
            <span className="block text-gray-400">
              {translate("rental.card.topSpeed")}
            </span>
            <span className="font-semibold">{rental.topSpeed}</span>
          </div>
          <div>
            <span className="block text-gray-400">
              {translate("rental.card.color")}
            </span>
            <span className="font-semibold">{rental.color}</span>
          </div>
        </div>

        {/* Availability + Price */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="block text-gray-400">
              {translate("rental.card.availableFrom")}
            </span>
            <span className="font-semibold">
              {formatDate(rental.availableDate)}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-gray-400">
              {translate("rental.card.pricePerDay")}
            </span>
            <span className="text-xl font-bold text-red-500">
              {formatPrice(rental.pricePerDay)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        
      </div>
    </div>
  );
}
