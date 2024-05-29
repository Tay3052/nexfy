import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const json1 = await request.json();
    const json2 = await request.json();

    const mergedJson = { ...json1, ...json2 };

    return NextResponse.json(mergedJson);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to merge JSON" },
      { status: 500 }
    );
  }
}
