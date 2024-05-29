## このアプリに関して

音楽のサブスクサービスである Spotify を使用して曲情報を取ってくるアプリ

背景：昔 DJ をしていて、曲の MIX をさせる場合に同じ様な曲調、BPM（曲のテンポ）などが近しい音源を使用していた。これを Serato などで手動で解析して揃えるのが大変だった（曲のメタデータが壊れる、プレイリストが消えるなど）ので、Spotify で自分が作ったプレイリストと今回のアプリを連携させて BPM と曲調を見える化させることで、曲の構成などを直感的に触ることができる様になる様なアプリを作りたい。似たような曲調の BGM を探す事ができるのでプレイリストを分ける指標にもしたい。

ターゲット：DJ をしている人、お店・イベントの BGM を統一させたい人

仕様：ID とパスワードでログインし、自分のプレイリスト環境を取り出して曲の BPM や曲調(キー)などを一覧表示させたい。

テンポなどの API パラメータ情報一覧

[Web API Reference | Spotify for Developers](https://developer.spotify.com/documentation/web-api/reference/get-audio-features)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
