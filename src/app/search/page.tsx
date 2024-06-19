import React, { Suspense, useState } from "react";
import Search from "../_components/Search";

const Page = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Search />
      </Suspense>
    </>
  );
};

export default Page;
