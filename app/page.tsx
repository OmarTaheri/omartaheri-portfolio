import { ContactSection } from "./components/ContactSection";
import { NowSection } from "./components/NowSection";
import { ProfileHero } from "./components/ProfileHero";
import { ProjectsSection } from "./components/ProjectsSection";
import { StatsSection } from "./components/StatsSection";
import { StorySection } from "./components/StorySection";

export default function Home() {
  return (
    <main className="portfolio-page">
      <ProfileHero />
      <ProjectsSection />
      <StorySection />
      <StatsSection />
      <NowSection />
      <ContactSection />
    </main>
  );
}
