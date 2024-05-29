/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonGroup } from "@yamada-ui/react";
import style from "styled-components";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
} from "@yamada-ui/react";

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

    const fetchedTrackInfos = [];
    for (let i = 0; i < data.tracks.items.length; i++) {
      const trackId = data.tracks.items[i].id;
      const trackInfoResponse = await fetch(
        `https://api.spotify.com/v1/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (trackInfoResponse.ok) {
        const trackData = await trackInfoResponse.json();
        fetchedTrackInfos.push(trackData);
      } else {
        console.error(`Failed to fetch track info for ${trackId}`);
      }

      // 遅延を挿入する
      await sleep(1000);
    }

    setTracksInfos(fetchedTrackInfos);
  };

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getTrackInfo = (trackId: string) => {
    return tracksInfos.find((info) => info.id === trackId);
  };

  return (
    <SearchDiv>
      <H1>Search for a Song</H1>
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter song name"
        />
        <Button colorScheme="secondary" type="submit">
          Search
        </Button>
      </SearchForm>
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
                <p>BPM: {getTrackInfo(track.id)?.tempo ?? "N/A"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SearchDiv>
  );
};

export default Search;

const SearchDiv = style.div`
  text-align: center;
  margin-top: 5rem;`;

const H1 = style.h1`
  font-size: 3rem;
  margin: 0 0 50px 0;`;

const SearchForm = style.form`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  `;

const SearchInput = style(Input)`
  padding: 0.5rem;
  width:60%`;
