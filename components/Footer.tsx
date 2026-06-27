export default function Footer() {
  return (
    <footer
      className="py-6 text-center border-t border-black/10 dark:border-white/[0.06]"
    >
      <p className="mb-2 text-xs text-black/40 dark:text-white/30">
        © 2026 Ovais185 — Made with Love for the people of the internet.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs">
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 dark:text-white/50 transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
        >
          Privacy Notice
        </a>
        <span className="text-black/20 dark:text-white/20">|</span>
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 dark:text-white/50 transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
        >
          Terms &amp; Conditions
        </a>
        <span className="text-black/20 dark:text-white/20">|</span>
        <a
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/40 dark:text-white/50 transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
        >
          Contact Us
        </a>
      </div>
    </footer>
  );
}
