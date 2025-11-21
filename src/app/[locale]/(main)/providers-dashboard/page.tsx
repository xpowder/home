import React from "react";

import PostCard2 from "../homeComponents/postCard/PostCard2";
import FeaturesCommingSoon from "./components/featuresCommingSoon";
import MyPerformance from "./components/myPerformance";
import MyServices from "./components/myServices";
import PortfolioAndCredentials from "./components/portfolioAndCredentials";
import Profile from "./components/profile";

export default function Page() {
  return (
    <div>
      <Profile />
      <MyPerformance />
      <MyServices />
      <PortfolioAndCredentials />
      <FeaturesCommingSoon />
      <PostCard2 />
    </div>
  );
}
