import Hero from "@/components/homepage/Hero";
import FeaturedArtworks from "@/components/homepage/FeaturedArtworks";
import TopArtists from "@/components/homepage/TopArtists";
import ArtCategories from "@/components/homepage/ArtCategories";
import WhyArtHub from "@/components/homepage/WhyArtHub";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedArtworks />
      <ArtCategories />
      <TopArtists />
      <WhyArtHub />
    </div>
  );
}
