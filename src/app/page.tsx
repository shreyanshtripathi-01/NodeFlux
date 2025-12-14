"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { TrueFocus } from "@/components/react-bits/TrueFocus";
import { BlurText } from "@/components/react-bits/BlurText";
import { ScrollStack } from "@/components/react-bits/ScrollStack";
import CustomCursor from "@/components/CustomCursor";
import FlowField from "@/components/FlowField";
import { createClient } from "@/utils/supabase/client";
import { ChevronRight, ArrowUp } from "lucide-react";

const featureCards = [
  {
    title: "Connect nodes visually",
    body: "Drag nodes onto the canvas and wire them together.",
  },
  {
    title: "Chain AI, APIs, and logic",
    body: "Pass output from one node into the next. Mix LLM calls, HTTP requests, and JavaScript transforms in a single flow.",
  },
  {
    title: "Save and reuse workflows",
    body: "Every workflow is stored. Open it, edit it, run it again whenever.",
  },
];

const steps = [
  {
    num: "01.",
    title: "Create a workflow",
    body: "Start fresh from the dashboard.",
  },
  {
    num: "02. ",
    title: "Add and connect nodes",
    body: "Drop nodes on the canvas, wire them up, configure each one.",
  },
  {
    num: "03.",
    title: "Run it",
    body: "Click run, see the output of every node.",
  },
];

