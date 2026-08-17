import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectsIntro } from "@/components/ProjectsIntro";
import { VaultSection } from "@/components/VaultSection";
import { TaskSection } from "@/components/TaskSection";
import { ServicesBridge } from "@/components/ServicesBridge";
import { ServicesStory } from "@/components/ServicesStory";
import { FinalCTA } from "@/components/FinalCTA";
import { MotionDirector } from "@/components/MotionDirector";
import { MotionWorld } from "@/components/MotionWorld";

export default function Home() {
  return (
    <SmoothScroll>
      <MotionDirector />
      <MotionWorld />
      <Header />
      <main>
        <Hero />
        <ProjectsIntro />
        <VaultSection />
        <TaskSection />
        <ServicesBridge />
        <ServicesStory />
        <FinalCTA />
      </main>
    </SmoothScroll>
  );
}
