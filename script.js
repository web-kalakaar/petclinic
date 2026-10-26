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

  /* Testimonial carousel */
  var car = document.getElementById("car");
  if (car) {
    var track = document.getElementById("track"),
      slides = track.children,
      n = slides.length,
      dotsEl = document.getElementById("dots"),
      cnt = document.getElementById("count"),
      prog = document.getElementById("prog"),
      cur = 0,
      timer = null,
      DUR = 6000,
      hold = false,
      sx = null;
    car.style.setProperty("--dur", DUR + "ms");
    var dots = [];
    for (var i = 0; i < n; i++) {
      (function (k) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Show testimonial " + (k + 1));
        b.onclick = function () {
          go(k, true);
        };
        dotsEl.appendChild(b);
        dots.push(b);
      })(i);
    }
    function pad(x) {
      return (x < 10 ? "0" : "") + x;
    }
    function runBar() {
      prog.classList.remove("run");
      void prog.offsetWidth;
      if (!rm) prog.classList.add("run");
    }
    function show(k) {
      cur = (k + n) % n;
      track.style.transform = "translateX(-" + cur * 100 + "%)";
      for (var i = 0; i < n; i++) {
        dots[i].classList.toggle("on", i === cur);
        dots[i].setAttribute("aria-selected", i === cur);
        slides[i].setAttribute("aria-hidden", i !== cur);
      }
      cnt.textContent = pad(cur + 1) + " / " + pad(n);
    }
    function schedule() {
      clearTimeout(timer);
      if (rm || hold) return;
      runBar();
      timer = setTimeout(function () {
        go(cur + 1);
      }, DUR);
    }
    function go(k, manual) {
      show(k);
      schedule();
    }
    function pause() {
      hold = true;
      clearTimeout(timer);
      car.classList.add("paused");
    }
    function resume() {
      hold = false;
      car.classList.remove("paused");
      schedule();
    }
    document.getElementById("prev").onclick = function () {
      go(cur - 1, true);
    };
    document.getElementById("next").onclick = function () {
      go(cur + 1, true);
    };
    car.addEventListener("mouseenter", pause);
    car.addEventListener("mouseleave", resume);
    car.addEventListener("focusin", pause);
    car.addEventListener("focusout", resume);
    car.addEventListener(
      "touchstart",
      function (e) {
        sx = e.touches[0].clientX;
      },
      { passive: true },
    );
    car.addEventListener(
      "touchend",
      function (e) {
        if (sx === null) return;
        var d = e.changedTouches[0].clientX - sx;
        sx = null;
        if (Math.abs(d) > 40) go(cur + (d < 0 ? 1 : -1), true);
      },
      { passive: true },
    );
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") go(cur + 1, true);
      if (e.key === "ArrowLeft") go(cur - 1, true);
    });
    document.addEventListener("visibilitychange", function () {
      document.hidden ? pause() : resume();
    });
    show(0);
    schedule();
  }
})();
