"use client";
import React from "react";

import BrowseProvidersHero from "./components/BrowseProvidersHero";
import TopRatedProviders from "./components/TopRatedProviders";
import AllProviders from "./components/AllProviders";

export default function BrowseProvidersPage() {
  return (
    <div className="w-full">
      <BrowseProvidersHero />
      <div className="container mx-auto space-y-12 px-5 py-8">
        <TopRatedProviders />
        <AllProviders />
      </div>
    </div>
  );
}

