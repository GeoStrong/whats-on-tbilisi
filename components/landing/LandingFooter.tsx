import React from "react";

const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-background-dark py-12 px-6">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between gap-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined font-bold text-sm">
                explore
              </span>
            </div>
            <h2 className="text-lg font-extrabold tracking-tight">
              ActivityQuest
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connecting urban adventurers with the soul of their city through
            local experiences and hidden gems.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                >
                  Trust &amp; Safety
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 text-center text-xs text-gray-400">
        © 2024 ActivityQuest Inc. All rights reserved. Made for explorers.
      </div>
    </footer>
  );
};

export default LandingFooter;
