import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "UniIntern made it easy to find qualified interns. We hired three students who are now full-time. The platform is a game-changer for campus recruiting.",
    name: "Priya Sharma",
    role: "HR Lead, TechStart India",
    rating: 5,
  },
  {
    quote:
      "I landed my first internship through UniIntern within two weeks. The matching was spot-on and the university support made the process smooth.",
    name: "Rahul Verma",
    role: "Computer Science, IIT Delhi",
    rating: 5,
  },
  {
    quote:
      "As a TPO, I can track placements, manage company partnerships, and give students visibility—all in one place. It has streamlined our entire process.",
    name: "Dr. Anjali Mehta",
    role: "Training & Placement Officer, State University",
    rating: 5,
  },
  {
    quote:
      "The quality of candidates we get through UniIntern is outstanding. We've built a pipeline that saves us weeks of recruitment effort every season.",
    name: "Vikram Singh",
    role: "Head of Talent, DataFlow Solutions",
    rating: 5,
  },
  {
    quote:
      "From profile to offer, everything was transparent. My placement cell and I could see exactly where each application stood. Highly recommend.",
    name: "Kavya Reddy",
    role: "Final Year, BITS Pilani",
    rating: 5,
  },
  {
    quote:
      "We onboarded five colleges in a month. The superadmin tools and company–university matching make scaling placements so much easier.",
    name: "Neha Gupta",
    role: "Placement Coordinator, Regional College Network",
    rating: 5,
  },
];

export function LandingTestimonialsSection() {
  return (
    <section className="w-full bg-muted/30 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-extrabold text-foreground md:text-3xl">
          What people say about UniIntern
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Students, companies, and universities trust us to bridge talent and opportunity.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="relative rounded-2xl border bg-card p-6 shadow-sm"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/20" aria-hidden />
              <div className="mb-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 shrink-0 ${
                      i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="text-base leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 flex flex-col border-t pt-4">
                <cite className="not-italic font-semibold text-foreground">
                  {t.name}
                </cite>
                <span className="text-sm text-muted-foreground">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