const faqItems = [
  {
    q: "What is NodeFlux?",
    a: "A visual builder for AI workflows. Connect nodes that represent AI calls, API requests, and data transforms. Run the whole thing on demand.",
  },
  {
    q: "What can I build with it?",
    a: "Anything that chains an LLM with external data. Summarize articles. Tag emails. Generate reports from API data. Build agent loops.",
  },
  {
    q: "Do I need to know coding?",
    a: "Basic JavaScript helps for transform nodes. The rest is drag and drop.",
  },
  {
    q: "What AI models are supported?",
    a: "Gemini Flash right now. More coming.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ email: u.email!, name: u.user_metadata?.name });
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setShowBackToTop(window.scrollY > window.innerHeight * 0.6);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onPointer = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      parallaxRef.current = { x, y };

      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
      }
      if (ctaRef.current) {
        ctaRef.current.style.transform = `translate(${x * -3}px, ${y * -3}px)`;
      }
    };

    hero.addEventListener("pointermove", onPointer, { passive: true });
    return () => hero.removeEventListener("pointermove", onPointer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary-text transition-colors duration-200 cursor-none">
      <CustomCursor />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-border-custom">
        <div className="h-full bg-foreground transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      {/* Back to top */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={showBackToTop ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full border-2 border-black bg-background flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
      >
        <ArrowUp size={18} />
      </motion.button>

      {/* Header */}
      <header className={`sticky top-4 z-50 mx-auto w-full max-w-[1200px] h-16 flex items-center justify-between px-8 backdrop-blur-2xl rounded-full border-2 border-black transition-all duration-300 ${scrolled ? "bg-background/30" : "bg-background/5"}`}>
        <div className="w-full flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.name && <span className="text-sm font-semibold text-primary-text">{user.name}</span>}
                <Link
                  href="/workflows"
                  className="bg-foreground text-background px-6 py-2 text-[15px] font-semibold rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[15px] font-semibold text-secondary-text hover:text-primary-text px-4 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-foreground text-background px-6 py-2 text-[15px] font-semibold rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="-mt-[72px] h-screen relative flex flex-col items-center justify-center text-center px-6"
      >
        <FlowField />
        <div className="w-full max-w-[880px] flex flex-col items-center relative z-10">
          <div ref={headlineRef} className="transition-transform duration-200 ease-out">
            <h1 className="text-[48px] md:text-[72px] font-display font-bold tracking-[-0.03em] leading-[1.05] text-primary-text mb-6">
              <TrueFocus
                sentence="Build AI workflows on a canvas."
                blurAmount={5}
                borderColor="#000000"
                glowColor="rgba(0,0,0,0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={1}
              />
            </h1>
          </div>

          <BlurText
            text="Drag nodes. Wire them. Run them."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-xl md:text-2xl text-secondary-text mb-8 font-sans"
          />

          <div ref={ctaRef} className="flex items-center gap-4 transition-transform duration-200 ease-out">
            <Link
              href={user ? "/workflows" : "/register"}
              className="px-6 py-3 bg-foreground text-background text-sm font-semibold rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle"
            >
              Start Building
            </Link>
            {user ? (
              <Link
                href="/workflows"
                className="px-6 py-3 border border-foreground bg-background hover:bg-surface-hover text-primary-text text-sm font-semibold rounded-full transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-3 border border-foreground bg-background hover:bg-surface-hover text-primary-text text-sm font-semibold rounded-full transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>


      </section>


      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="py-20 px-6 border-t border-border-custom bg-surface-custom flex flex-col items-center"
      >
        <div className="w-full max-w-[1200px] flex flex-col items-center">
          <h2 className="font-display font-semibold text-3xl md:text-[48px] leading-tight text-primary-text mb-4">
            Three things it does well.
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
              className="block h-[3px] bg-foreground mt-3"
            />
          </h2>
          <div className="h-5" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1000px]"
          >
            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative bg-background border border-border-custom rounded-lg p-8 shadow-subtle flex flex-col gap-3 hover:border-foreground hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
              >
                <span className="absolute left-0 top-1/2 w-[3px] h-0 bg-foreground rounded-r transition-all duration-300 -translate-y-1/2 group-hover:h-3/4" />
                <span className="flex items-center gap-2 font-mono text-xs text-muted-text uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 transition-colors duration-300 group-hover:bg-foreground" />
                  Feature 0{idx + 1}
                </span>
                <h3 className="font-display font-semibold text-[24px] text-primary-text">
                  {card.title}
                </h3>
                <p className="text-[15px] text-secondary-text leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="py-20 px-6 border-t border-border-custom bg-background flex flex-col items-center"
      >
        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24">
            <h2 className="font-display font-semibold text-3xl md:text-[48px] text-primary-text mb-4">
              How it works.
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
                className="block h-[3px] bg-foreground mt-3"
              />
            </h2>
            <div className="h-5" />
          </div>
          <div>
            <ScrollStack steps={steps} />
          </div>
        </div>
      </motion.section>

      {/* Editor Preview Section */}
      <motion.section
        id="preview"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="py-20 px-6 border-t border-border-custom bg-background flex flex-col items-center"
      >
        <div className="w-full max-w-[1100px] flex flex-col items-center">
          <h2 className="font-display font-semibold text-3xl md:text-[48px] text-primary-text mb-4">
            See it work.
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
              className="block h-[3px] bg-foreground mt-3"
            />
          </h2>
          <div className="h-8" />

          <div className="w-full border border-border-custom bg-background rounded-lg shadow-subtle overflow-hidden flex flex-col">
            <div className="h-10 border-b border-border-custom bg-surface-custom px-4 flex items-center gap-6 justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-border-custom"></span>
                <span className="w-3 h-3 rounded-full bg-border-custom"></span>
                <span className="w-3 h-3 rounded-full bg-border-custom"></span>
              </div>
              <span className="font-mono text-xs text-secondary-text">sentiment-classifier.flow</span>
              <div className="w-16"></div>
            </div>

            <div ref={previewRef} className="flex h-[450px]">
              <div className="w-48 border-r border-border-custom bg-surface-custom p-4 flex flex-col gap-2">
                <span className="font-mono text-[10px] text-muted-text uppercase tracking-widest block mb-2">NODES</span>
                {["Input", "Prompt", "HTTP", "Transform", "Output"].map((name) => (
                  <div key={name} className="flex items-center gap-2 border border-border-custom bg-background p-2 rounded-md text-xs font-semibold select-none cursor-grab">
                    <span className="w-3.5 h-3.5 rounded-sm bg-border-custom"></span>
                    {name}
                  </div>
                ))}
              </div>

              <div className="flex-1 relative p-6 bg-background/50 flex items-center justify-between">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 120 200 L 220 200" stroke="#737373" strokeWidth="1.5" fill="none" strokeDasharray="100" strokeDashoffset="100" className="line-draw" />
                  <path d="M 380 200 L 480 200" stroke="#737373" strokeWidth="1.5" fill="none" strokeDasharray="100" strokeDashoffset="100" className="line-draw" />
                  <path d="M 640 200 L 740 200" stroke="#737373" strokeWidth="1.5" fill="none" strokeDasharray="100" strokeDashoffset="100" className="line-draw" />
                </svg>
                <style>{`
                  @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                  }
                  .line-draw {
                    animation: drawLine 1s ease-out forwards;
                    animation-play-state: paused;
                  }
                  #preview.in-view .line-draw {
                    animation-play-state: running;
                  }
                `}</style>

                <div className="z-10 w-40 border border-border-custom bg-background rounded-lg shadow-subtle p-3 text-xs">
                  <div className="border-b border-border-custom pb-1.5 mb-2 font-mono text-[10px] text-muted-text">INPUT</div>
                  <p className="font-semibold">User Input</p>
                </div>

                <div className="z-10 w-40 border border-border-custom bg-background rounded-lg shadow-subtle p-3 text-xs border-foreground animate-pulse-subtle">
                  <div className="border-b border-border-custom pb-1.5 mb-2 font-mono text-[10px] text-primary-text">PROMPT</div>
                  <p className="font-semibold">Gemini Flash</p>
                </div>

                <div className="z-10 w-40 border border-border-custom bg-background rounded-lg shadow-subtle p-3 text-xs">
                  <div className="border-b border-border-custom pb-1.5 mb-2 font-mono text-[10px] text-muted-text">TRANSFORM</div>
                  <p className="font-semibold">JavaScript</p>
                </div>

                <div className="z-10 w-40 border border-border-custom bg-background rounded-lg shadow-subtle p-3 text-xs">
                  <div className="border-b border-border-custom pb-1.5 mb-2 font-mono text-[10px] text-muted-text">OUTPUT</div>
                  <p className="font-semibold">Response</p>
                </div>
              </div>

              <div className="w-64 border-l border-border-custom bg-surface-custom p-4 flex flex-col gap-3">
                <span className="font-mono text-[10px] text-muted-text uppercase tracking-widest block">PROPERTIES</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-secondary-text">Node Name</label>
                  <input type="text" readOnly className="border border-border-custom bg-background text-xs px-2 py-1.5 rounded-md focus:outline-none" value="Gemini Flash" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-secondary-text">System Prompt</label>
                  <textarea readOnly className="border border-border-custom bg-background text-xs px-2 py-1.5 rounded-md h-24 font-mono focus:outline-none resize-none" value="Classify ticket..." />
                </div>
              </div>
            </div>
          </div>

          <span className="mt-6 font-mono text-[13px] text-muted-text text-center block">
            Editor — drag, connect, run.
          </span>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="py-20 px-6 border-t border-border-custom bg-surface-custom flex flex-col items-center"
      >
        <div className="w-full max-w-[800px]">
          <h2 className="font-display font-semibold text-3xl md:text-[48px] text-primary-text mb-4">
            Questions.
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
              className="block h-[3px] bg-foreground mt-3"
            />
          </h2>
          <div className="h-5" />
          <div className="flex flex-col border-t border-border-custom">
            {faqItems.map((item, idx) => (
              <details key={idx} className="group py-6 border-b border-border-custom">
                <summary className="font-semibold text-base cursor-pointer list-none flex justify-between items-center select-none hover:text-primary-text transition-colors">
                  <span>{item.q}</span>
                  <ChevronRight size={18} className="group-open:rotate-90 transition-transform text-muted-text" />
                </summary>
                <p className="text-sm text-secondary-text mt-3 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border-custom py-12 px-6 bg-background">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-[-0.02em]">/nodeflux.</span>
            <span className="text-secondary-text text-sm">Built by Shreyansh.</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-secondary-text">
            <a href="https://www.linkedin.com/in/shreyanshtripathi" className="hover:text-primary-text transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="text-border-custom">·</span>
            <a href="https://github.com/shreyanshtripathi-01" className="hover:text-primary-text transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="text-border-custom">·</span>
            <a href="https://shreyansh-tripathi.vercel.app" className="hover:text-primary-text transition-colors" target="_blank" rel="noopener noreferrer">Portfolio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}