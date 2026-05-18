/* ================================================================
   Lightweight lightbox — works on any .gallery-item img
   Click image to open, click backdrop/×/Escape to close,
   ← → arrow keys (or on-screen buttons) to navigate.
   ================================================================ */

(function () {
  // ── Build the lightbox DOM (once) ──────────────────────────────
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div id="lb-backdrop"></div>
    <button id="lb-close"  aria-label="Close">&#x2715;</button>
    <button id="lb-prev"   aria-label="Previous">&#x2039;</button>
    <button id="lb-next"   aria-label="Next">&#x203A;</button>
    <div id="lb-img-wrap">
      <img id="lb-img" src="" alt="" />
      <p id="lb-caption"></p>
    </div>
  `;
  document.body.appendChild(lb);

  const backdrop = document.getElementById('lb-backdrop');
  const closeBtn = document.getElementById('lb-close');
  const prevBtn  = document.getElementById('lb-prev');
  const nextBtn  = document.getElementById('lb-next');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-caption');

  let images = [];   // all gallery images on the page
  let current = 0;   // index of the open image

  // ── Collect all gallery images ──────────────────────────────────
  function collectImages() {
    images = Array.from(
      document.querySelectorAll('.gallery-item:not(.placeholder) img')
    );
  }

  // ── Open ────────────────────────────────────────────────────────
  function open(index) {
    current = index;
    const img = images[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateArrows();
  }

  // ── Close ───────────────────────────────────────────────────────
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  // ── Navigate ────────────────────────────────────────────────────
  function showPrev() { if (current > 0) open(current - 1); }
  function showNext() { if (current < images.length - 1) open(current + 1); }

  function updateArrows() {
    prevBtn.style.display = current === 0                  ? 'none' : '';
    nextBtn.style.display = current === images.length - 1 ? 'none' : '';
  }

  // ── Event listeners ─────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item:not(.placeholder)');
    if (item) {
      collectImages();
      const img = item.querySelector('img');
      const idx = images.indexOf(img);
      if (idx !== -1) open(idx);
    }
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); showPrev(); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); showNext(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
})();
