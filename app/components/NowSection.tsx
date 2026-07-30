import { Movable } from "./MovementSystem";

export function NowSection() {
  return (
    <section
      className="now-section content-section"
      id="now"
      aria-labelledby="now-title"
    >
      <Movable
        movableId="now-card"
        className="now-card"
        ariaLabel="What Omar is working on now. Movable."
      >
        <header className="now-card__heading">
          <p className="section-kicker">Current quest · Card in play</p>
          <h2 id="now-title">Purpose over busywork.</h2>
        </header>

        <div className="now-card__copy">
          <p>
            Right now, I am working on VEX U and helping a streaming platform
            scale its infrastructure for the next wave of traffic.
          </p>
          <p>
            The work I want more of is purposeful: hard systems, useful
            products, and a diverse team of talented people who see the problem
            from different angles.
          </p>
        </div>

        <div className="now-card__actions">
          <a className="text-link" href="#projects">
            See the project deck
          </a>
          <a className="text-link" href="#contact">
            Start a conversation
          </a>
        </div>
      </Movable>
    </section>
  );
}
