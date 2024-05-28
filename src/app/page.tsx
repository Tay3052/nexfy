"use client";

import { useRouter } from "next/navigation";
import { Header } from "../app/_components/Header";
import style from "styled-components";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/api/login");
  };

  return (
    <>
      <Header />
      <Div1>
        <h1>Welcome to Spotify Auth</h1>
        <button onClick={handleLogin}>Login with Spotify</button>
      </Div1>
    </>
  );
}

const Div1 = style.div`
  text-align: center;
  margin: 3rem 0;
  padding: 2rem;
`;
