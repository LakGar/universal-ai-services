"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/ui/stacked-circular-footer";
import { ContactModal } from "@/components/contact-modal";
import { useContact } from "@/contexts/contact-context";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import { AuroraBackground } from "@/components/ui/aurora-background";

const leadership = [
  {
    name: "Fernando Lorenzo",
    title: "Managing Director",
    education:
      "Master's (A.L.M.) in Data Analytics & Computation, Harvard University",
    bio: "Expert in data analytics and computation with consulting experience across 28+ industries, guiding organizations on strategy, transformation, and measurable impact.",
    linkedin: "https://linkedin.com/in/fernandofromsf",
    image:
      "https://images.squarespace-cdn.com/content/v1/68c3b30180e4d46760cbd2a5/8b23481f-a1b7-4861-b533-a5638e7748eb/FernandoFamily-5444.jpg?format=1500w",
  },
  {
    name: "Benjamin Shlemis",
    title: "Managing Partner",
    education:
      "Master's in Technology Management, UC Santa Barbara College of Engineering",
    bio: "Leader in digital transformation and AI with experience across aerospace, advanced materials, construction, and mobility. Advises organizations on redefining operations and driving performance through the strategic use of AI and technology.",
    linkedin: "https://www.linkedin.com/in/benjaminshlemis/",
    image:
      "https://images.squarespace-cdn.com/content/v1/68c3b30180e4d46760cbd2a5/1757655809946-QNTWZJR9CODVJY3Y3LK6/IMG_2455.jpg?format=1000w",
  },
  {
    name: "Chibuike Uwakwe",
    title: "Senior Corporate Advisor",
    education: "PhD/MD in Bioengineering, Stanford",
    bio: "Harvard- and Stanford-trained expert in biomedical engineering and AI applications in healthcare and life sciences. Combines advanced research and cross-industry consulting experience to advise organizations on harnessing deep science and emerging technologies to drive large-scale innovation and digital transformation.",
    linkedin: "https://www.linkedin.com/in/chibuikeuwakwe/",
    image:
      "https://images.squarespace-cdn.com/content/v1/68c3b30180e4d46760cbd2a5/1757655809951-AHAGNH677MYBUTTCL28B/Screenshot+2025-09-11+at+2.44.14%E2%80%AFPM.png?format=1000w",
  },
  {
    name: "Vinoth Nandakumar",
    title: "Chief AI Scientist",
    education:
      "PhD in Mathematics, Massachusetts Institute of Technology (MIT)",
    bio: "Expert in machine learning, language models, and computer vision with over a decade of combined academic and industry experience. Formerly at Amazon Research and the Max Planck Institute, with multiple publications in top AI journals. Skilled in applying advanced algorithms to solve real-world problems across finance, retail, and technology.",
    linkedin: "https://www.linkedin.com/in/vinoth-nandakumar-07456b149/",
    image:
      "https://images.squarespace-cdn.com/content/v1/68c3b30180e4d46760cbd2a5/d4532f41-e43c-4914-88a9-add18f6e6a35/Screenshot+2025-09-24+at+11.14.51%E2%80%AFAM.png?format=750w",
  },
  {
    name: "Paula C. Brancato",
    title: "Senior Corporate Advisor",
    education: "MBA, CFP™, CLTC, CEPA, Harvard Business School",
    bio: "Expert in governance, risk management, and sustainable growth with extensive experience in value creation, financial strategy, and leadership across multiple industries. Formerly at Deloitte, Morgan Stanley, and Northwestern Mutual, with CEO and CFO experience in both private and public sectors. Serves as a mentor for the American Technology Venture Lab and leads the Harvard Club's Artificial Intelligence Special Interest Group.",
    linkedin: "https://www.linkedin.com/in/paulabrancato/",
    image:
      "https://images.squarespace-cdn.com/content/v1/68c3b30180e4d46760cbd2a5/e4006c52-c8a0-4147-a6e3-4122fa57a7c9/Screenshot+2025-10-25+at+3.51.47%E2%80%AFPM.png?format=1500w",
  },
  {
    name: "Mark Cheng",
    title: "Marketing Director",

    bio: "25+ Years of Experience in Business Marketing & Enterprise Partnerships, Leads global marketing strategy and partner engagement across vendors and manufacturing networks, supporting enterprise and international deployment of Physical AI and robotics systems.",
    linkedin:
      "https://media.licdn.com/dms/image/v2/D5603AQHtgYds7HuXcQ/profile-displayphoto-scale_200_200/B56ZuMhAzzKgAY-/0/1767589023633?e=1769040000&v=beta&t=XdjQtoQZnp7r8f7-k0H8kZ-tEzgsVZsXkXt6uYHZzH0",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQHtgYds7HuXcQ/profile-displayphoto-crop_800_800/B56ZuMhAzzKgAI-/0/1767589023556?e=1769040000&v=beta&t=JJRVLiOkL81VjTxoxjy6ZIv5inwwb4jdH_UuKSxViIM",
  },
];

