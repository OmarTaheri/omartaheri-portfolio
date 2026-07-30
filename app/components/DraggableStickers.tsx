import Image from "next/image";
import { type CSSProperties } from "react";
import { Movable } from "./MovementSystem";

type StickerStyle = CSSProperties & {
  "--sticker-rotation": string;
};

const stickers = [
  {
    className: "sticker-one",
    rotation: "0deg",
    src: "/stickers/omar.png",
    label: "Omar",
  },
  {
    className: "sticker-two",
    rotation: "8deg",
    src: "/stickers/morocco.png",
    label: "Morocco",
  },
  {
    className: "sticker-three",
    rotation: "-11deg",
    src: "/stickers/laptob.webp",
    label: "Laptop",
  },
  {
    className: "sticker-four",
    rotation: "7deg",
    src: "/stickers/vinyl.webp",
    label: "Vinyl record",
  },
  {
    className: "sticker-five",
    rotation: "-9deg",
    src: "/stickers/dumbbell.png",
    label: "Dumbbell",
  },
  {
    className: "sticker-six",
    rotation: "11deg",
    src: "/stickers/surfboard.png",
    label: "Surfboard",
  },
  {
    className: "sticker-seven",
    rotation: "-6deg",
    src: "/stickers/spaghetti.webp",
    label: "Spaghetti",
  },
  {
    className: "sticker-eight",
    rotation: "8deg",
    src: "/stickers/football.webp",
    label: "Football",
  },
  {
    className: "sticker-nine",
    rotation: "0deg",
    src: "/stickers/cat.png",
    label: "Cat",
  },
  {
    className: "sticker-ten",
    rotation: "6deg",
    src: "/stickers/spaceship.png",
    label: "Spaceship",
  },
  {
    className: "sticker-eleven",
    rotation: "-7deg",
    src: "/stickers/rtx5080.png",
    label: "RTX 5080",
  },
  {
    className: "sticker-twelve",
    rotation: "9deg",
    src: "/stickers/tor-browser-icon.png",
    label: "Tor Browser",
  },
  {
    className: "sticker-thirteen",
    rotation: "-8deg",
    src: "/stickers/vs-code.png",
    label: "Visual Studio Code",
  },
  {
    className: "sticker-fourteen",
    rotation: "5deg",
    src: "/stickers/Starbucks-Cup-PNG-Clipart.png",
    label: "Coffee cup",
  },
  {
    className: "sticker-fifteen",
    rotation: "-6deg",
    src: "/stickers/sade.webp",
    label: "Sade",
  },
  {
    className: "sticker-sixteen",
    rotation: "4deg",
    src: "/stickers/me-again.png",
    label: "Omar Polaroid",
  },
  {
    className: "sticker-seventeen",
    rotation: "-5deg",
    src: "/stickers/hunters-licens.webp",
    label: "Hunter license",
  },
  {
    className: "sticker-eighteen",
    rotation: "-2deg",
    src: "/stickers/sakura.gif",
    label: "Animated sakura branch",
    imageWidth: 200,
    imageHeight: 144,
  },
  {
    className: "sticker-nineteen",
    rotation: "2deg",
    src: "/stickers/computer-pixel.gif",
    label: "Animated pixel computer",
    imageWidth: 200,
    imageHeight: 178,
  },
] as const;

export function DraggableStickers() {
  return (
    <div
      className="sticker-field"
      role="group"
      aria-label="Movable personal sticker decorations"
    >
      {stickers.map((sticker, index) => {
        const isSakura = sticker.className === "sticker-eighteen";
        const isComputer = sticker.className === "sticker-nineteen";
        const style: StickerStyle = {
          "--sticker-rotation": sticker.rotation,
        };

        return (
          <Movable
            as="button"
            key={sticker.className}
            movableId={`hero-sticker-${index + 1}`}
            bounds="parent"
            className={`draggable-sticker ${sticker.className}`}
            style={style}
            type="button"
            ariaLabel={`${sticker.label} decoration ${index + 1} of ${
              stickers.length
            }. Hold and drag, use arrow keys to move, or press Home to reset.`}
          >
            <Image
              src={sticker.src}
              alt=""
              aria-hidden="true"
              width={"imageWidth" in sticker ? sticker.imageWidth : 288}
              height={"imageHeight" in sticker ? sticker.imageHeight : 288}
              sizes={
                isSakura
                  ? "(max-width: 760px) 120px, 12vw"
                  : isComputer
                    ? "(max-width: 760px) 72px, 8vw"
                  : "(max-width: 760px) 52px, 7vw"
              }
              loading={
                sticker.className === "sticker-sixteen" ||
                isSakura ||
                isComputer
                  ? "eager"
                  : "lazy"
              }
              fetchPriority={
                sticker.className === "sticker-sixteen" ? "high" : "auto"
              }
              unoptimized
              draggable={false}
            />
          </Movable>
        );
      })}
    </div>
  );
}
