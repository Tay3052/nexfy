export const search = async (query: string, accessToken: string) =>
  await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export const trackInfos = async (trackId: String, accessToken: string) =>
  await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

// 曲情報をとるのに待機時間を作る
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTrackInfo = (trackId: string, tracksInfos: any) => {
  return tracksInfos.find((info: any) => info.id === trackId);
};
