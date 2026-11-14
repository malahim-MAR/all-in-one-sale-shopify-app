(function () {
  var bar = document.querySelector(".aios-bar");
  if (!bar) return;

  // move the bar to the very top of the page
  document.body.prepend(bar);

  var end = bar.dataset.end;
  var tz = bar.dataset.tz;
  var timerEl = bar.querySelector(".aios-bar__timer");
  if (!end || !timerEl) return;

  // "+0500" -> "+05:00"
  var offset = tz && tz.length === 5 ? tz.slice(0, 3) + ":" + tz.slice(3) : "Z";
  var endMs = new Date(end + ":00" + offset).getTime();

  if (isNaN(endMs)) {
    timerEl.remove();
    return;
  }

  var units = ["DAY", "HR", "MIN", "SEC"];

  // build the timer structure once
  timerEl.innerHTML = units
    .map(function (label, i) {
      var colon = i < units.length - 1 ? '<span class="aios-colon">:</span>' : "";
      return (
        '<div class="aios-unit">' +
          '<div class="aios-digits"></div>' +
          '<div class="aios-label">' + label + "</div>" +
        "</div>" +
        colon
      );
    })
    .join("");

  var digitEls = timerEl.querySelectorAll(".aios-digits");

  function setUnit(el, value) {
    var str = String(value).padStart(2, "0");
    var current = el.textContent.replace(/\s/g, "");
    if (current === str) return; // skip DOM update if unchanged
    el.innerHTML = str
      .split("")
      .map(function (ch) {
        return '<span class="aios-digit">' + ch + "</span>";
      })
      .join("");
  }

  var intervalId;

  function tick() {
    var diff = endMs - Date.now();
    if (diff <= 0) {
      clearInterval(intervalId);
      bar.style.animation = "none";
      bar.style.transition = "opacity 0.3s, transform 0.3s";
      bar.style.opacity = "0";
      bar.style.transform = "translateY(-100%)";
      setTimeout(function () { bar.remove(); }, 350);
      return;
    }
    setUnit(digitEls[0], Math.floor(diff / 86400000));
    setUnit(digitEls[1], Math.floor((diff % 86400000) / 3600000));
    setUnit(digitEls[2], Math.floor((diff % 3600000) / 60000));
    setUnit(digitEls[3], Math.floor((diff % 60000) / 1000));
  }

  tick();
  intervalId = setInterval(tick, 1000);
})();
