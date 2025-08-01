import { type NextRequest, NextResponse } from "next/server"

// Simulated race data storage
const raceData = new Map<
  string,
  {
    roomCode: string
    players: Array<{
      id: string
      position: number
      speed: number
      obstacles: number
      turboBoosts: number
    }>
    startTime: Date
    status: "active" | "finished"
  }
>()

export async function POST(request: NextRequest) {
  try {
    const { action, roomCode, playerId, data } = await request.json()

    switch (action) {
      case "start":
        const newRace = {
          roomCode,
          players: data.players.map((p: any) => ({
            id: p.id,
            position: 0,
            speed: 0,
            obstacles: 0,
            turboBoosts: 0,
          })),
          startTime: new Date(),
          status: "active" as const,
        }
        raceData.set(roomCode, newRace)

        return NextResponse.json({
          success: true,
          race: newRace,
        })

      case "update":
        const race = raceData.get(roomCode)
        if (!race) {
          return NextResponse.json({
            success: false,
            error: "Race not found",
          })
        }

        const playerIndex = race.players.findIndex((p) => p.id === playerId)
        if (playerIndex !== -1) {
          race.players[playerIndex] = { ...race.players[playerIndex], ...data }
        }

        raceData.set(roomCode, race)

        return NextResponse.json({
          success: true,
          race,
        })

      case "finish":
        const finishRace = raceData.get(roomCode)
        if (finishRace) {
          finishRace.status = "finished"
          raceData.set(roomCode, finishRace)
        }

        return NextResponse.json({
          success: true,
          race: finishRace,
        })

      default:
        return NextResponse.json({
          success: false,
          error: "Invalid action",
        })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const roomCode = url.searchParams.get("code")

  if (!roomCode) {
    return NextResponse.json({
      success: false,
      error: "Room code required",
    })
  }

  const race = raceData.get(roomCode)
  return NextResponse.json({
    success: !!race,
    race: race || null,
  })
}
