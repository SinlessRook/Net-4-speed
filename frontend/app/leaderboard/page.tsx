"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Medal, Award, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

const LeaderboardPage = () => {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("global");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-gray-400 to-gray-600";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏆</div>
          <div className="text-2xl text-white font-bold">
            Loading Leaderboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
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
            <Trophy className="w-10 h-10 text-yellow-400" />
            <span className="text-cyan-400">Network</span> Racing Leaderboard
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            <Button
              onClick={() => setSelectedTab("global")}
              className={`px-6 py-2 ${
                selectedTab === "global"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              🌍 Global
            </Button>
            <Button
              onClick={() => setSelectedTab("weekly")}
              className={`px-6 py-2 ${
                selectedTab === "weekly"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              📅 Weekly
            </Button>
            <Button
              onClick={() => setSelectedTab("friends")}
              className={`px-6 py-2 ${
                selectedTab === "friends"
                  ? "bg-cyan-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              👥 Friends
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <Card className="p-6 bg-gradient-to-b from-gray-700 to-gray-800 border-gray-400 text-center transform translate-y-4">
              <div className="text-4xl mb-2">{leaderboard[1].avatar}</div>
              <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white mb-1">
                {leaderboard[1].username}
              </div>
              <div className="text-2xl font-bold text-gray-400 mb-2">
                {leaderboard[1].points}
              </div>
              <div className="text-sm text-gray-500">{leaderboard[1].isp}</div>
              <Badge variant="secondary" className="mt-2">
                {leaderboard[1].wins}W - {leaderboard[1].losses}L
              </Badge>
            </Card>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <Card className="p-6 bg-gradient-to-b from-yellow-600 to-yellow-800 border-yellow-400 text-center transform -translate-y-2">
              <div className="text-5xl mb-2">{leaderboard[0].avatar}</div>
              <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {leaderboard[0].username}
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {leaderboard[0].points}
              </div>
              <div className="text-sm text-yellow-200">
                {leaderboard[0].isp}
              </div>
              <Badge className="mt-2 bg-yellow-500 text-black">
                {leaderboard[0].wins}W - {leaderboard[0].losses}L
              </Badge>
            </Card>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <Card className="p-6 bg-gradient-to-b from-orange-600 to-orange-800 border-orange-400 text-center transform translate-y-4">
              <div className="text-4xl mb-2">{leaderboard[2].avatar}</div>
              <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white mb-1">
                {leaderboard[2].username}
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-2">
                {leaderboard[2].points}
              </div>
              <div className="text-sm text-orange-200">
                {leaderboard[2].isp}
              </div>
              <Badge variant="secondary" className="mt-2">
                {leaderboard[2].wins}W - {leaderboard[2].losses}L
              </Badge>
            </Card>
          )}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-gray-800 border-cyan-400">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Full Rankings
            </h2>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r ${getRankColor(
                    index + 1,
                  )} ${index < 3 ? "border-2 border-opacity-50" : "bg-gray-700"} ${
                    player.username === "You" ? "ring-2 ring-cyan-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {getRankIcon(index + 1)}
                      <span className="text-2xl font-bold text-white">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="text-3xl">{player.avatar}</div>
                    <div>
                      <div className="text-xl font-bold text-white flex items-center gap-2">
                        {player.username}
                        {player.username === "You" && (
                          <Badge className="bg-cyan-600 text-white">YOU</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-300">{player.isp}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {player.points}
                      </div>
                      <div className="text-xs text-gray-400">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {player.wins}
                      </div>
                      <div className="text-xs text-gray-400">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">
                        {player.losses}
                      </div>
                      <div className="text-xs text-gray-400">Losses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-400">
                        {(
                          (player.wins / (player.wins + player.losses)) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => router.push("/race")}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            🏁 Start Racing
          </Button>
          <Button
            onClick={fetchLeaderboard}
            variant="outline"
            className="px-8 py-3 bg-transparent"
          >
            🔄 Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
