import { useState } from "react";
import { Link } from "react-router";

const Footer = () => {

  const currentYear = new Date().getFullYear();


  const columns = [
    {
      heading: "Navigate",
      links: [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Blogs", path: "/blogs" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "Careers", path: "/careers" },
        { label: "Press", path: "/press" },
        { label: "Contact", path: "/contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", path: "/privacy" },
        { label: "Terms", path: "/terms" },
        { label: "Cookies", path: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400">

      {/* Main Footer Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand Column — spans 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 no-underline w-fit">
              <div className="w-8 h-8 rounded-lg bg-white text-gray-900 flex items-center justify-center text-sm font-bold font-serif">
                N
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Nexus
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              A place to read, write, and deepen your understanding of the world around you.
            </p>

          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest m-0">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200 no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-600 m-0">
            © {currentYear} Nexus. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* X / Twitter */}
            <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;