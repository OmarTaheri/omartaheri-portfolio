import { CardStack } from "./CardStack";
import { DraggableStickers } from "./DraggableStickers";
import { Movable } from "./MovementSystem";

const EMAIL_ADDRESS = "omartaheri2005@gmail.com";

export function ProfileHero() {
  return (
    <section
      className="profile-section deck-scene"
      id="profile"
      aria-labelledby="profile-title"
    >
      <div className="profile-section__layout">
        <CardStack
          title="Omar Taheri"
          titleId="profile-title"
          lines={["Builds for the web,", "obsessed with AI."]}
        />

        <Movable
          movableId="hero-intro"
          className="profile-intro"
          ariaLabel="Profile introduction. Movable."
        >
          <p>
            Hi, I&apos;m Omar Taheri. Welcome to my digital corner. I&apos;m
            happy you&apos;re here—please, make yourself comfortable.
          </p>
          <p>
            I love web development, experimenting with new tools, and making
            things that feel good to use.
          </p>

          <div className="profile-intro__actions">
            <a
              className="cta-link cta-link--primary mailto-cta"
              href={`mailto:${EMAIL_ADDRESS}`}
            >
              Drop me a line
            </a>
            <a className="cta-link cta-link--secondary" href="#story">
              Explore my deck
            </a>
          </div>
        </Movable>
      </div>

      <p className="profile-section__scroll-cue" aria-hidden="true">
        Scroll to deal the next card
      </p>

      <DraggableStickers />
    </section>
  );
}
