import Image from "next/image";
import { metrics, skills } from "../content";
import { Movable } from "./MovementSystem";

export function StatsSection() {
  return (
    <section
      className="stats-section content-section"
      id="stats"
      aria-labelledby="stats-title"
    >
      <Movable
        as="header"
        movableId="stats-heading"
        className="section-heading stats-section__heading"
        ariaLabel="Player stats section heading. Movable."
      >
        <p className="section-kicker">Player stats · The hand I play</p>
        <h2 id="stats-title">Built by doing.</h2>
        <p>
          A few numbers from the journey, plus the tools I reach for when an
          idea needs to become a useful, resilient product.
        </p>
      </Movable>

      <dl className="metric-card-grid">
        {metrics.map((metric, index) => (
          <Movable
            movableId={`metric-card-${index + 1}`}
            className="metric-card"
            key={metric.label}
            ariaLabel={`${metric.value}, ${metric.label}. Movable metric card.`}
          >
            <dt className="metric-card__label">{metric.label}</dt>
            <dd className="metric-card__value">{metric.value}</dd>
            <dd className="metric-card__detail">{metric.detail}</dd>
          </Movable>
        ))}
      </dl>

      <div className="skill-hand">
        <h3>The current hand</h3>
        <ul className="skill-hand__cards" aria-label="Tools and skills">
          {skills.map((skill, index) => (
            <Movable
              as="li"
              movableId={`skill-card-${index + 1}`}
              className="skill-card"
              key={skill.name}
              ariaLabel={`${skill.name} skill card. Movable.`}
            >
              <span className="skill-card__category">{skill.category}</span>
              <Image
                className="skill-card__logo"
                src={skill.logo}
                alt={`${skill.logoLabel} logo`}
                width={56}
                height={56}
                unoptimized
              />
              <strong>{skill.name}</strong>
            </Movable>
          ))}
        </ul>
      </div>
    </section>
  );
}
