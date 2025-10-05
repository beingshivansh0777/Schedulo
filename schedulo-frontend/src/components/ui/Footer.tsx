import React from "react";
import { Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-200 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Logo & Info */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-600">Schedulo</h2>
          <p className="mt-2 text-sm text-gray-400">
            Streamline your scheduling process and made it simple.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-sky-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sky-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sky-400 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sky-400 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-sky-400 transition"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-sky-400 transition"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <Link
              href="https://github.com/mukundsolanki/Schedulo"
              legacyBehavior
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-sky-400 transition"
              >
                <Github className="w-6 h-6" />
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center mt-8 pt-3 border-t border-slate-700 text-sm text-gray-400">
        © {year} Schedulo. MIT Licensed. Hello All Rights Reserved.
        <p className="mt-4">
          Fork it! , improve it! , and Help Us Grow Together.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
