/**
 * @file This file contains the race page.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * The race page component.
 * @returns The race page.
 */
const RacePage = () => {
  const router = useRouter();
  const [isRacing, setIsRacing] = useState(false);
  const [raceTime, setRaceTime] = useState(0);
  const [playerData, setPlayerData] = useState({
    ping: 0,
    download: 0,
    upload: 0,
  });
  const [opponentData, setOpponentData] = useState({
    ping: 0,
    download: 0,
    upload: 0,
  });
  const [playerPosition, setPlayerPosition] = useState(0);
  const [opponentPosition, setOpponentPosition] = useState(0);
  const [playerSpeed, setPlayerSpeed] = useState(0);
  const [opponentSpeed, setOpponentSpeed] = useState(0);
  const [winner, setWinner] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [raceStarted, setRaceStarted] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [playerHitObstacle, setPlayerHitObstacle] = useState(false);
  const [opponentHitObstacle, setOpponentHitObstacle] = useState(false);
  const [showTurbo, setShowTurbo] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showPartyPoppers, setShowPartyPoppers] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    if(opponentPosition==100){ws.close(); return;}
    ws.current = new WebSocket("ws://localhost:8000/speedtest");

    ws.current.onopen = () => {
      console.log("websocket connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "download_speed") {
        setPlayerData((prev) => ({ ...prev, download: data.speed }));
        setPlayerSpeed(data.speed);
        setPlayerPosition((prev) => Math.min(100, prev + data.speed / 10));
      } else if (data.type === "upload_speed") {
        setPlayerData((prev) => ({ ...prev, upload: data.speed }));
        setPlayerSpeed(data.speed);
        setPlayerPosition((prev) => Math.min(100, prev + data.speed / 10));
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    let countdownInterval;
    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            setRaceStarted(true);
            setIsRacing(true);
            setObstacles(generateObstacles());
            ws.current.send("start_download");
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    if (isRacing && raceStarted && playerSpeed > 0) {
      const raceInterval = setInterval(() => {
        setRaceTime((prev) => prev + 0.1);
        // Simulate opponent
        if(raceTime%2 === 0) {
          setRaceTime(prev => prev + 0.1);
        return;
        }
        const opponentSpeed = Math.random() * 100 %50;
        setOpponentSpeed(opponentSpeed);
        setOpponentPosition((prev) => Math.min(100, prev + opponentSpeed*0.5 / 10));

        const playerHit = checkObstacleCollision(playerPosition, 25, obstacles);
        const opponentHit = checkObstacleCollision(
          opponentPosition,
          65,
          obstacles,
        );

        setPlayerHitObstacle(playerHit);
        setOpponentHitObstacle(opponentHit);

        const playerSpeedModifier = playerHit ? 0.3 : 1;

        setPlayerPosition((prev) =>
          Math.min(100, prev + (playerSpeed*0.5 / 10) * playerSpeedModifier),
        );
      }, 100);

      return () => {
        clearInterval(raceInterval);
      };
    }
  }, [
    isRacing,
    raceStarted,
    obstacles,
    playerPosition,
    opponentPosition,
    playerSpeed,
  ]);

  useEffect(() => {
    if (playerPosition >= 100 || opponentPosition >= 100) {
      setIsRacing(false);
      const playerWon = playerPosition >= opponentPosition;
      setWinner(playerWon ? "player" : "opponent");
    }
  }, [playerPosition, opponentPosition]);

  /**
   * Generates a random set of obstacles.
   * @returns An array of obstacles.
   */
  const generateObstacles = () => {
    const obstacleTypes = ["cone", "barrier", "oil", "pothole"];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() > 0.5 ? 25 : 65,
      type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
    }));
  };

  /**
   * Checks if a car has collided with an obstacle.
   * @param carPosition The position of the car.
   * @param carLane The lane of the car.
   * @param obstacles The array of obstacles.
   * @returns True if the car has collided, false otherwise.
   */
  const checkObstacleCollision = (carPosition, carLane, obstacles) => {
    return obstacles.some(
      (obstacle) =>
        Math.abs(carPosition - obstacle.x) < 8 &&
        Math.abs(carLane - obstacle.y) < 15,
    );
  };

  /**
   * The race track component.
   * @param obstacles The array of obstacles.
   * @returns The race track component.
   */
  const RaceTrack = ({ obstacles }) => (
    <div className="relative h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-cyan-400">
      {/* Track background with asphalt texture */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                         radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Track lanes and markings */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-0.5 bg-yellow-400 top-1/2 transform -translate-y-1/2 opacity-60" />
        <div className="absolute w-full h-1 bg-white top-1/4 opacity-40" />
        <div className="absolute w-full h-1 bg-white top-3/4 opacity-40" />
      </div>

      {/* Moving track lines for speed effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-1 bg-white opacity-60"
            style={{
              left: `${i * 6}%`,
              top: "30%",
              animation: `moveTrack ${2 - playerSpeed / 100}s linear infinite`,
            }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-1 bg-white opacity-60"
            style={{
              left: `${i * 6}%`,
              top: "70%",
              animation: `moveTrack ${2 - opponentSpeed / 100}s linear infinite`,
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
            <div className="w-4 h-6 bg-orange-500 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-orange-400" />
              <div className="absolute bottom-0 w-full h-1 bg-white" />
            </div>
          )}
          {obstacle.type === "barrier" && (
            <div className="w-8 h-4 bg-red-600 border border-red-800 relative">
              <div className="absolute inset-1 bg-gradient-to-r from-red-500 to-red-700" />
            </div>
          )}
          {obstacle.type === "oil" && (
            <div className="w-6 h-3 bg-black rounded-full opacity-80 relative">
              <div className="absolute inset-0 bg-gradient-radial from-gray-800 to-black rounded-full" />
            </div>
          )}
          {obstacle.type === "pothole" && (
            <div className="w-5 h-3 bg-gray-900 rounded border border-gray-700 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded" />
            </div>
          )}
        </div>
      ))}

      {/* Player car */}
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
            src="/placeholder.svg?height=40&width=64&text=🏎️"
            alt="Player Car"
            className="w-16 h-10 object-cover rounded-lg shadow-lg bg-green-500"
          />
          {showTurbo && (
            <>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <div className="w-3 h-8 bg-orange-400 rounded animate-pulse opacity-90" />
                <div className="w-2 h-6 bg-red-400 rounded animate-pulse opacity-70" />
                <div className="w-2 h-4 bg-yellow-400 rounded animate-pulse opacity-50" />
              </div>
              <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                {[...Array(6)].map((_, i) => (
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
            </>
          )}
        </div>
      </div>

      {/* Opponent car */}
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
            src="/placeholder.svg?height=40&width=64&text=🚗"
            alt="Opponent Car"
            className="w-16 h-10 object-cover rounded-lg shadow-lg bg-blue-500"
          />
        </div>
      </div>

      {/* Finish line */}
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-b from-white via-black to-white opacity-90 flex items-center justify-center">
        <div className="text-black font-bold text-xs transform rotate-90">
          FINISH
        </div>
      </div>

      {/* Connection status */}
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

      {/* Race countdown */}
      {countdown > 0 && !raceStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-8xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {/* Winner celebration */}
      {winner && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">
              {winner === "player" ? "🏆 YOU WIN!" : "😔 YOU LOSE!"}
            </div>
            <Button
              onClick={() => router.push("/")}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Back to Menu
            </Button>
          </div>
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
          <div className="absolute top-4 left-4 text-4xl animate-bounce">
            🎉
          </div>
          <div className="absolute top-4 right-4 text-4xl animate-bounce">
            🎊
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          <h1 className="text-4xl font-bold text-white">
            <span className="text-cyan-400">Network</span> Speed Race
          </h1>
          <div className="text-2xl font-bold text-white">
            {raceTime.toFixed(1)}s
          </div>
        </div>

        {/* Race Track */}
        <RaceTrack obstacles={obstacles} />

        {/* Race Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Player Stats */}
          <Card className="p-6 bg-gray-800 border-green-400">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              Your Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">
                  {Math.round(playerSpeed)} MPH
                </div>
                <div className="text-gray-400">Current Speed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {Math.round(playerPosition)}%
                </div>
                <div className="text-gray-400">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">
                  {Math.round(playerData.ping)}ms
                </div>
                <div className="text-gray-400">Ping</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {Math.round(playerData.download)} Mbps
                </div>
                <div className="text-gray-400">Download</div>
              </div>
            </div>
          </Card>

          {/* Opponent Stats */}
          <Card className="p-6 bg-gray-800 border-blue-400">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              Opponent Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">
                  {Math.round(opponentSpeed)} MPH
                </div>
                <div className="text-gray-400">Current Speed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {Math.round(opponentPosition)}%
                </div>
                <div className="text-gray-400">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">
                  {Math.round(opponentData.ping)}ms
                </div>
                <div className="text-gray-400">Ping</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {Math.round(opponentData.download)} Mbps
                </div>
                <div className="text-gray-400">Download</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Race Controls */}
        <div className="flex justify-center mt-6 gap-4">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="px-8 py-3"
          >
            Exit Race
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-green-600 hover:bg-green-700"
          >
            Race Again
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes moveTrack {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100px);
          }
        }
      `}</style>
    </div>
  );
};

export default RacePage;
