(function () {
  var bg = document.getElementById("bg"),
    mn = document.getElementById("menu");
  bg.onclick = function () {
    var o = mn.classList.toggle("open");
    bg.setAttribute("aria-expanded", o);
  };
  mn.onclick = function (e) {
    if (e.target.tagName === "A") mn.classList.remove("open");
  };
  var els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  } else
    els.forEach(function (el) {
      el.classList.add("in");
    });
  document.querySelectorAll("img").forEach(function (i) {
    i.onerror = function () {
      i.style.visibility = "hidden";
    };
  });
  var px = [].slice.call(document.querySelectorAll("[data-speed]")),
    tk = false;
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  function upd() {
    tk = false;
    var h = innerHeight;
    px.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      el.style.transform =
        "translate3d(0," +
        ((r.top + r.height / 2 - h / 2) * el.dataset.speed * -1).toFixed(1) +
        "px,0)";
    });
  }
  if (!rm) {
    addEventListener(
      "scroll",
      function () {
        if (!tk) {
          tk = true;
          requestAnimationFrame(upd);
        }
      },
      { passive: true },
    );
    upd();
  }
  var f = document.getElementById("f"),
    msg = document.getElementById("msg");
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (document.getElementById("hp").value) return;
    var n = document.getElementById("n").value.trim(),
      p = document.getElementById("p").value.trim();
    if (n.length < 2 || !/^[0-9+ ]{10,14}$/.test(p)) {
      msg.style.color = "#a33";
      msg.textContent = "Please enter your name and a valid phone number.";
      return;
    }
    var t =
      "Hello, I am " +
      n +
      " (" +
      p +
      "). Pet: " +
      document.getElementById("t").value +
      ". Service: " +
      document.getElementById("s").value +
      ". " +
      document.getElementById("m").value.trim();
    msg.style.color = "#173F35";
    msg.textContent = "Opening WhatsApp to send your enquiry...";
    window.open(
      "https://wa.me/919413604850?text=" + encodeURIComponent(t),
      "_blank",
      "noopener",
    );
    if (window.dataLayer) dataLayer.push({ event: "form_submit" });
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-ev]");
    if (a && window.dataLayer)
      dataLayer.push({ event: a.dataset.ev + "_click" });
  });
})();
