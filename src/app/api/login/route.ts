import { NextResponse } from 'next/server';
import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.SPOTIFY_CLIENT_REDIRECT_URI;

function generateRandomString(length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function GET() {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';

  const params = querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state, // CSRF protection
  });

  const url = `https://accounts.spotify.com/authorize?${params}`;
  return NextResponse.redirect(url);
}
