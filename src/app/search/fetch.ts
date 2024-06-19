export const search = async (query: string, accessToken: string, page = 1) => {
  const offset = (page - 1) * 20; // 1ページあたり20結果と仮定
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&offset=${offset}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

export const trackInfos = async (trackId: String, accessToken: string) =>
  await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const paginate = async (
  query: string,
  accessToken: string,
  number: number
) =>
  await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=${number * 10}&offset=${number * 20}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

// 曲情報をとるのに待機時間を作る
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTrackInfo = (trackId: string, tracksInfos: any) => {
  return tracksInfos.find((info: any) => info.id === trackId);
};
