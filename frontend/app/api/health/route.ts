import { NextResponse } from "next/server"

export async function GET() {
  // Simulate occasional network issues for testing
  const shouldFail = Math.random() < 0.05 // 5% chance of failure for testing

  if (shouldFail) {
    return NextResponse.json({ status: "error", message: "Network unavailable" }, { status: 503 })
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ping: Math.random() * 50 + 10, // Simulated ping
  })
}
