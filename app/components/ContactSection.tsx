import { CopyEmailButton } from "./CopyEmailButton";
import { Movable } from "./MovementSystem";

const EMAIL_ADDRESS = "omartaheri2005@gmail.com";

export function ContactSection() {
  return (
    <section
      className="contact-section content-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <Movable
        movableId="contact-card"
        className="contact-finale"
        ariaLabel="Contact invitation. Movable."
      >
        <p className="section-kicker">Your move</p>
        <h2 id="contact-title">Let&apos;s build something useful.</h2>

        <address className="contact-finale__actions">
          <a
            className="cta-link cta-link--primary mailto-cta"
            href={`mailto:${EMAIL_ADDRESS}`}
          >
            Send me an email
          </a>
          <CopyEmailButton />
        </address>
      </Movable>
    </section>
  );
}
