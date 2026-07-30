import Image from "next/image";
import { Movable } from "./MovementSystem";

type CardStackProps = {
  title: string;
  titleId?: string;
  lines: string[];
};

export function CardStack({ title, titleId, lines }: CardStackProps) {
  return (
    <div className="card-stack">
      <Movable
        movableId="hero-card-back-left"
        className="card card-back card-back-left"
        ariaLabel="Left decorative card. Movable."
      >
        <Image
          className="card-art card-art-rotated"
          src="/card-back-pattern.webp"
          alt=""
          width={996}
          height={1427}
          sizes="(max-width: 600px) 190px, 320px"
          priority
          unoptimized
        />
      </Movable>

      <Movable
        movableId="hero-card-back-right"
        className="card card-back card-back-right"
        ariaLabel="Right decorative card. Movable."
      >
        <Image
          className="card-art card-art-rotated"
          src="/card-back-pattern.webp"
          alt=""
          width={996}
          height={1427}
          sizes="(max-width: 600px) 190px, 320px"
          priority
          unoptimized
        />
      </Movable>

      <Movable
        as="article"
        movableId="hero-card-front"
        className="card card-front"
        ariaLabel={`${title} introduction card. Movable.`}
      >
        <Image
          className="card-art card-art-rotated front-border"
          src="/card-border-ornate-front.webp"
          alt=""
          width={1003}
          height={1429}
          sizes="(max-width: 600px) 190px, 320px"
          priority
          unoptimized
        />

        <div className="card-copy">
          <Image
            className="flourish flourish-top"
            src="/card-divider-flourish.webp"
            alt=""
            width={2172}
            height={724}
            sizes="126px"
            unoptimized
          />

          <h1 id={titleId}>{title}</h1>

          <p>
            {lines.map((line, index) => (
              <span key={line}>
                {line}
                {index < lines.length - 1 && <br />}
              </span>
            ))}
          </p>

          <Image
            className="flourish flourish-bottom"
            src="/card-divider-flourish.webp"
            alt=""
            width={2172}
            height={724}
            sizes="126px"
            unoptimized
          />
        </div>
      </Movable>
    </div>
  );
}
