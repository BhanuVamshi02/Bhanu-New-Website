const state = { data: null, roles: [], skills: {} };
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
async function loadData() {
  try {
    state.data = await fetch("data/content.json").then((r) => r.json());
    state.roles = state.data.professional.roles;
    state.skills = state.data.professional.skills;
  } catch (e) {
    console.warn("Using inline fallback", e);
  }
}
function initPreloader() {
  const lines = [
    "Initializing human.exe...",
    "Loading creativity...",
    "Loading questionable ideas...",
    "Loading coffee...",
    "Coffee not found.",
    "Continuing anyway.",
    "Human detected.",
  ];
  let i = 0;
  const el = $("#loaderLine");
  const timer = setInterval(() => {
    i++;
    if (i < lines.length) el.textContent = lines[i];
    else {
      clearInterval(timer);
      gsap.to("#preloader", {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut",
        delay: 0.2,
      });
    }
  }, 170);
  setTimeout(() => {
    clearInterval(timer);
    gsap.to("#preloader", {
      yPercent: -100,
      duration: 0.7,
      ease: "power4.inOut",
    });
  }, 1700);
}
function initMenu() {
  const panel = $("#menuPanel"),
    btn = $("#menuBtn");
  const toggle = () => {
    const open = !panel.classList.contains("open");
    panel.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    panel.setAttribute("aria-hidden", !open);
  };
  btn.addEventListener("click", toggle);
  $$("[data-menu]").forEach((a) =>
    a.addEventListener("click", () => {
      if (panel.classList.contains("open")) toggle();
    }),
  );
}
function initCursor() {
  if (matchMedia("(pointer:fine)").matches) {
    const c = $(".cursor");
    addEventListener("pointermove", (e) => {
      c.style.left = e.clientX + "px";
      c.style.top = e.clientY + "px";
    });
    $$("a,button,.magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => c.classList.add("active"));
      el.addEventListener("mouseleave", () => c.classList.remove("active"));
    });
  }
}
function initScroll() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils
    .toArray(".reveal")
    .forEach((el) =>
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      }),
    );
  gsap.utils
    .toArray(".quest-art,.world-art,.portrait-placeholder")
    .forEach((el) =>
      gsap.from(el, {
        y: 35,
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      }),
    );
  gsap.to(".chapter-progress i", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
    },
  });
  const labels = [
    ["hero", "PROLOGUE"],
    ["protagonist", "01 / PROTAGONIST"],
    ["quests", "02 / QUEST LOG"],
    ["cinema", "03 / CINEMA"],
    ["system", "04 / SYSTEM MODE"],
    ["origin", "05 / ORIGIN STORY"],
    ["other", "06 / OTHER ME"],
    ["next", "07 / NEXT QUEST"],
  ];
  labels.forEach(([id, label]) =>
    ScrollTrigger.create({
      trigger: "#" + id,
      start: "top 55%",
      end: "bottom 45%",
      onEnter: () => ($("#chapterLabel").textContent = label),
      onEnterBack: () => ($("#chapterLabel").textContent = label),
    }),
  );
}
function renderRoles() {
  const first = state.roles[0];
  setRole(0);
  $$(".role-tab").forEach((btn) =>
    btn.addEventListener("click", () => setRole(+btn.dataset.role)),
  );
  function setRole(i) {
    const r = state.roles[i];
    if (!r) return;
    $("#rolePeriod").textContent = r.period.toUpperCase();
    $("#roleTone").textContent = r.tone.toUpperCase() + " ARC";
    $("#roleTitle").textContent = r.title;
    $("#roleDescription").textContent = r.description;
    $("#roleHighlights").innerHTML = r.highlights
      .map((x) => `<span>${x}</span>`)
      .join("");
    $$(".role-tab").forEach((b) =>
      b.classList.toggle("active", +b.dataset.role === i),
    );
  }
}
function renderSkills() {
  const paint = (k) => {
    $("#skillItems").innerHTML = (state.skills[k] || [])
      .map((x) => `<span>${x}</span>`)
      .join("");
  };
  paint("ServiceNow");
  $$(".skill-tab").forEach((b) =>
    b.addEventListener("click", () => {
      paint(b.dataset.skill);
      $$(".skill-tab").forEach((x) => x.classList.toggle("active", x === b));
    }),
  );
}

function initTrailer() {
  const panel = $("#trailerPanel");
  const playButton = $("#playTrailer");

  playButton.addEventListener("click", () => {
    if (
      state.data?.creative?.trailerUrl &&
      state.data.creative.trailerUrl !== "[TRAILER URL]"
    ) {
      const url = state.data.creative.trailerUrl;

      panel.innerHTML = `
        <div class="trailer-frame">
          <iframe
            src="${url}"
            title="Bhanu Vamshi — AI Cinema Trailer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
      `;

      panel.classList.add("show");
    } else {
      panel.innerHTML = `
        <div>
          <span>TRAILER SOURCE</span>
          <strong>TRAILER NOT CONFIGURED</strong>
          <small>Add a YouTube embed URL to data/content.json.</small>
        </div>
      `;

      panel.classList.add("show");
    }
  });

  $("#againBtn").addEventListener("click", () => {
    location.hash = "cinema";

    setTimeout(() => {
      $("#playTrailer").click();
    }, 500);
  });
}

function initEggs() {
  let seq = [],
    code = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
    ];
  addEventListener("keydown", (e) => {
    seq.push(e.key);
    seq = seq.slice(-code.length);
    if (seq.join(",") === code.join(",")) {
      alert("CHEAT CODE UNLOCKED. You found the side quest. ✦");
    }
  });
  let coffee = 0;
  document.querySelector(".brand").addEventListener("click", () => {
    coffee++;
    if (coffee === 5) alert("Okay. We get it. You like coffee. ☕");
  });
}
function initYear() {
  $("#year").textContent = new Date().getFullYear();
}
(async function () {
  await loadData();
  initPreloader();
  initMenu();
  initCursor();
  if (window.gsap) initScroll();
  renderRoles();
  renderSkills();
  initTrailer();
  initEggs();
  initYear();
})();
