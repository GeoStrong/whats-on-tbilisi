import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1">
        <section className="relative px-6 py-12 md:py-20 lg:px-10">
          <div className="mx-auto max-w-[1200px] text-center">
            <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
              Discover Your <span className="text-primary">Next Adventure</span>
            </h1>
            <p className="mb-12 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with locals through unique workshops, urban tours, and
              hidden gems in your neighborhood.
            </p>
            <div className="mx-auto max-w-4xl rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-soft-float border border-gray-100 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex w-full items-center px-4 py-3 md:py-0">
                  <span className="material-symbols-outlined text-gray-400 mr-3">
                    search
                  </span>
                  <input
                    className="w-full border-none bg-transparent focus:ring-0 text-sm font-medium"
                    placeholder="What activity?"
                    type="text"
                  />
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-zinc-700"></div>
                <div className="flex w-full items-center px-4 py-3 md:py-0">
                  <span className="material-symbols-outlined text-gray-400 mr-3">
                    location_on
                  </span>
                  <input
                    className="w-full border-none bg-transparent focus:ring-0 text-sm font-medium"
                    placeholder="Where?"
                    type="text"
                  />
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-zinc-700"></div>
                <div className="flex w-full items-center px-4 py-3 md:py-0">
                  <span className="material-symbols-outlined text-gray-400 mr-3">
                    calendar_month
                  </span>
                  <input
                    className="w-full border-none bg-transparent focus:ring-0 text-sm font-medium"
                    placeholder="When?"
                    type="text"
                  />
                </div>
                <button className="w-full md:w-auto rounded-xl bg-primary px-8 py-4 text-sm font-bold transition-all hover:bg-opacity-90">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="px-6 py-4">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-6 py-2.5 text-sm font-bold text-primary">
                <span className="material-symbols-outlined text-lg">apps</span>
                All Activities
              </button>
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-2.5 text-sm font-medium hover:border-primary transition-all">
                <span className="material-symbols-outlined text-lg">
                  fitness_center
                </span>
                Sports
              </button>
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-2.5 text-sm font-medium hover:border-primary transition-all">
                <span className="material-symbols-outlined text-lg">
                  palette
                </span>
                Art
              </button>
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-2.5 text-sm font-medium hover:border-primary transition-all">
                <span className="material-symbols-outlined text-lg">
                  nightlife
                </span>
                Nightlife
              </button>
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-2.5 text-sm font-medium hover:border-primary transition-all">
                <span className="material-symbols-outlined text-lg">
                  restaurant
                </span>
                Food
              </button>
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-2.5 text-sm font-medium hover:border-primary transition-all">
                <span className="material-symbols-outlined text-lg">
                  handyman
                </span>
                Workshops
              </button>
              <button className="flex shrink-0 items-center gap-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-2.5 text-sm font-medium hover:border-primary transition-all">
                <span className="material-symbols-outlined text-lg">
                  music_note
                </span>
                Music
              </button>
            </div>
          </div>
        </section>
        <section className="px-6 py-10 lg:px-10">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-end justify-between mb-8 px-4">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                  Hot &amp; Trending
                </span>
                <h2 className="text-3xl font-bold tracking-tight">
                  Featured Activities
                </h2>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                View Map View
                <span className="material-symbols-outlined">map</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
              <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-soft-float transition-all hover:shadow-hover-float hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-zinc-800">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden"
                  data-alt="People doing yoga at sunset in a lush park"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5vipZZJm7sIWKgMwnCv8-aE8wVcfoQpJ43CVxKhOQpgSazYpX80vtoXTTlmj755PWfXV6w5lrjqMREwZ2P4hHPHSNV5_kwUqT0y0rH-Dh2PHBduYLUEOf7_D1sRcV0pET2Ambee9-8wciU6ek-8PPS66czCYTY-JZVOnJlnmxbMdLZjFIAUWxWn1i_XaP2TLQz3xglMKesTcpU4vUh5ron0jT_0jKvT6XuuNzprM-iSkFk4TFti9HXT-Hcst3BX9qfPwvnpLfATA')",
                    }}
                  ></div>
                  <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-zinc-900/90 p-2 shadow-sm">
                    <span className="material-symbols-outlined text-rose-500 fill-1">
                      favorite
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                    <span className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white shadow-lg">
                      NEW
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Health &amp; Wellness
                    </span>
                    <span className="text-lg font-black">$15</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                    Sunset Yoga Session
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="material-symbols-outlined text-sm">
                      event
                    </span>
                    <span>Oct 12, 6:00 PM</span>
                    <span className="mx-1">•</span>
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    <span>Greenwich Park</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full bg-gray-200"
                        data-alt="Small avatar of yoga instructor"
                      >
                        <img
                          className="rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuALErPDQOpQ6NHUi3YV_Iz2wePlogIYd_rB2ds3lNwJ6DCWiBur_qVjlWk47M57ZaQgyDlUHzHqTV2oWtmMP0ePfG9cwLjFZLF_AEW8lQpWofBFB8b3SgetJymq9fAnVa9sUBAgP_l4yEbh8WckKlt0OgR_GvynwgF45vGKiTrfovAMSvtlSlhgGbyMyqIMLw5doF9GmczsI2ustiUcRXIbN_gFqbslfXPWuMYEOsy-Aj8DjnLrV_S4WAaXrOiNcgk1zqUFMA_O-D0"
                          alt="Avatar"
                        />
                      </div>
                      <span className="text-xs font-medium">Sarah Jenkins</span>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary">
                      Details
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-soft-float transition-all hover:shadow-hover-float hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-zinc-800">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden"
                  data-alt="Vibrant street art in an urban alleyway tour"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBJcTl2N-_HX4o8srRG17el86Jzjn86UstZZYQLTsqla6dXxU--6kxYepf9hBOi3ga2hObDXnrn__91ndjmXOZ5U0iWU6VxToonaYWtrYQUkFM8zV9bDCUauNGCpi-wsfmR2bERA4YgYfNbKotttSejgq9AmD-pIkNGYZf0BvvrOQw5N8sZxir4GK2eDKJE5TS9Mp4TpkQGDophjabJ-yxXTfkAwWOxy0dpQgFPzCdRMugEu9docCzdK6HjDj6192_Eu1eey2dPaQ')",
                    }}
                  ></div>
                  <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-zinc-900/90 p-2 shadow-sm">
                    <span className="material-symbols-outlined text-gray-400">
                      favorite
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                    <span className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-[#111717] shadow-lg">
                      POPULAR
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Art &amp; Culture
                    </span>
                    <span className="text-lg font-black text-green-500">
                      Free
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                    Urban Street Art Tour
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="material-symbols-outlined text-sm">
                      event
                    </span>
                    <span>Oct 13, 2:00 PM</span>
                    <span className="mx-1">•</span>
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    <span>Downtown</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full bg-gray-200"
                        data-alt="Small avatar of local art guide"
                      >
                        <img
                          className="rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuFl8-FSmRpqsLQOp4xS7q5bLF6m7yLO_QCDPnzKch_jaN5D9KfmYlkaFvu8UpPNnj4PuLOouFy8zCQesr242bfIEBNCDCby3L7IQzOb356rbbgey7cPO0P_dF8IdQqRfSYkW9BdpRN6dDNTEWOQaRf_hHPLOmA_XnG9CLWSme5XSjtSAeCmVo9IKlycUgWk7TD8tCuh9_wm0Bz3lN5L2WfQp5g_BXAELp0Rs9xbS3PGLdILtKFNxR7ImyZTjl2wwAaWbwrWjde48"
                          alt="Avatar"
                        />
                      </div>
                      <span className="text-xs font-medium">Marc Russo</span>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary">
                      Details
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-soft-float transition-all hover:shadow-hover-float hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-zinc-800">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden"
                  data-alt="Dimly lit jazz club with musicians playing sax"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSsqggS1R3PsoFgBzvBa6lM9JvOhSwMJILzjqq41zS9itzA1J-RhAf95fs4V7dD7DhAZeuf9p-rQWFlXNKCkTZGd9tN3xu4dFIf8ZW6UJLheAurSTG3u6XFvn8l1vRitNW0BpyhnzYIOvQfj_6l6mieGSZ9AhOUkZE_iYRDbp5TpGLYDf2eX5MJgVlz1taO7m3oBIXQILw-nS6Q8LgGq65ZLHo8dQ2QK9cT9TS7qd01DnHSkK4cM-LllbARaI0oPmA_9woN6tmTNQ')",
                    }}
                  ></div>
                  <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-zinc-900/90 p-2 shadow-sm">
                    <span className="material-symbols-outlined text-gray-400">
                      favorite
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Entertainment
                    </span>
                    <span className="text-lg font-black">$25</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                    Local Jazz Night
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="material-symbols-outlined text-sm">
                      event
                    </span>
                    <span>Oct 13, 9:00 PM</span>
                    <span className="mx-1">•</span>
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    <span>Blue Note Club</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full bg-gray-200"
                        data-alt="Small avatar of club manager"
                      >
                        <img
                          className="rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZbEpVb_Z2X1Vi46WBx5lex0JIfQ-fbzcBJEFGk6vOYnYOnwyQxUfSxq0FWfXUDgxbhUzyder5XmT6wFLKEPBalzzTcr34EL46GwMFhf2t7Dpj67W4ZSO643naxZbrLSga6wyufcPePOUXun6SdIE7JLRBBVu7EFwIHCUnps1Su-HHLQEn7wjJwlpAJSlr4DhmryKLzn8KzOg2SunI3EPNzmbxtjdOSbGsvou34kPpvj8wZ0dDyeVMJCi-ws488oXs-d3_-yoQZz0"
                          alt="Avatar"
                        />
                      </div>
                      <span className="text-xs font-medium">Elena G.</span>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary">
                      Details
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-soft-float transition-all hover:shadow-hover-float hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-zinc-800">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden"
                  data-alt="Hands shaping clay on a pottery wheel"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6FtO-Egyipo5prheqoQDt6V4PYAX9ve2EOpdf_90Ad9gxJT2h1ajCVuIsAOKQ9LBlCOFa5ytFtX8UgewcR66Bz7US4I7AYQI7kfgVkkERdI99rE1dDsQkwzMj1WZ7Q7kfHoCTWtmbS3HMnCidKy23DgpsAY6CKLtYa2BHU1VCpx3z9CENoeA5SUcX8TfMWY704Elw6mkgO3L0Isv-UFRbtNDXMdhrpInfrxEoW3lmWOS4D_NYW1V7koo4quYLWfvVtDL2rI59PC0')",
                    }}
                  ></div>
                  <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-zinc-900/90 p-2 shadow-sm">
                    <span className="material-symbols-outlined text-gray-400">
                      favorite
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Workshop
                    </span>
                    <span className="text-lg font-black">$30</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                    Pottery Basics
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="material-symbols-outlined text-sm">
                      event
                    </span>
                    <span>Oct 15, 11:00 AM</span>
                    <span className="mx-1">•</span>
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    <span>Studio 42</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full bg-gray-200"
                        data-alt="Small avatar of pottery artist"
                      >
                        <img
                          className="rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9-mImAxir4ifkzYzWaU3HlDGvqGEzN5B-Cg6ZkMnqqttd6L2fFOvz8amiAezdS3erqzNSpPmifjB7GOqa47-63RRhAGwpUvBjxS3pAOoz15uQ3Q9dAKsDzmahzVNCTcMJkioZpjfHhjUl3UrDJyfHyJTO323ZFTHnx4qXBY2tIB6OfJ73HqhpntF6nSTzOU8vpx0wq08HTvDCgvnV6jjPuvoQBRb81NRRnbWMKM_wZMkzKHk3znKSLUj6izETDoStAGsqXu-GQ00"
                          alt="Avatar"
                        />
                      </div>
                      <span className="text-xs font-medium">Dave Potter</span>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20 overflow-hidden rounded-3xl bg-gray-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl">
              <div
                className="relative h-[400px] w-full"
                data-location="London"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFwpgimbFrUjervpvJ6j7PzUXbkXPd3mzespTOVq2g3Pf8TBvaBrUjSSdivh73iBSc_G-JbXzrEL1IsefdJAFhwwpNHxkTZDZGBFeLxZC_iGeFw5Msk0zRN2xDWRS7NdfQDd61PBbyqDVTjF5B73mSN7Dhuif3rvfyHUd7iB1LHreuHg9OzvJ7R0SAuhSLlTS2nMwbyOo9Vkm_d2ZHCDxCS0rTC5pJlSfziXGj_L4sDH6KC7p35qaJ1ImpziQ8NSOAvtJa1pUc_cI')",
                }}
              >
                <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 flex items-center justify-center opacity-40">
                  <span className="material-symbols-outlined text-9xl">
                    map
                  </span>
                </div>
                <div className="absolute top-[20%] left-[30%] group">
                  <div className="flex items-center justify-center size-10 bg-primary text-[#111717] rounded-full rounded-br-none rotate-45 shadow-lg cursor-pointer">
                    <span className="material-symbols-outlined -rotate-45 text-sm">
                      fitbit_yoga
                    </span>
                  </div>
                </div>
                <div className="absolute top-[45%] left-[60%] group">
                  <div className="flex items-center justify-center size-10 bg-accent text-white rounded-full rounded-br-none rotate-45 shadow-lg cursor-pointer">
                    <span className="material-symbols-outlined -rotate-45 text-sm">
                      palette
                    </span>
                  </div>
                </div>
                <div className="absolute top-[30%] left-[50%] group">
                  <div className="flex items-center justify-center size-10 bg-primary text-[#111717] rounded-full rounded-br-none rotate-45 shadow-lg cursor-pointer">
                    <span className="material-symbols-outlined -rotate-45 text-sm">
                      music_note
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Active Activities
                    </p>
                    <p className="text-2xl font-black">124</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>
                  <button className="rounded-xl bg-primary px-6 py-2 text-sm font-bold shadow-lg shadow-primary/20">
                    Expand Full Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default LandingPage;
