/**
 * @file This file contains the garage page.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Lock, Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { getGarage, unlockVehicle } from "@/lib/api";

/**
 * The garage page component.
 * @returns The garage page.
 */
const GaragePage = () => {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState(1);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [selectedTab, setSelectedTab] = useState("cars");

  useEffect(() => {
    /**
     * Fetches the garage data from the server.
     */
    const fetchGarage = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const data = await getGarage(token);
        setVehicles(data);
        const user = JSON.parse(localStorage.getItem("user"));
        setPlayerPoints(user.points);
      }
    };
    fetchGarage();
  }, []);

  /**
   * Purchases a vehicle.
   * @param vehicleId The ID of the vehicle to purchase.
   * @param price The price of the vehicle.
   */
  const purchaseVehicle = async (vehicleId, price) => {
    const token = localStorage.getItem("token");
    if (token && playerPoints >= price) {
      await unlockVehicle(token, vehicleId);
      const data = await getGarage(token);
      setVehicles(data);
      const user = JSON.parse(localStorage.getItem("user"));
      setPlayerPoints(user.points - price);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      selectedTab === "all" || vehicle.type === selectedTab.slice(0, -1), // Remove 's' from 'cars'/'bikes'
  );

  /**
   * The stat bar component.
   * @param label The label of the stat.
   * @param value The value of the stat.
   * @param color The color of the stat bar.
   * @returns The stat bar component.
   */
  const StatBar = ({ label, value, color }) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Settings className="w-10 h-10 text-cyan-400" />
            <span className="text-cyan-400">Vehicle</span> Garage
          </h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">
              {playerPoints}
            </div>
            <div className="text-sm text-gray-400">Points</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            <Button
              onClick={() => setSelectedTab("all")}
              className={`px-6 py-2 ${
                selectedTab === "all"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              🚗 All Vehicles
            </Button>
            <Button
              onClick={() => setSelectedTab("cars")}
              className={`px-6 py-2 ${
                selectedTab === "cars"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              🏎️ Cars
            </Button>
            <Button
              onClick={() => setSelectedTab("bikes")}
              className={`px-6 py-2 ${
                selectedTab === "bikes"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              🏍️ Bikes
            </Button>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredVehicles.map((vehicle) => {
            const isOwned = vehicle.unlocked;
            const isSelected = selectedVehicle === vehicle.id;
            const canAfford = playerPoints >= vehicle.price;

            return (
              <Card
                key={vehicle.id}
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-b from-cyan-700 to-cyan-900 border-cyan-400 ring-2 ring-cyan-400"
                    : isOwned
                      ? "bg-gradient-to-b from-gray-700 to-gray-800 border-green-400 hover:border-cyan-400"
                      : canAfford
                        ? "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600 hover:border-yellow-400"
                        : "bg-gradient-to-b from-gray-900 to-black border-red-600 opacity-75"
                }`}
                onClick={() => isOwned && setSelectedVehicle(vehicle.id)}
              >
                <div className="relative">
                  {/* Vehicle Image */}
                  <div className="relative mb-4">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      className={`w-full h-32 object-cover rounded-lg ${!isOwned && !canAfford ? "grayscale" : ""}`}
                      style={{
                        backgroundColor: vehicle.color,
                        filter: isOwned
                          ? "brightness(1)"
                          : canAfford
                            ? "brightness(0.8)"
                            : "brightness(0.4)",
                      }}
                    />

                    {/* Status Badges */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {isSelected && (
                        <Badge className="bg-cyan-600 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                      {isOwned && !isSelected && (
                        <Badge className="bg-green-600 text-white">Owned</Badge>
                      )}
                      {!isOwned && (
                        <Badge
                          className={
                            canAfford
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                          }
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          {vehicle.price} pts
                        </Badge>
                      )}
                    </div>

                    {/* Vehicle Type */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {vehicle.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {vehicle.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mb-4">
                    <StatBar
                      label="Speed"
                      value={vehicle.stats.speed}
                      color="from-red-500 to-red-600"
                    />
                    <StatBar
                      label="Acceleration"
                      value={vehicle.stats.acceleration}
                      color="from-green-500 to-green-600"
                    />
                    <StatBar
                      label="Handling"
                      value={vehicle.stats.handling}
                      color="from-blue-500 to-blue-600"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    {isSelected ? (
                      <Button
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Currently Selected
                      </Button>
                    ) : isOwned ? (
                      <Button
                        onClick={() => setSelectedVehicle(vehicle.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Select Vehicle
                      </Button>
                    ) : canAfford ? (
                      <Button
                        onClick={() =>
                          purchaseVehicle(vehicle.id, vehicle.price)
                        }
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        Purchase for {vehicle.price} pts
                      </Button>
                    ) : (
                      <Button className="w-full bg-red-600 opacity-50" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Insufficient Points
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Selected Vehicle Preview */}
        {selectedVehicle && (
          <Card className="p-6 bg-gradient-to-r from-cyan-800 to-blue-800 border-cyan-400">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Currently Selected Vehicle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={
                    vehicles.find((v) => v.id === selectedVehicle)?.image ||
                    "/placeholder.svg"
                  }
                  alt={vehicles.find((v) => v.id === selectedVehicle)?.name}
                  className="w-full h-48 object-cover rounded-lg"
                  style={{
                    backgroundColor: vehicles.find(
                      (v) => v.id === selectedVehicle,
                    )?.color,
                  }}
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {vehicles.find((v) => v.id === selectedVehicle)?.name}
                </h3>
                <p className="text-gray-300 mb-4">
                  {vehicles.find((v) => v.id === selectedVehicle)?.description}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {
                        vehicles.find((v) => v.id === selectedVehicle)?.stats
                          .speed
                      }
                    </div>
                    <div className="text-sm text-gray-400">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {
                        vehicles.find((v) => v.id === selectedVehicle)?.stats
                          .acceleration
                      }
                    </div>
                    <div className="text-sm text-gray-400">Acceleration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {
                        vehicles.find((v) => v.id === selectedVehicle)?.stats
                          .handling
                      }
                    </div>
                    <div className="text-sm text-gray-400">Handling</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => router.push("/race")}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            🏁 Start Race
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="px-8 py-3"
          >
            🏠 Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GaragePage;
