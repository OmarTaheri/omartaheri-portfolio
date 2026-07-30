import Link from "next/link";
import type { Project } from "../content";
import { Movable } from "./MovementSystem";
import { ProjectArtwork } from "./ProjectArtwork";

function ProjectCardContents({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <>
      <div className="project-card__art" aria-hidden="true">
        <ProjectArtwork project={project} />
      </div>
      <header className="project-card__header">
        <span className="project-card__number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="project-card__status">{project.status}</span>
      </header>

      <h3>{project.title}</h3>
      <p className="project-card__description">{project.description}</p>

      <ul className="project-card__tags" aria-label="Project tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <span className="project-card__link">
        Read project notes
        <span aria-hidden="true"> →</span>
      </span>
    </>
  );
}

export function ProjectCard({
  project,
  index,
  movableId,
}: {
  project: Project;
  index: number;
  movableId?: string;
}) {
  const href = `/projects/${project.slug}`;
  const label = `Open the ${project.title} project page`;

  if (movableId) {
    return (
      <Movable
        as="a"
        movableId={movableId}
        className="project-card"
        href={href}
        ariaLabel={`${label}. Movable card.`}
      >
        <ProjectCardContents project={project} index={index} />
      </Movable>
    );
  }

  return (
    <Link className="project-card" href={href} aria-label={label}>
      <ProjectCardContents project={project} index={index} />
    </Link>
  );
}

export function SeeMoreProjectCard({
  count,
  movableId,
}: {
  count: number;
  movableId?: string;
}) {
  const content = (
    <>
      <span className="project-more-card__count" aria-hidden="true">
        {String(count).padStart(2, "0")}
      </span>
      <p className="section-kicker">The full collection</p>
      <h3>See every project in the deck.</h3>
      <p>
        Open the complete archive for all {count} builds, experiments, and
        works in progress.
      </p>
      <span className="project-more-card__action">
        View all projects
        <span aria-hidden="true"> →</span>
      </span>
    </>
  );

  if (movableId) {
    return (
      <Movable
        as="a"
        movableId={movableId}
        className="project-more-card"
        href="/projects"
        ariaLabel="View all projects. Movable card."
      >
        {content}
      </Movable>
    );
  }

  return (
    <Link className="project-more-card" href="/projects">
      {content}
    </Link>
  );
}
