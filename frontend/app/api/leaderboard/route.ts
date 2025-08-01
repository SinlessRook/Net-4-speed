import { type NextRequest, NextResponse } from "next/server";

// Simulated leaderboard data
const leaderboard = [
  {
    id: "1",
    username: "SpeedDemon",
    points: 2450,
    wins: 45,
    losses: 12,
    avatar: "🏎️",
    isp: "Fiber Pro",
  },
  {
    id: "2",
    username: "TurboNet",
    points: 2380,
    wins: 42,
    losses: 15,
    avatar: "🚗",
    isp: "Ultra ISP",
  },
  {
    id: "3",
    username: "RaceKing",
    points: 2200,
    wins: 38,
    losses: 18,
    avatar: "🏁",
    isp: "Lightning Web",
  },
  {
    id: "4",
    username: "NetNinja",
    points: 2100,
    wins: 35,
    losses: 20,
    avatar: "⚡",
    isp: "Speed Force",
  },
  {
    id: "5",
    username: "CyberRacer",
    points: 1950,
    wins: 32,
    losses: 23,
    avatar: "🎮",
    isp: "Quantum Net",
  },
  {
    id: "6",
    username: "VelocityViper",
    points: 1850,
    wins: 28,
    losses: 25,
    avatar: "🐍",
    isp: "Hyper Link",
  },
  {
    id: "7",
    username: "NitroNomad",
    points: 1750,
    wins: 25,
    losses: 28,
    avatar: "🔥",
    isp: "Blaze ISP",
  },
  {
    id: "8",
    username: "PixelPilot",
    points: 1650,
    wins: 22,
    losses: 30,
    avatar: "🚀",
    isp: "Rocket Net",
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    leaderboard: leaderboard.sort((a, b) => b.points - a.points),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { playerId, points, won } = await request.json();

    // Find player and update stats
    const playerIndex = leaderboard.findIndex((p) => p.id === playerId);
    if (playerIndex !== -1) {
      leaderboard[playerIndex].points += points;
      if (won) {
        leaderboard[playerIndex].wins += 1;
      } else {
        leaderboard[playerIndex].losses += 1;
      }
    }

    return NextResponse.json({
      success: true,
      player: leaderboard[playerIndex],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    );
  }
}
