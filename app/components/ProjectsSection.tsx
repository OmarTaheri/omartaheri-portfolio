import { projects } from "../content";
import { Movable } from "./MovementSystem";
import { ProjectCard, SeeMoreProjectCard } from "./ProjectCard";

const homeProjects = projects.slice(0, 3);

export function ProjectsSection() {
  return (
    <section
      className="projects-section content-section"
      id="projects"
      aria-labelledby="projects-title"
    >
      <Movable
        as="header"
        movableId="projects-heading"
        className="section-heading projects-section__heading"
        ariaLabel="Projects section heading. Movable."
      >
        <p className="section-kicker">Selected builds · Three cards</p>
        <h2 id="projects-title">Projects in the deck.</h2>
        <p>
          Start with three selected builds, then open the full deck for every
          app, utility, experiment, and work in progress.
        </p>
      </Movable>

      <ul className="project-deck project-deck--preview">
        {homeProjects.map((project, index) => (
          <li className="project-deck__item" key={project.slug}>
            <ProjectCard
              project={project}
              index={index}
              movableId={`project-card-${project.slug}`}
            />
          </li>
        ))}
        <li className="project-deck__item project-deck__item--more">
          <SeeMoreProjectCard
            count={projects.length}
            movableId="project-card-see-more"
          />
        </li>
      </ul>
    </section>
  );
}
