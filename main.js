let score = 0;
let rates = 0;
let partieEnCours = false;
let monChrono = null;
let tempsFin = 0;

const target = document.getElementById("target");

function bougerCible() {
  const difficulte = document.getElementById("difficulty").value;

  let taille = 60;

  if (difficulte === "Facile") {
    taille = 80;
  } else if (difficulte === "Difficile") {
    taille = 40;
  }

  const x = Math.floor(Math.random() * (500 - taille));
  const y = Math.floor(Math.random() * (500 - taille));

  target.style.width = taille + "px";
  target.style.height = taille + "px";
  target.style.left = x + "px";
  target.style.top = y + "px";
}

function lancerPartie() {
  score = 0;
  rates = 0;
  partieEnCours = true;

  const mode = document.getElementById("mode").value;
  const duree = parseInt(document.getElementById("duration").value, 10) || 10;

  document.getElementById("hud-score").textContent = "0";

  if (mode === "Classique") {
    document.getElementById("hud-misses").parentElement.style.display = "none";
    document.getElementById("hud-accuracy").parentElement.style.display = "none";
  } else {
    document.getElementById("hud-misses").parentElement.style.display = "inline";
    document.getElementById("hud-accuracy").parentElement.style.display = "inline";
    document.getElementById("hud-misses").textContent = "0";
    document.getElementById("hud-accuracy").textContent = "100%";
  }

  tempsFin = performance.now() + (duree * 1000);
  bougerCible();

  monChrono = setInterval(function () {
    const maintenant = performance.now();
    const tempsRestant = (tempsFin - maintenant) / 1000;

    if (maintenant >= tempsFin) {
      document.getElementById("hud-timer").textContent = "0.0";
      arreterPartie();
    } else {
      document.getElementById("hud-timer").textContent = tempsRestant.toFixed(1);
    }
  }, 50);
}

function arreterPartie() {
  if (!partieEnCours) return;
  partieEnCours = false;
  clearInterval(monChrono);

  const mode = document.getElementById("mode").value;
  const pseudo = document.getElementById("pseudo").value || "Joueur";

  document.getElementById("res-pseudo").textContent = pseudo;
  document.getElementById("res-score").textContent = score;

  const precisionContainer = document.getElementById("res-accuracy").parentElement;
  if (mode === "Classique") {
    precisionContainer.style.display = "none";
  } else {
    precisionContainer.style.display = "block";
    const totalTirs = score + rates;
    const calcul = totalTirs > 0 ? ((score / totalTirs) * 100).toFixed(1) + "%" : "0.0%";
    document.getElementById("res-accuracy").textContent = calcul;
  }

  const rateContainer = document.getElementById("res-rates").parentElement;
  if (mode === "Classique") {
    rateContainer.style.display = "none";
  } else {
    rateContainer.style.display = "block";
    document.getElementById("res-rates").textContent = rates;
  }

  document.getElementById("view-game").style.display = "none";
  document.getElementById("view-results").style.display = "block";
}

target.addEventListener("click", function (e) {
  e.stopPropagation();
  bougerCible();
});

document.getElementById("target").addEventListener("click", function (e) {
  e.stopPropagation();
  if (!partieEnCours || performance.now() > tempsFin) return;

  score = score + 1;
  document.getElementById("hud-score").textContent = score;
  bougerCible();
});

document.getElementById("arena").addEventListener("click", function () {
  if (!partieEnCours || performance.now() > tempsFin) return;

  const mode = document.getElementById("mode").value;

  if (mode === "Précision") {
    rates = rates + 1;
    document.getElementById("hud-misses").textContent = rates;

    const totalTirs = score + rates;
    const precision = ((score / totalTirs) * 100).toFixed(1);
    document.getElementById("hud-accuracy").textContent = precision + "%";
  }
});

document.getElementById("config-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("view-config").style.display = "none";
  document.getElementById("view-game").style.display = "block";

  lancerPartie();
});

document.addEventListener("DOMContentLoaded", () => {
  bougerCible();

  const viewHome = document.getElementById("view-home");
  const viewConfig = document.getElementById("view-config");
  const configForm = document.getElementById("config-form");
  const viewGame = document.getElementById("view-game");
  const viewHistory = document.getElementById("view-history");

  document.getElementById("btn-to-config").addEventListener("click", () => {
    viewHome.style.display = "none";
    viewConfig.style.display = "block";
  });

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    viewConfig.style.display = "none";
    viewGame.style.display = "block";
  });

  document.getElementById("btn-to-history").addEventListener("click", () => {
    viewHome.style.display = "none";
    viewHistory.style.display = "block";
  });

  document.getElementById("btn-history-back").addEventListener("click", () => {
    viewHistory.style.display = "none";
    viewHome.style.display = "block";
  });

  document.getElementById("btn-to-menu").addEventListener("click", () => {
    document.getElementById("view-results").style.display = "none";
    viewConfig.style.display = "block";
  });
});