export default function AboutPage() {
  const { isOpen, closeContact } = useContact();
  const description =
    "Universal AI Services is a AI & robotics consultancy that guides leaders through every stage of adoption with proven playbooks.";
  const mainImage = {
    src: "https://images.unsplash.com/photo-1581090121489-ff9b54bbee43?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvYm90aWNzfGVufDB8fDB8fHww",
    alt: "AI and Robotics Technology",
  };
  const secondaryImage = {
    src: "/about.jpg",
    alt: "Robotics Innovation",
  };
  const breakout = {
    title: "We believe AI is no longer optional.",
    description:
      "It has become the baseline for competitiveness, and companies that adopt it with speed and clarity will define the next decade.",
    buttonText: "Learn more",
    buttonUrl: "/services",
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />

      {/* Hero Section */}
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center px-4 py-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl md:text-center mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              About
            </span>{" "}
            Universal AI Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-black md:text-center md:text-lg dark:text-neutral-200 py-4 md:w-2/3 max-w-3xl"
          >
            {description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-black md:text-center text-base dark:text-neutral-300 md:w-2/3 max-w-3xl mt-4"
          >
            We operate as a consultancy, solutions partner, robotics
            marketplace, and lab, enabling organizations to deploy intelligent
            systems across events, public spaces, infrastructure, and
            operational environments of all kinds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 md:justify-center w-full mt-8 z-10"
          >
            <a
              className="bg-black dark:bg-white text-white dark:text-black border border-black/10 dark:border-white rounded-full w-fit px-6 py-3 font-medium hover:opacity-90 transition-opacity"
              href="#who-we-are"
            >
              Learn More
            </a>
            <a
              className="bg-white dark:bg-black border border-black/10 dark:border-white rounded-full w-fit text-black dark:text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
              href="#leadership"
            >
              Meet Our Team
            </a>
          </motion.div>
        </motion.div>
      </AuroraBackground>

      {/* About Section */}
      <section id="about" className="py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-7 lg:grid-cols-3">
            <motion.img
              src={mainImage.src}
              alt={mainImage.alt}
              className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
              <motion.div
                className="flex flex-col justify-between gap-2 rounded-xl bg-muted p-8 md:w-1/2 lg:w-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {breakout.title && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold leading-tight">
                      {breakout.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {breakout.description}
                    </p>
                  </div>
                )}
                {breakout.buttonText && breakout.buttonUrl && (
                  <Button variant="outline" className="mr-auto" asChild>
                    <a href={breakout.buttonUrl}>{breakout.buttonText}</a>
                  </Button>
                )}
              </motion.div>
              <motion.img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="who-we-are" className="py-32 ">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Who We Are</h2>

            {/* Overview */}
            <div className="mb-16 space-y-6 max-w-4xl">
              <h3 className="text-2xl font-semibold">Overview</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We operate as a consultancy, solutions partner, robotics
                marketplace, and lab, enabling organizations to deploy
                intelligent systems across events, public spaces,
                infrastructure, and operational environments of all kinds. Our
                work is industry-agnostic, applying the same underlying Physical
                AI capability to a wide range of use cases without rebuilding
                for each one.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through our marketplace, organizations can select, combine, and
                customize robot hardware, AI software, and add-ons in one place.
                Whether choosing off-the-shelf configurations or working with
                our team to design something custom, UAIS handles integration
                end-to-end so systems arrive ready to operate.
              </p>
            </div>

            {/* Leadership */}
            <div id="leadership" className="mb-16">
              <h3 className="text-2xl font-semibold mb-8">Our Leadership</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {leadership.map((leader, index) => (
                  <motion.div
                    key={leader.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-background rounded-xl overflow-hidden shadow-sm border border-border"
                  >
                    {leader.image && (
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold mb-1">
                            {leader.name}
                          </h4>
                          <p className="text-sm font-medium text-primary mb-2">
                            {leader.title}
                          </p>
                        </div>
                        {leader.linkedin && (
                          <a
                            href={leader.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 font-medium">
                        {leader.education}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {leader.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lab Section */}
            <div className="mb-16 space-y-6 max-w-4xl">
              <h3 className="text-2xl font-semibold">Our Lab</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our lab designs, builds, tests, and scales Physical AI systems
                from scratch. From concept and CAD through component sourcing,
                assembly, programming, and real world validation, we deliver
                complete systems and work with manufacturing partners to bring
                them into production.
              </p>
            </div>

            {/* Final Paragraph */}
            <div className="space-y-6 max-w-4xl">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our team brings experience across 30+ industries and has
                supported work with leading organizations including Apple,
                Google, NASA, Boeing, Raytheon, Lockheed Martin, Deloitte, and
                McKinsey. Founded by graduates of MIT, Harvard, Stanford, and
                other top institutions, we combine cross-industry insight with
                execution focused on real-world impact.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                By treating hardware, software, and environment as a single
                system, UAIS delivers Physical AI that moves across machines,
                adapts to new contexts, and scales across industries.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ContactModal isOpen={isOpen} onClose={closeContact} />
    </div>
  );
}
