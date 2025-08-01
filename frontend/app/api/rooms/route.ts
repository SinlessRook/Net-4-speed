import { type NextRequest, NextResponse } from "next/server"

// Simulated in-memory storage (in real app, use database)
const rooms = new Map<
  string,
  {
    id: string
    code: string
    host: string
    players: Array<{
      id: string
      name: string
      avatar: string
      vehicle: string
      position: number
      speed: number
    }>
    maxPlayers: number
    status: "waiting" | "racing" | "finished"
    createdAt: Date
  }
>()

export async function POST(request: NextRequest) {
  try {
    const { action, roomCode, player } = await request.json()

    switch (action) {
      case "create":
        const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const newRoom = {
          id: crypto.randomUUID(),
          code: newRoomCode,
          host: player.id,
          players: [player],
          maxPlayers: 6,
          status: "waiting" as const,
          createdAt: new Date(),
        }
        rooms.set(newRoomCode, newRoom)

        return NextResponse.json({
          success: true,
          room: newRoom,
        })

      case "join":
        const room = rooms.get(roomCode)
        if (!room) {
          return NextResponse.json({
            success: false,
            error: "Room not found",
          })
        }

        if (room.players.length >= room.maxPlayers) {
          return NextResponse.json({
            success: false,
            error: "Room is full",
          })
        }

        if (room.status !== "waiting") {
          return NextResponse.json({
            success: false,
            error: "Race already in progress",
          })
        }

        room.players.push(player)
        rooms.set(roomCode, room)

        return NextResponse.json({
          success: true,
          room,
        })

      case "leave":
        const leaveRoom = rooms.get(roomCode)
        if (leaveRoom) {
          leaveRoom.players = leaveRoom.players.filter((p) => p.id !== player.id)
          if (leaveRoom.players.length === 0) {
            rooms.delete(roomCode)
          } else {
            rooms.set(roomCode, leaveRoom)
          }
        }

        return NextResponse.json({ success: true })

      case "get":
        const getRoom = rooms.get(roomCode)
        return NextResponse.json({
          success: !!getRoom,
          room: getRoom || null,
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

  const room = rooms.get(roomCode)
  return NextResponse.json({
    success: !!room,
    room: room || null,
  })
}
