"use client";
import { useRouter } from "next/navigation";
import style from "styled-components";
import { Button, ButtonGroup } from "@yamada-ui/react";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/api/login");
  };

  return (
    <>
      <Div1>
        <H1>Welcome to Spotify Auth</H1>
        <Button colorScheme="secondary" onClick={handleLogin}>
          Login with Spotify
        </Button>
      </Div1>
    </>
  );
}

const H1 = style.h1`
  font-size: 3rem;
  margin: 0 0 50px 0;`;

const Div1 = style.div`
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
`;
