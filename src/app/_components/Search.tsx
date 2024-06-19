/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Center, Text, Pagination } from "@yamada-ui/react";
import style from "styled-components";
import { Input } from "@yamada-ui/react";
import { TrackInfos } from "../interface/interface";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@yamada-ui/react";
import { search, trackInfos, sleep, paginate } from "../search/fetch";

const Search: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [tracksInfos, setTracksInfos] = useState<TrackInfos[]>([]);
  const [playList, setPlayList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [playlistPage, setPlaylistPage] = useState<number>(1);

  // アクセストークンの取得
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
      await sleep(10);
    }
    setTracksInfos(fetchedTrackInfos);
    console.log(fetchedTrackInfos);
  };

  const handleSearchPaginate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !query) return;
    const res = await paginate(query, accessToken, page);
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
      await sleep(10);
    }
    setTracksInfos(fetchedTrackInfos);
    console.log(fetchedTrackInfos);
  };

  const handleAddToPlaylist = (trackId: string) => {
    try {
      const trackToAdd = results.find((track) => track.id === trackId);
      setPlayList((prevPlayList) => {
        // すでにtrackIdがプレイリストに存在するかチェック
        if (prevPlayList.some((track) => track.id === trackId)) {
          return prevPlayList;
        }
        return [...prevPlayList, trackToAdd];
      });
    } catch (e) {
      console.log(e);
    }
  };

  // プレイリストから削除
  const handlePopFromPlaylist = (trackId: string) => {
    setPlayList((prevPlayList) =>
      prevPlayList.filter((track) => track.id !== trackId)
    );
  };

  const getTrackInfo = (trackId: string) => {
    return tracksInfos.find((info) => info.id === trackId);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchDiv>
        <H1>Search for a Song</H1>
        <SearchForm onSubmit={handleSearch}>
          <Center>
            <SearchInput
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter song name"
            />
            <Button colorScheme="secondary" type="submit">
              Search
            </Button>
          </Center>
        </SearchForm>
        <Tabs align="center">
          <Tab>Result</Tab>
          <Tab>PlayList</Tab>
          <TabPanel>
            <ResultDiv>
              {results.length > 0 && (
                <Items>
                  {results.map((track) => (
                    <button
                      key={track.id}
                      value={track.id}
                      onClick={() => handleAddToPlaylist(track.id)}>
                      <ResultItems key={track.id}>
                        <ItemNames>
                          <ItemImage
                            src={track.album.images[0].url}
                            alt={track.name}
                            width={100}
                            height={100}
                          />
                          <ItemDiv>
                            <ItemName fontSize="2xl">
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
                      </ResultItems>
                    </button>
                  ))}
                </Items>
              )}

              <Center>
                <Pagination
                  page={page}
                  total={10}
                  onChange={setPage}
                  onClick={handleSearchPaginate}
                />
              </Center>
            </ResultDiv>
          </TabPanel>
          {/* Playlist */}
          <TabPanel>
            <ResultDiv>
              {playList.length > 0 && (
                <Items>
                  {playList.map((track) => (
                    <button
                      key={track.id}
                      value={track.id}
                      onClick={() => handlePopFromPlaylist(track.id)}>
                      <ResultItems key={track.id}>
                        <ItemNames>
                          <ItemImage
                            src={track.album.images[0].url}
                            alt={track.name}
                            width={100}
                            height={100}
                          />
                          <ItemDiv>
                            <ItemName fontSize="2xl">
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
                      </ResultItems>
                    </button>
                  ))}
                </Items>
              )}
              <Center>
                <Pagination
                  page={playlistPage}
                  total={10}
                  onChange={setPlaylistPage}
                  onClick={handleSearchPaginate}
                />
              </Center>
            </ResultDiv>
          </TabPanel>
        </Tabs>
      </SearchDiv>
    </Suspense>
  );
};

export default Search;

const SearchDiv = style.div`
  
  text-align: center;
  margin-top: 5rem;`;

const H1 = style.h1`
  font-size: 3rem;
  margin: 50px 0 50px 0;`;

const SearchForm = style.form`
  display: flex;
  justify-content: center;
  margin: 0 0 50px 0;
  `;

const SearchInput = style(Input)`
  padding: 0.5rem;
  width:60%`;

const ResultDiv = style.div`
  width: 70%;
  margin-top: 50px;
  text-align: left;
`;

const ItemDiv = style.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const Items = style.ul`
  
  margin: 0 auto 0 auto;
  display: flex;
  flex-direction: column;`;

const ResultItems = style.li`
  width: 500px;
  border: 3px solid white;
  border-radius: 10px;
  margin: 10px auto 20px auto;
  &:hover{
    background-color: #010101;
  };`;

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

const SelectButton = style.button`
  hover:{
    cursor: pointer;
    background-color: #f0f0f0;
  }
`;
