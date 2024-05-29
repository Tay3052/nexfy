/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [tracksInfos, setTracksInfos] = useState<any[]>([]);

  useEffect(() => {
    const token = searchParams.get("access_token");
    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token);
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      } else {
        router.push("/"); // トークンがなければホームページにリダイレクト
      }
    }
  }, [searchParams, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !query) return;

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    setResults(data.tracks.items);
    console.log(data.tracks.items);

    const tracks = data.tracks.items.map((track: any) => track.id);
  };

  return (
    <div style={{ margin: "5rem 0 0 0 " }}>
      <h1>Search for a Song</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter song name"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {results.length > 0 && (
          <ul>
            {results.map((track) => (
              <li key={track.id}>
                <p>
                  {track.name} by{" "}
                  {track.artists.map((artist: any) => artist.name).join(", ")}
                </p>
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  width={50}
                  height={50}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
