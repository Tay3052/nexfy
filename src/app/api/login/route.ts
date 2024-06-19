import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.SPOTIFY_CLIENT_REDIRECT_URI;

function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function GET(request: NextRequest) {
  console.log("GET request received");

  if (!client_id || !redirect_uri) {
    console.error("Missing environment variables");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const state = generateRandomString(16);
  console.log("Generated state:", state);

  const scope = "user-read-private user-read-email";

  const params = querystring.stringify({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state, // CSRF protection
  });

  const url: string = `https://accounts.spotify.com/authorize?${params}`;
  console.log("Redirect URL:", url);

  return NextResponse.redirect(url);
}
