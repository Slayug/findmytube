import React from "react";
import Home from "./home/Home";
import Providers from "./providers";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Providers>
        <Home />
      </Providers>
    </main>
  )
}
