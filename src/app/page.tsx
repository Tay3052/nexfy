"use client";
import { useRouter } from "next/navigation";
import style from "styled-components";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/api/login");
  };

  return (
    <>
      <Div1>
        <h1>Welcome to Spotify Auth</h1>
        <button onClick={handleLogin}>Login with Spotify</button>
      </Div1>
    </>
  );
}

const Div1 = style.div`
  text-align: center;
  padding: 2rem;
`;
