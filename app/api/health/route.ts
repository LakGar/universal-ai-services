import { NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring services
 * 
 * Usage:
 * - Uptime monitoring services can ping this endpoint
 * - Returns 200 OK if service is healthy
 * - Includes basic system information
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "1.0.0",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

