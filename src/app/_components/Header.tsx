"use client";

import React from "react";
import style from "styled-components";
import { Button, ButtonGroup } from "@yamada-ui/react";

export function Header() {
  const logout = () => {
    localStorage.removeItem("spotify_access_token");
    window.location.href = "/";
  };
  return (
    <>
      <HeaderDiv>
        <Title>Spotify Analyser</Title>
        <NavButton colorScheme="danger" onClick={logout}>
          Logout
        </NavButton>
      </HeaderDiv>
    </>
  );
}

const HeaderDiv = style.header`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  background-color: green;`;

const Title = style.h1`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 1rem;
  color: white;
`;

const NavButton = style(Button)`
  position: absolute;
  font-size: 1rem;
  top: 0;
  right: 0;
  margin: 2rem 2rem 0 0;
  color: white;`;
