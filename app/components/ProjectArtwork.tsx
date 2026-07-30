import Image from "next/image";
import type { Project } from "../content";

export function ProjectArtwork({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  if (!project.art) return null;

  const isHeyNotAI = project.slug === "heynotai";

  return (
    <div
      className={`project-artwork${
        isHeyNotAI ? " project-artwork--heynotai" : ""
      }`}
    >
      {isHeyNotAI ? (
        <span className="project-artwork__eyebrow">
          HEYNOTAI / SIGNAL CHECK
        </span>
      ) : null}
      <Image
        className="project-artwork__image"
        src={project.art}
        alt=""
        width={416}
        height={468}
        priority={priority}
        unoptimized
      />
    </div>
  );
}
