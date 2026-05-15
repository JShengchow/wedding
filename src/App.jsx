import { MusicToggle } from "./components/MusicToggle";
import { Countdown } from "./sections/Countdown";
import { Details } from "./sections/Details";
import { FeaturePhotos } from "./sections/FeaturePhotos";
import { Footer } from "./sections/Footer";
import { Gallery } from "./sections/Gallery";
import { Hero } from "./sections/Hero";
import { Invitation } from "./sections/Invitation";
import { OurStory } from "./sections/OurStory";
import { RsvpForm } from "./sections/RsvpForm";
import { Schedule } from "./sections/Schedule";
import { Vow } from "./sections/Vow";

export default function WeddingInvitationH5() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ivory text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-petal-radial opacity-70"
      />

      <MusicToggle />

      <Hero />
      <Countdown />
      <Invitation />
      <OurStory />
      <Details />
      <Schedule />
      <Vow />
      <RsvpForm />
      <FeaturePhotos />
      <Gallery />
      <Footer />
    </div>
  );
}
