import Image from "next/image";
import { storyChapters } from "../content";
import { Movable } from "./MovementSystem";

export function StorySection() {
  return (
    <section
      className="story-section content-section"
      id="story"
      aria-labelledby="story-title"
    >
      <Movable
        as="header"
        movableId="story-heading"
        className="section-heading story-section__heading"
        ariaLabel="Story section heading. Movable."
      >
        <p className="section-kicker">Origin deck · Six chapters</p>
        <h2 id="story-title">Hello, world.</h2>
        <p>
          I am Omar. The route from a quiet Moroccan city to high-traffic web
          systems was not exactly straight, but every stop taught me how to
          build.
        </p>
      </Movable>

      <ol className="story-route" aria-label="Omar's story">
        {storyChapters.map((chapter, index) => (
          <Movable
            as="li"
            movableId={`story-card-${index + 1}`}
            className="story-route__stop"
            key={chapter.id}
            ariaLabel={`${chapter.title} story card. Movable.`}
          >
            <article className="story-card">
              <Image
                className="story-card__sticker"
                src={chapter.art}
                alt=""
                width={288}
                height={384}
                unoptimized
              />
              <div className="story-card__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="story-card__marker">{chapter.marker}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
            </article>
          </Movable>
        ))}
      </ol>

      <Movable
        as="aside"
        movableId="story-annotation"
        className="story-section__annotation"
        ariaLabel="Story closing annotation. Movable."
      >
        <span aria-hidden="true">↳</span>
        They told me to go outside. I stayed in and built.
      </Movable>
    </section>
  );
}
