/* ===== DATA: edit here ===== */
const P = (title, category, n, tools) => ({
  title, year: "[TAHUN]", category, description: "[PROJECT DESCRIPTION]",
  image: `assets/projects/project-${n}.jpg`, tools, role: "[ROLE DALAM PROJECT]",
  problem: "[MASALAH YANG DISELESAIKAN]", solution: "[SOLUSI]", process: "[PROSES PENGERJAAN]",
  result: "[HASIL / OUTPUT]", github: "#", demo: "#"
});
const projects = [
  P("[PROJECT TITLE] 1", "Data", 1, ["Not yet"]),
  P("[PROJECT TITLE] 2", "Statistics", 2, ["Not yet"]),
  P("[PROJECT TITLE] 3", "Web", 3, ["HTML", "CSS", "JavaScript"])
];
const creative = [
  { t: "Graphic Design", src: "assets/creative/design-01.jpg" },
  { t: "Photography", src: "assets/creative/photo-01.jpg" },
  { t: "Video", src: "assets/creative/video-01.jpg" },
  { t: "Motion Graphics", src: "assets/creative/design-01.jpg" },
  { t: "Writing", src: "assets/creative/photo-01.jpg" }
];

/* ===== Helpers ===== */
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const safe = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch { return null; } };
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 3200); }
// Hide broken placeholder images so the gradient background shows instead
document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.style.display = "none"; }, true);

/* ===== Theme ===== */
const root = document.documentElement;
root.dataset.theme = safe("theme") || "dark";
$("#theme").onclick = () => { const n = root.dataset.theme === "dark" ? "light" : "dark"; root.dataset.theme = n; safe("theme", n); };

/* ===== Nav: mobile menu, scroll effect, active link ===== */
const menu = $("#menu"), burger = $("#burger");
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu"); };
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));
const secs = $$("main section[id]"), links = $$("#menu a");
function onScroll() {
  $("#nav").classList.toggle("scrolled", scrollY > 20);
  $("#top").classList.toggle("show", scrollY > 600);
  let cur = secs[0].id;
  secs.forEach(s => { if (scrollY + 140 >= s.offsetTop) cur = s.id; });
  if (cur === "achievements") cur = "experience";
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
$("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
$("#year").textContent = new Date().getFullYear();

/* ===== Scroll reveal ===== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1 });
$$(".reveal").forEach(el => io.observe(el));

/* ===== Projects: render, filter, modal ===== */
const grid = $("#projectGrid");
function renderProjects(f = "All") {
  grid.innerHTML = "";
  projects.forEach((p, i) => {
    if (f !== "All" && p.category !== f) return;
    const c = document.createElement("article");
    c.className = "glass card"; c.tabIndex = 0; c.setAttribute("role", "button"); c.setAttribute("aria-label", "Buka detail " + p.title); c.dataset.i = i;
    c.innerHTML = `<div class="thumb-wrap"><img src="${esc(p.image)}" alt="Thumbnail ${esc(p.title)}" loading="lazy"></div>
      <div class="card-body"><div class="meta"><span>${esc(p.category)}</span><span>${esc(p.year)}</span></div>
      <h3>${esc(p.title)}</h3><p class="muted">${esc(p.description)}</p>
      <div class="tags">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div></div>`;
    grid.appendChild(c);
  });
  if (!grid.children.length) grid.innerHTML = '<p class="muted">Belum ada project di kategori ini.</p>';
}
$$(".chip").forEach(b => b.onclick = () => { $$(".chip").forEach(x => x.classList.remove("active")); b.classList.add("active"); renderProjects(b.dataset.f); });
renderProjects();

let lastFocus;
function openModal(m, focusEl) { lastFocus = document.activeElement; m.hidden = false; document.body.style.overflow = "hidden"; focusEl.focus(); }
function closeModal(m) { m.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
function openProject(i) {
  const p = projects[i];
  $("#mBody").innerHTML = `<p class="muted">${esc(p.category)} · ${esc(p.year)}</p><h3 id="mTitle">${esc(p.title)}</h3>
    <h4>Problem</h4><p>${esc(p.problem)}</p><h4>Solution</h4><p>${esc(p.solution)}</p><h4>Process</h4><p>${esc(p.process)}</p>
    <h4>Tools</h4><div class="tags">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    <h4>Role</h4><p>${esc(p.role)}</p><h4>Result</h4><p>${esc(p.result)}</p>
    <div class="links"><a class="btn" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a><a class="btn primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Demo</a></div>`;
  openModal($("#modal"), $("#mClose"));
}
grid.addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openProject(c.dataset.i); });
grid.addEventListener("keydown", e => { const c = e.target.closest(".card"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(c.dataset.i); } });

/* ===== Creative gallery + lightbox ===== */
const gal = $("#gallery");
creative.forEach((c, i) => {
  const d = document.createElement("div");
  d.className = "g-item"; d.tabIndex = 0; d.setAttribute("role", "button"); d.setAttribute("aria-label", "Perbesar " + c.t); d.dataset.i = i;
  d.innerHTML = `<img src="${esc(c.src)}" alt="${esc(c.t)}" loading="lazy"><span>${esc(c.t)}</span>`;
  d.style.minHeight = [180, 240, 160, 220, 190][i % 5] + "px";
  gal.appendChild(d);
});
function openLight(el) {
  const img = $("img", el); $("#lImg").src = img.src; $("#lImg").alt = img.alt; $("#lCap").textContent = img.alt;
  openModal($("#lightbox"), $("#lClose"));
}
gal.addEventListener("click", e => { const g = e.target.closest(".g-item"); if (g) openLight(g); });
gal.addEventListener("keydown", e => { const g = e.target.closest(".g-item"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLight(g); } });

/* ===== Close handlers: X, outside click, Escape ===== */
[["#modal", "#mClose"], ["#lightbox", "#lClose"]].forEach(([m, b]) => {
  const el = $(m);
  $(b).onclick = () => closeModal(el);
  el.addEventListener("click", e => { if (e.target === el) closeModal(el); });
});
addEventListener("keydown", e => { if (e.key === "Escape") $$(".modal").forEach(m => { if (!m.hidden) closeModal(m); }); });

/* ===== Contact form: validation + mailto ===== */
const form = $("#form");
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  $$("input,textarea", form).forEach(f => {
    const err = f.closest("label").nextElementSibling; let m = "";
    if (!f.value.trim()) m = "Kolom ini wajib diisi.";
    else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) m = "Format email belum benar.";
    err.textContent = m; f.setAttribute("aria-invalid", !!m); if (m) ok = false;
  });
  if (!ok) return toast("Periksa kembali isian form.");
  const d = new FormData(form);
  const body = `${d.get("message")}\n\nDari: ${d.get("name")} (${d.get("email")})`;
  location.href = `mailto:adnannurr8@gmail.com?subject=${encodeURIComponent(d.get("subject"))}&body=${encodeURIComponent(body)}`;
  toast("Membuka aplikasi email Anda…"); form.reset();
});
