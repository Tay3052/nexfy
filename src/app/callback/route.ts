"use cliant";
// クライアントIDを返す代わりに、Spotifyからのコールバックを処理するためのコードを追加。
import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_CLIENT_REDIRECT_URI;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // codeとstateが何もない場合は、エラーを返す
  if (!code || !state) {
    return NextResponse.json(
      { error: "Invalid callback request" },
      { status: 400 }
    );
  }

  // パラメーターを使ってSpotifyにアクセストークンをリクエストする
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirect_uri ?? "",
    client_id: client_id ?? "",
    client_secret: client_secret ?? "",
  });

  // レスポンスを取得
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  // レスポンスをJSONに変換
  const data = await response.json();

  console.log(data);

  // レスポンスがエラーの場合は、エラーを返す
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  // アクセストークンを含むデータを受け取ったら、必要に応じてセッションなどに保存する
  // ここでは、アクセストークンをそのまま返す例を示します
  return NextResponse.json(data);
}
