import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "../components/ProjectCard";
import { projects } from "../content";

export const metadata: Metadata = {
  title: "Projects — Omar Taheri",
  description:
    "Explore Omar Taheri's web applications, AI experiments, utilities, robotics work, and self-hosted projects.",
};

export default function ProjectsPage() {
  return (
    <main className="projects-index-page">
      <header className="projects-index-hero">
        <Link className="subpage-back-link" href="/#projects">
          <span aria-hidden="true">←</span> Back to the selected deck
        </Link>
        <p className="section-kicker">Full collection · {projects.length} cards</p>
        <h1>Every project in the deck.</h1>
        <p>
          Open any card for its story, current status, and a Markdown-backed
          breakdown of the technologies behind it.
        </p>
      </header>

      <section
        className="projects-index-collection"
        aria-labelledby="all-projects-title"
      >
        <h2 className="sr-only" id="all-projects-title">
          All projects
        </h2>
        <ul className="project-deck project-deck--all">
          {projects.map((project, index) => (
            <li className="project-deck__item" key={project.slug}>
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
