import React from "react";

const LandingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-3">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-bold">explore</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            ActivityQuest
          </h2>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <a
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="#"
          >
            Feed
          </a>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="#"
          >
            Map
          </a>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors"
            href="#"
          >
            Categories
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">
              add_circle
            </span>
            <span>Post Activity</span>
          </button>
          <div
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 bg-gray-200"
            data-alt="User profile avatar close up photo"
          >
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzKOB8ub4HWmnT1EeuxSgrlNeYl6n5k7B08zBrqLuj1YJnsWFo1RFE3TnhJWEJFvmRVJR6bJO2KYXCn7hwowQ4osv59gov_f68iDLls5r3Q9uYrx_Fj360pJdSgVrlRuyxs92ry3PAhhNksm5D-tKZHQlodLdEIEkAtFL1J173IqE4iFJTPlJ8A1BC4lj2K9JC1EynWdARCYHdSd-HGKH2b8BKtgOm1QsjOtQZiFajVXODrlvFU0KV_ya7fp-ft6lWIS5M2bQ_8uk"
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
