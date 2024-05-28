import React from "react";
import style from "styled-components";

export function Header() {
  return (
    <HeaderDiv>
      <Title>Spotify Analyser</Title>
    </HeaderDiv>
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
