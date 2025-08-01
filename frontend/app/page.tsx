"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Wifi,
  Settings,
  Users,
  Play,
  LogOut,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * NetworkSpeedRacing component for the main game interface.
 * Manages game state, network simulation, and user interactions.
 */
const NetworkSpeedRacing = () => {
  /**
   * @type {[string, Function]} gameState - Current state of the game (e.g., "menu", "racing", "notfound").
   */
  const [gameState, setGameState] = useState("menu");
  /**
   * @type {[boolean, Function]} isRacing - Indicates if a race is currently in progress.
   */
  const [isRacing, setIsRacing] = useState(false);
  /**
   * @type {[number, Function]} raceTime - Current time elapsed in the race.
   */
  const [raceTime, setRaceTime] = useState(0);
  /**
   * @type {[object, Function]} playerData - Network data for the player (ping, download, upload).
   */
  const [playerData, setPlayerData] = useState({
    ping: 0,
    download: 0,
    upload: 0,
  });
  /**
   * @type {[object, Function]} opponentData - Network data for the opponent (ping, download, upload).
   */
  const [opponentData, setOpponentData] = useState({
    ping: 0,
    download: 0,
    upload: 0,
  });
  /**
   * @type {[number, Function]} playerPosition - Player's current position on the race track (0-100%).
   */
  const [playerPosition, setPlayerPosition] = useState(0);
  /**
   * @type {[number, Function]} opponentPosition - Opponent's current position on the race track (0-100%).
   */
  const [opponentPosition, setOpponentPosition] = useState(0);
  /**
   * @type {[object, Function]} selectedCar - Details of the currently selected vehicle.
   */
  const [selectedCar, setSelectedCar] = useState({
    id: 1,
    name: "Lightning Bolt",
    color: "#00ff88",
    unlocked: true,
    price: 0,
    type: "car",
    image: "/images/green-sports-car.png",
  });
  /**
   * @type {[number, Function]} playerPoints - Player's current in-game points.
   */
  const [playerPoints, setPlayerPoints] = useState(1850);
  /**
   * @type {[boolean, Function]} showTurbo - Controls the visibility of turbo effects.
   */
  const [showTurbo, setShowTurbo] = useState(false);
  /**
   * @type {[string|null, Function]} winner - Stores the winner of the race, if any.
   */
  const [winner, setWinner] = useState(null);
  /**
   * @type {[Array<string>, Function]} reactions - Array of emojis for in-game reactions.
   */
  const [reactions, setReactions] = useState([]);
  /**
   * @type {[Array<object>, Function]} obstacles - Array of obstacles on the race track.
   */
  const [obstacles, setObstacles] = useState([]);
  /**
   * @type {[boolean, Function]} showMultiplayerModal - Controls the visibility of the multiplayer modal.
   */
  const [showMultiplayerModal, setShowMultiplayerModal] = useState(false);
  /**
   * @type {[string, Function]} roomCode - Code for the multiplayer room.
   */
  const [roomCode, setRoomCode] = useState("");
  /**
   * @type {[boolean, Function]} isHost - Indicates if the current user is the host of the multiplayer room.
   */
  const [isHost, setIsHost] = useState(false);
  /**
   * @type {[string, Function]} vehicleType - Type of vehicle selected (e.g., "car", "bike").
   */
  const [vehicleType, setVehicleType] = useState("car");
  /**
   * @type {[boolean, Function]} playerHitObstacle - Indicates if the player's vehicle hit an obstacle.
   */
  const [playerHitObstacle, setPlayerHitObstacle] = useState(false);
  /**
   * @type {[boolean, Function]} opponentHitObstacle - Indicates if the opponent's vehicle hit an obstacle.
   */
  const [opponentHitObstacle, setOpponentHitObstacle] = useState(false);
  /**
   * @type {[boolean, Function]} showPartyPoppers - Controls the visibility of party popper effects.
   */
  const [showPartyPoppers, setShowPartyPoppers] = useState(false);
  /**
   * @type {[Array<object>, Function]} confetti - Array of confetti particles for celebratory effects.
   */
  const [confetti, setConfetti] = useState([]);
  /**
   * @type {[Array<object>, Function]} roomPlayers - List of players in the current multiplayer room.
   */
  const [roomPlayers, setRoomPlayers] = useState([]);
  /**
   * @type {[number, Function]} maxPlayers - Maximum number of players allowed in a multiplayer room.
   */
  const [maxPlayers, setMaxPlayers] = useState(4);
  /**
   * @type {[number, Function]} turboLevel - Current turbo level (0-3).
   */
  const [turboLevel, setTurboLevel] = useState(0); // 0-3 levels
  /**
   * @type {[Array<object>, Function]} turboParticles - Array of particles for turbo effects.
   */
  const [turboParticles, setTurboParticles] = useState([]);
  /**
   * @type {[boolean, Function]} isConnected - Indicates if the client is currently connected to the network.
   */
  const [isConnected, setIsConnected] = useState(true);
  /**
   * @type {[boolean, Function]} connectionLost - Indicates if the network connection was lost.
   */
  const [connectionLost, setConnectionLost] = useState(false);
  /**
   * @type {[number, Function]} lastNetworkUpdate - Timestamp of the last network data update.
   */
  const [lastNetworkUpdate, setLastNetworkUpdate] = useState(Date.now());
  /**
   * @type {[object|null, Function]} user - Current authenticated user data.
   */
  const [user, setUser] = useState(null);
  /**
   * @type {[boolean, Function]} showWelcome - Controls the visibility of the welcome message.
   */
  const [showWelcome, setShowWelcome] = useState(false);

  const raceRef = useRef();
  const networkRef = useRef();
  const router = useRouter();

  // Check for user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setPlayerPoints(userData.points || 1850);
    }

    // Check for welcome parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("welcome") === "true") {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 5000);
    }

    if (urlParams.get("crashed") === "true") {
      setGameState("notfound");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPlayerPoints(0);
    router.push("/auth/login");
  };

  const playSound = (soundFile, volume = 0.5) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = volume;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Audio not supported:", e);
    }
  };

  // Connection monitoring function
  const checkConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch("/api/health", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setIsConnected(true);
        setConnectionLost(false);
        setLastNetworkUpdate(Date.now());
        return true;
      } else {
        throw new Error("Network response not ok");
      }
    } catch (error) {
      console.log("Connection check failed:", error);
      setIsConnected(false);
      setConnectionLost(true);
      return false;
    }
  };

  // Simulated network data - in real app, this would come from actual speed tests
  const generateNetworkData = async () => {
    const isOnline = await checkConnection();

    if (!isOnline) {
      return {
        ping: 999,
        download: 0,
        upload: 0,
        connected: false,
      };
    }

    return {
      ping: Math.random() * 100 + 10, // 10-110ms
      download: Math.random() * 100 + 5, // 5-105 Mbps
      upload: Math.random() * 50 + 2, // 2-52 Mbps
      connected: true,
    };
  };

  const calculateSpeed = (networkData) => {
    // Convert network performance to car speed (0-100)
    const pingScore = Math.max(0, 100 - networkData.ping);
    const downloadScore = Math.min(100, networkData.download * 2);
    const uploadScore = Math.min(100, networkData.upload * 4);
    return (pingScore + downloadScore + uploadScore) / 3;
  };

  const vehicles = [
    {
      id: 1,
      name: "Lightning Bolt",
      color: "#00ff88",
      unlocked: true,
      price: 0,
      type: "car",
      image: "/images/green-sports-car.png",
    },
    {
      id: 2,
      name: "Neon Racer",
      color: "#ff0088",
      unlocked: true,
      price: 0,
      type: "car",
      image: "/images/red-sports-car.png",
    },
    {
      id: 3,
      name: "Speed Demon",
      color: "#0088ff",
      unlocked: false,
      price: 300,
      type: "bike",
      image: "/images/blue-motorcycle.png",
    },
    {
      id: 4,
      name: "Cyber Beast",
      color: "#ff8800",
      unlocked: false,
      price: 500,
      type: "car",
      image: "/images/orange-sports-car.png",
    },
    {
      id: 5,
      name: "Thunder Bike",
      color: "#8800ff",
      unlocked: false,
      price: 800,
      type: "bike",
      image: "/images/purple-motorcycle.png",
    },
    {
      id: 6,
      name: "Quantum Drift",
      color: "#ff4400",
      unlocked: false,
      price: 1000,
      type: "car",
      image: "/images/yellow-sports-car.png",
    },
    {
      id: 7,
      name: "Plasma Storm",
      color: "#4400ff",
      unlocked: false,
      price: 1500,
      type: "car",
      image: "/images/purple-sports-car.png",
    },
    {
      id: 8,
      name: "Nitro Cycle",
      color: "#ff0044",
      unlocked: false,
      price: 2000,
      type: "bike",
      image: "/images/red-motorcycle.png",
    },
  ];

  const generateObstacles = () => {
    const obstacleTypes = ["cone", "barrier", "oil", "pothole"];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10-90% across track
      y: Math.random() > 0.5 ? 25 : 65, // Top or bottom lane
      type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
    }));
  };

  const checkObstacleCollision = (carPosition, carLane, obstacles) => {
    return obstacles.some(
      (obstacle) =>
        Math.abs(carPosition - obstacle.x) < 8 &&
        Math.abs(carLane - obstacle.y) < 15,
    );
  };

  const players = [
    { id: 1, name: "SpeedDemon", isp: "Fiber Pro", avatar: "🏎️", points: 2450 },
    { id: 2, name: "TurboNet", isp: "Ultra ISP", avatar: "🚗", points: 2380 },
    {
      id: 3,
      name: "RaceKing",
      isp: "Lightning Web",
      avatar: "🏁",
      points: 2200,
    },
    { id: 4, name: "NetNinja", isp: "Speed Force", avatar: "⚡", points: 2100 },
    {
      id: 5,
      name: user?.username || "You",
      isp: user?.isp || "Your ISP",
      avatar: user?.avatar || "🎮",
      points: playerPoints,
    },
  ];

  const startRace = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    playSound("/sounds/engine-start.mp3", 0.7);
    router.push("/race");
  };

  const addReaction = (emoji) => {
    setReactions((prev) => [...prev, emoji]);
    setTimeout(() => {
      setReactions((prev) => prev.slice(1));
    }, 2000);
  };

  const Speedometer = ({ data, label }) => {
    const speed = calculateSpeed(data);

    return (
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-cyan-400 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-4 rounded-full border border-cyan-600">
              <div
                className="absolute top-1/2 left-1/2 w-1 h-8 bg-cyan-400 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300"
                style={{
                  transform: `translate(-50%, -100%) rotate(${(speed / 100) * 180 - 90}deg)`,
                }}
              />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs font-bold">
            {Math.round(speed)} MPH
          </div>
        </div>
        <div className="text-center mt-2 text-white font-bold">{label}</div>
        <div className="text-center text-xs text-gray-400">
          <div>Ping: {Math.round(data.ping)}ms</div>
          <div>↓ {Math.round(data.download)} Mbps</div>
          <div>↑ {Math.round(data.upload)} Mbps</div>
        </div>
      </div>
    );
  };

  const RaceTrack = () => (
    <div className="relative h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-cyan-400">
      {/* Track background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700">
        {/* Asphalt texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                         radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Track lanes */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-0.5 bg-yellow-400 top-1/2 transform -translate-y-1/2 opacity-60" />
        <div className="absolute w-full h-1 bg-white top-1/4 opacity-40" />
        <div className="absolute w-full h-1 bg-white top-3/4 opacity-40" />
      </div>

      {/* Moving track lines */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-1 bg-white opacity-60"
            style={{
              left: `${i * 8}%`,
              top: "30%",
              animation: "moveTrack 1.5s linear infinite",
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-1 bg-white opacity-60"
            style={{
              left: `${i * 8}%`,
              top: "70%",
              animation: "moveTrack 1.5s linear infinite",
            }}
          />
        ))}
      </div>

      {/* Obstacles */}
      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className="absolute transition-all duration-300"
          style={{
            left: `${obstacle.x}%`,
            top: `${obstacle.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {obstacle.type === "cone" && (
            <div className="w-4 h-6 bg-orange-500 clip-triangle relative">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-orange-400 clip-triangle" />
              <div className="absolute bottom-0 w-full h-1 bg-white" />
            </div>
          )}
          {obstacle.type === "barrier" && (
            <div className="w-8 h-4 bg-red-600 border border-red-800 relative">
              <div className="absolute inset-1 bg-gradient-to-r from-red-500 to-red-700" />
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white transform -translate-x-1/2" />
            </div>
          )}
          {obstacle.type === "oil" && (
            <div className="w-6 h-3 bg-black rounded-full opacity-80 relative">
              <div className="absolute inset-0 bg-gradient-radial from-gray-800 to-black rounded-full" />
              <div className="absolute top-0 left-1 w-1 h-1 bg-gray-600 rounded-full" />
            </div>
          )}
          {obstacle.type === "pothole" && (
            <div className="w-5 h-3 bg-gray-900 rounded border border-gray-700 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded" />
            </div>
          )}
        </div>
      ))}

      {/* Player vehicle - replace the existing vehicle rendering */}
      <div
        className={`absolute transition-all duration-200 ${showTurbo ? "animate-pulse" : ""} ${playerHitObstacle ? "animate-bounce" : ""}`}
        style={{
          left: `${playerPosition}%`,
          top: "20%",
          transform: "translate(-50%, -50%)",
          filter: playerHitObstacle
            ? "brightness(0.7) contrast(1.2)"
            : "brightness(1)",
        }}
      >
        <div className="relative">
          <img
            src={selectedCar.image || "/placeholder.svg"}
            alt={selectedCar.name}
            className="w-16 h-10 object-cover rounded-lg shadow-lg"
            style={{
              filter: `hue-rotate(${selectedCar.color === "#00ff88" ? "0deg" : selectedCar.color === "#ff0088" ? "300deg" : selectedCar.color === "#0088ff" ? "200deg" : "0deg"})`,
            }}
          />
          {/* Enhanced turbo effects based on level */}
          {showTurbo && (
            <>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex space-x-1">
                {turboLevel >= 1 && (
                  <div className="w-3 h-8 bg-orange-400 rounded animate-pulse opacity-90" />
                )}
                {turboLevel >= 2 && (
                  <div className="w-2 h-6 bg-red-400 rounded animate-pulse opacity-70" />
                )}
                {turboLevel >= 3 && (
                  <div className="w-2 h-4 bg-yellow-400 rounded animate-pulse opacity-50" />
                )}
              </div>

              {/* Turbo particles - more particles for higher levels */}
              <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                {[...Array(turboLevel * 3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-300 rounded-full animate-ping"
                    style={{
                      left: `${i * -4}px`,
                      top: `${(Math.random() - 0.5) * 16}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.5s",
                    }}
                  />
                ))}
              </div>

              {/* Speed lines - intensity based on turbo level */}
              <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-8">
                {[...Array(turboLevel + 1)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-0.5 bg-cyan-400 opacity-60 animate-pulse"
                    style={{
                      top: `${i * 6}px`,
                      animationDelay: `${i * 0.2}s`,
                      width: `${8 + turboLevel * 2}px`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Opponent vehicle - use a default car image */}
      <div
        className={`absolute transition-all duration-200 ${opponentHitObstacle ? "animate-bounce" : ""}`}
        style={{
          left: `${opponentPosition}%`,
          top: "60%",
          transform: "translate(-50%, -50%)",
          filter: opponentHitObstacle
            ? "brightness(0.7) contrast(1.2)"
            : "brightness(1)",
        }}
      >
        <div className="relative">
          <img
            src="/images/blue-sports-car.png"
            alt="Opponent Car"
            className="w-16 h-10 object-cover rounded-lg shadow-lg"
            style={{ filter: "hue-rotate(180deg)" }}
          />
        </div>
      </div>

      {/* Finish line */}
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-b from-white via-black to-white opacity-90 flex items-center justify-center">
        <div className="text-black font-bold text-xs transform rotate-90">
          FINISH
        </div>
      </div>

      {/* Reactions */}
      <div className="absolute top-4 right-4 space-y-2">
        {reactions.map((emoji, i) => (
          <div key={i} className="text-3xl animate-bounce">
            {emoji}
          </div>
        ))}
      </div>

      {/* Obstacle hit indicators */}
      {playerHitObstacle && (
        <div className="absolute top-4 left-4 text-red-400 font-bold animate-pulse">
          OBSTACLE HIT! -70% SPEED
        </div>
      )}
      {opponentHitObstacle && (
        <div className="absolute top-12 left-4 text-orange-400 font-bold animate-pulse">
          OPPONENT HIT OBSTACLE!
        </div>
      )}

      {/* Party poppers and confetti */}
      {showPartyPoppers && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 animate-bounce"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                backgroundColor: piece.color,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Party popper emojis */}
          <div className="absolute top-4 left-4 text-4xl animate-bounce">
            🎉
          </div>
          <div
            className="absolute top-4 right-4 text-4xl animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            🎊
          </div>
          <div
            className="absolute bottom-4 left-4 text-4xl animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            🎉
          </div>
          <div
            className="absolute bottom-4 right-4 text-4xl animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            🎊
          </div>
        </div>
      )}
      {/* Connection Status Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400 animate-ping"}`}
        />
        <span
          className={`text-sm font-medium ${isConnected ? "text-green-400" : "text-red-400"}`}
        >
          {isConnected ? "Connected" : "Connection Lost"}
        </span>
      </div>
    </div>
  );

  const MultiplayerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-8 bg-gray-800 border-cyan-400 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Multiplayer Racing
        </h2>

        <div className="space-y-6">
          <div className="text-center">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/api/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "create",
                      player: {
                        id: "player1",
                        name: user?.username || "You",
                        avatar: user?.avatar || "🎮",
                        vehicle: selectedCar.name,
                        position: 0,
                        speed: 0,
                      },
                    }),
                  });
                  const data = await response.json();
                  if (data.success) {
                    setIsHost(true);
                    setRoomCode(data.room.code);
                    setRoomPlayers(data.room.players);
                  }
                } catch (error) {
                  console.error("Failed to create room:", error);
                }
              }}
              className="w-full mb-4 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Create Room (Up to 6 Players)
            </Button>

            {isHost && roomCode && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-300 mb-2">
                  Share this code with your friends:
                </p>
                <div className="text-3xl font-bold text-cyan-400 tracking-wider mb-2">
                  {roomCode}
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Players: {roomPlayers.length}/{maxPlayers}
                </p>

                {/* Player List */}
                <div className="space-y-2 mb-4">
                  {roomPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 bg-gray-600 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{player.avatar}</span>
                        <span className="text-white font-medium">
                          {player.name}
                        </span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Host
                          </Badge>
                        )}
                      </div>
                      <span className="text-cyan-400 text-sm">
                        {player.vehicle || "No vehicle"}
                      </span>
                    </div>
                  ))}
                </div>

                {roomPlayers.length >= 2 && (
                  <Button
                    onClick={startRace}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Start Race ({roomPlayers.length} Players)
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-gray-400 mb-4">OR</div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-xl tracking-wider"
                maxLength={6}
              />

              <Button
                onClick={async () => {
                  if (roomCode.length === 6) {
                    try {
                      const response = await fetch("/api/rooms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "join",
                          roomCode,
                          player: {
                            id:
                              "player_" +
                              Math.random().toString(36).substr(2, 9),
                            name: user?.username || "Player",
                            avatar: user?.avatar || "🎮",
                            vehicle: selectedCar.name,
                            position: 0,
                            speed: 0,
                          },
                        }),
                      });
                      const data = await response.json();
                      if (data.success) {
                        setRoomPlayers(data.room.players);
                        setShowMultiplayerModal(false);
                        startRace();
                      } else {
                        alert(data.error);
                      }
                    } catch (error) {
                      console.error("Failed to join room:", error);
                      alert("Failed to join room");
                    }
                  }
                }}
                disabled={roomCode.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Join Room
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-600 flex gap-2">
          <Button
            onClick={() => setGameState("notfound")}
            variant="outline"
            className="flex-1 bg-red-900 border-red-600 hover:bg-red-800"
          >
            🚑 Connection Issues?
          </Button>
          <Button
            onClick={() => {
              setShowMultiplayerModal(false);
              setRoomCode("");
              setIsHost(false);
              setRoomPlayers([]);
            }}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );

  // Not Found / Crash Screen
  if (gameState === "notfound") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Crashed Ambulance */}
          <div className="mb-8 relative">
            <div className="text-8xl mb-4 animate-bounce">🚑</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-pulse">
              💥
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                <div
                  className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-yellow-500 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-red-400 mb-4 animate-pulse">
              CONNECTION CRASHED!
            </h1>
            <p className="text-2xl text-gray-300 mb-4">
              Oops! Your network speed couldn't handle the race!
            </p>
            <p className="text-lg text-gray-400 mb-6">
              The ambulance has been called to rescue your connection.
            </p>

            {/* Enhanced Crash Stats */}
            <Card className="bg-gray-800 border-red-500 p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                🚨 Connection Crash Report
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    CONNECTION LOST
                  </div>
                  <div className="text-gray-400">During Race</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {Math.round((Date.now() - lastNetworkUpdate) / 1000)}s
                  </div>
                  <div className="text-gray-400">Time Since Last Update</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.round(playerPosition)}%
                  </div>
                  <div className="text-gray-400">Race Progress Lost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    999ms
                  </div>
                  <div className="text-gray-400">Last Ping</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => setGameState("menu")}
              size="lg"
              className="w-full max-w-md text-xl py-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              🔧 Repair Connection & Return to Menu
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="lg"
              className="w-full max-w-md py-4"
            >
              🔄 Restart Game
            </Button>
          </div>

          {/* Emergency Tips */}
          <div className="mt-8 text-left max-w-md mx-auto">
            <h4 className="text-lg font-bold text-yellow-400 mb-2">
              🚨 Emergency Network Tips:
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Check your WiFi connection</li>
              <li>• Restart your router</li>
              <li>• Move closer to your router</li>
              <li>• Close other bandwidth-heavy apps</li>
              <li>• Contact your ISP if problems persist</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4">
      {/* Welcome Message */}
      {showWelcome && user && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <Card className="p-4 bg-green-800 border-green-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{user.avatar}</span>
              <div>
                <div className="text-white font-bold">
                  Welcome, {user.username}!
                </div>
                <div className="text-green-300 text-sm">
                  Ready to race with your network speed?
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center">
        {/* User Profile Header */}
        {user && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{user.avatar}</span>
              <div className="text-left">
                <div className="text-xl font-bold text-white">
                  {user.username}
                </div>
                <div className="text-sm text-gray-400">
                  {user.isp || "Unknown ISP"}
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
            <span className="text-cyan-400">Network</span> Speed Racing
          </h1>
          <p className="text-xl text-gray-300">
            Race with your internet speed! Faster connection = Faster car!
          </p>
        </div>

        {/* Current network status */}
        <Card className="mb-8 p-6 bg-gray-800 border-cyan-400">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Wifi className="w-6 h-6 text-cyan-400" />
            Your Network Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {Math.round(playerData.ping)}ms
              </div>
              <div className="text-gray-400">Ping</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {Math.round(playerData.download)} Mbps
              </div>
              <div className="text-gray-400">Download</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {Math.round(playerData.upload)} Mbps
              </div>
              <div className="text-gray-400">Upload</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg text-white">
              Estimated Speed:{" "}
              <span className="text-cyan-400 font-bold">
                {Math.round(calculateSpeed(playerData))} MPH
              </span>
            </div>
          </div>
        </Card>

        {/* Menu buttons */}
        <div className="space-y-4">
          <Button
            onClick={startRace}
            size="lg"
            className="w-full max-w-md text-xl py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            <Play className="w-6 h-6 mr-2" />
            {user ? "Start Race" : "Login to Race"}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button
              onClick={() =>
                user ? router.push("/garage") : router.push("/auth/login")
              }
              variant="outline"
              size="lg"
              className="py-4"
              variant="outline"
              size="lg"
              className="py-4"
            >
              <Settings className="w-5 h-5 mr-2" />
              Garage
            </Button>

            <Button
              onClick={() =>
                user ? router.push("/leaderboard") : router.push("/auth/login")
              }
              variant="outline"
              size="lg"
              className="py-4"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Leaderboard
            </Button>

            <Button
              onClick={() =>
                user
                  ? setShowMultiplayerModal(true)
                  : router.push("/auth/login")
              }
              variant="outline"
              size="lg"
              className="py-4 bg-transparent"
            >
              <Users className="w-5 h-5 mr-2" />
              Multiplayer
            </Button>
          </div>
        </div>

        {/* Authentication Buttons for Non-logged in Users */}
        {!user && (
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Join the racing community to unlock all features!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="bg-cyan-600 hover:bg-cyan-700 px-8 py-3"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/auth/signup")}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats - only show if user is logged in */}
        {user && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {user.points || playerPoints}
              </div>
              <div className="text-gray-400 text-sm">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {user.wins || 12}
              </div>
              <div className="text-gray-400 text-sm">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {user.losses || 8}
              </div>
              <div className="text-gray-400 text-sm">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">5th</div>
              <div className="text-gray-400 text-sm">Rank</div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button
            onClick={() => setGameState("notfound")}
            variant="outline"
            size="sm"
            className="text-red-400 border-red-600 hover:bg-red-900"
          >
            🚑 Test Crash Screen
          </Button>
        </div>
      </div>

      {showMultiplayerModal && <MultiplayerModal />}
    </div>
  );
};

export default NetworkSpeedRacing;
