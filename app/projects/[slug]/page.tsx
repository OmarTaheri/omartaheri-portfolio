import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "../../components/MarkdownContent";
import { ProjectArtwork } from "../../components/ProjectArtwork";
import { getProject, projects } from "../../content";
import { projectMarkdown } from "../../project-markdown";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found — Omar Taheri" };
  }

  return {
    title: `${project.title} — Omar Taheri`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  const markdown = projectMarkdown[slug];

  if (!project || !markdown) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previousProject =
    projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="project-detail-page">
      <nav className="project-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/projects">Projects</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </nav>

      <section className="project-detail-hero" aria-labelledby="project-title">
        <div className="project-detail-hero__copy">
          <p className="section-kicker">
            Card {String(projectIndex + 1).padStart(2, "0")} · {project.status}
          </p>
          <h1 id="project-title">{project.title}</h1>
          <p className="project-detail-hero__lead">{project.description}</p>

          <ul className="project-detail-tags" aria-label="Project tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          {project.repository || project.website ? (
            <div className="project-detail-actions">
              {project.website?.startsWith("http") ? (
                <a
                  className="cta-link cta-link--primary"
                  href={project.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit live project <span aria-hidden="true">↗</span>
                </a>
              ) : project.website ? (
                <Link
                  className="cta-link cta-link--primary"
                  href={project.website}
                >
                  Visit live project
                </Link>
              ) : null}
              {project.repository ? (
                <a
                  className="cta-link cta-link--secondary"
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="project-detail-hero__art" aria-hidden="true">
          <ProjectArtwork project={project} priority />
        </div>
      </section>

      <div className="project-detail-layout">
        <article className="project-detail-article">
          <MarkdownContent markdown={markdown} />
        </article>

        <aside className="project-detail-facts" aria-labelledby="toolbox-title">
          <p className="section-kicker">Toolbox</p>
          <h2 id="toolbox-title">Technologies used</h2>
          <ul>
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          <p className="project-detail-facts__note">
            This project note lives in its own Markdown file and can grow with
            the build.
          </p>
        </aside>
      </div>

      <nav className="project-pagination" aria-label="More projects">
        <Link href={`/projects/${previousProject.slug}`}>
          <span className="project-pagination__label">Previous card</span>
          <span>{previousProject.title}</span>
        </Link>
        <Link href={`/projects/${nextProject.slug}`}>
          <span className="project-pagination__label">Next card</span>
          <span>{nextProject.title}</span>
        </Link>
      </nav>
    </main>
  );
}
