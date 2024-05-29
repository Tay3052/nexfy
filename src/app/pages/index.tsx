"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export const Callback = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const { code, state } = router.query;

  //   if (code) {
  //     // ここでcodeを使ってSpotifyのアクセストークンを取得
  //     // fetch('/api/spotify-token', { method: 'POST', body: JSON.stringify({ code }) })
  //     // .then(response => response.json())
  //     // .then(data => {
  //     //   // トークンを使って何かをする
  //     //   console.log(data);
  //     // });
  //   }
  // }, [router.query]);

  return (
    <div>
      <h1>Spotify Authentication Successful</h1>
      <p>You will be redirected shortly...</p>
    </div>
  );
};
