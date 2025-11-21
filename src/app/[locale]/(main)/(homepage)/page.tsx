import BrowseByNeed from "../homeComponents/browseByNeed/BrowseByNeed";
import Cta from "../homeComponents/cta/Cta";
import Testimonials from "../homeComponents/customerTestimonianls/Testimonials";
import Faq from "../homeComponents/faq/Faq";
import Hero from "../homeComponents/hero/Hero";
import HHW from "../homeComponents/hhw/hhw2";
import LatestOfferFromProviders from "../homeComponents/latestOffer/LatestOfferFromProviders";
import MeetHelpers from "../homeComponents/meetHelpers/MeetHelpers";
import Offers from "../homeComponents/offers/Offers";
import PostCard2 from "../homeComponents/postCard/PostCard2";

export default function page() {
  return (
    <div>
      <Hero />
      <BrowseByNeed />
      <Offers />
      <LatestOfferFromProviders />
      <MeetHelpers />
      <HHW />
      <Testimonials />
      <Faq />
      <PostCard2 />
      <Cta />
    </div>
  );
}
