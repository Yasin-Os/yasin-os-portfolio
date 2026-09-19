import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";

/**
 * Homepage CTA card — modelled on the user's reference screenshot.
 * The actual contact details are managed by the admin via contact_entries
 * and rendered on /contact.
 */
export function GetInTouch() {
  return (
    <div className="rounded-3xl glass border border-primary/20 p-8 sm:p-10 text-center shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow">
      <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">Get In Touch</h2>
      <p className="mt-3 text-muted-foreground max-w-md mx-auto">
        Have a project in mind or just want to chat?
      </p>

      <Link
        to="/contact"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl glass border border-primary/30 px-6 py-3 text-base font-semibold text-foreground hover-lift"
      >
        <Send size={18} className="text-primary" />
        Contact Me
      </Link>
    </div>
  );
}
