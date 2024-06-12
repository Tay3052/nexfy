/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Text } from "@yamada-ui/react";
import style from "styled-components";
import { Input } from "@yamada-ui/react";
import { TrackInfos } from "../interface/interface";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@yamada-ui/react";
import { search, trackInfos, sleep } from "../api/search/route";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [tracksInfos, setTracksInfos] = useState<TrackInfos[]>([]);
  const [playList, setPlayList] = useState<any[]>([]);

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

  // 検索ボタンを押した時に発火
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !query) return;
    const res = await search(query, accessToken);
    const data = await res.json();
    console.log(data);
    setResults(data.tracks.items);
    console.log(data.tracks.items);

    // 曲の情報を上で撮ってきたIDから取得
    // 曲情報を保存するための配列を指定

    const fetchedTrackInfos = [];
    for (let i = 0; i < data.tracks.items.length; i++) {
      const trackId = data.tracks.items[i].id;
      const trackInfoResponse = await trackInfos(trackId, accessToken);
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
    console.log(fetchedTrackInfos);
  };

  const playListData: any[] = [];
  const handleAddToPlaylist = (trackId: string) => {
    try {
      for (let i = 0; i < results.length; i++) {
        if (results[i].id == trackId) {
          playListData.push(results[i]);
        }
      }
      setPlayList(playListData);
      console.log(playList);
    } catch (e) {
      console.log(e);
    }
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
      <Tabs align="center">
        <Tab>Result</Tab>
        <Tab>PlayList</Tab>

        <TabPanel>
          <ResultDiv>
            {results.length > 0 && (
              <Items>
                {results.map((track) => (
                  <ResultItems key={track.id}>
                    <button
                      value={track.id}
                      onClick={() => handleAddToPlaylist(track.id)}>
                      <ItemNames>
                        <ItemImage
                          src={track.album.images[0].url}
                          alt={track.name}
                          width={100}
                          height={100}
                        />
                        <ItemDiv>
                          <ItemName fontSize="4xl">
                            {track.name} by{" "}
                            {track.artists
                              .map((artist: any) => artist.name)
                              .join(", ")}
                          </ItemName>
                        </ItemDiv>
                      </ItemNames>
                      <ItemInfos>
                        <Text>
                          BPM: {getTrackInfo(track.id)?.tempo ?? "N/A"}
                        </Text>
                        <Text>
                          ENERGY: {getTrackInfo(track.id)?.energy ?? "N/A"}
                        </Text>
                        <Text>
                          MusicKEY: {getTrackInfo(track.id)?.key ?? "N/A"}
                        </Text>
                        <Text>
                          Danceability:{" "}
                          {getTrackInfo(track.id)?.danceability ?? "N/A"}
                        </Text>
                      </ItemInfos>
                    </button>
                  </ResultItems>
                ))}
              </Items>
            )}
          </ResultDiv>
        </TabPanel>
        {/* Playlist */}
        <TabPanel>
          <ResultDiv>
            {playList.length > 0 && (
              <Items>
                {playList.map((track) => (
                  <ResultItems key={track.id}>
                    <ItemNames>
                      <ItemImage
                        src={track.album.images[0].url}
                        alt={track.name}
                        width={100}
                        height={100}
                      />
                      <ItemDiv>
                        <ItemName fontSize="4xl">
                          {track.name} by{" "}
                          {track.artists
                            .map((artist: any) => artist.name)
                            .join(", ")}
                        </ItemName>
                      </ItemDiv>
                    </ItemNames>
                    <ItemInfos>
                      <Text>BPM: {getTrackInfo(track.id)?.tempo ?? "N/A"}</Text>
                      <Text>
                        ENERGY: {getTrackInfo(track.id)?.energy ?? "N/A"}
                      </Text>
                      <Text>
                        MusicKEY: {getTrackInfo(track.id)?.key ?? "N/A"}
                      </Text>
                      <Text>
                        Danceability:{" "}
                        {getTrackInfo(track.id)?.danceability ?? "N/A"}
                      </Text>
                    </ItemInfos>
                  </ResultItems>
                ))}
              </Items>
            )}
          </ResultDiv>
        </TabPanel>
      </Tabs>
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
  `;

const SearchInput = style(Input)`
  padding: 0.5rem;
  width:60%`;

const ResultDiv = style.div`
  margin-top: 50px;
  text-align: left;
    margin: 0 auto 50px auto;
`;

const ItemDiv = style.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const Items = style.ul`
  width: 70%;
  margin: 0 auto 0 auto;`;

const ResultItems = style.li`
  border: 3px solid white;
  border-radius: 10px;
  margin: 10px 10px 20px 10px;`;

const ItemInfos = style.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  margin: 0 0 0 20px;
  p {
    margin: 0 10px 0 0;
  }
  img {
    border-radius: 10px;
  }
`;

const ItemImage = style.img`
  border-radius: 10px;
  margin: 10px 10px 0 10px;
  `;

const ItemNames = style.div`
  display: flex;
  justify-content: flex-start;
  margin: 20px 0px 0 30px
;`;

const ItemName = style(Text)`
  margin: 0 0px 0 30px;

`;
