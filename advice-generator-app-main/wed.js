const adviceId = document.querySelector(".advice-id");
const adviceText = document.querySelector(".advice-text");
const diceBtn = document.getElementById("dice-btn");
const diceIcon = document.getElementById("dice-icon");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

/* Load past advice so we don't repeat */
let adviceHistory = JSON.parse(localStorage.getItem("adviceHistory")) || [];

/* ---- THEME TOGGLE ---- */
themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  body.classList.toggle("dark");

  // Update icon
  themeToggle.textContent = body.classList.contains("light") ? "☀️" : "🌙";
});

/* ---- GET ADVICE ---- */
async function getAdvice() {
  // Start dice animation
  diceIcon.classList.add("spin");

  try {
    const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-store" });
    const data = await res.json();
    const slip = data.slip;

    // Prevent duplicates
    if (adviceHistory.includes(slip.id)) {
      console.log("Duplicate detected. Fetching again...");
      return getAdvice();
    }

    // Update UI
    adviceId.textContent = `ADVICE #${slip.id}`;
    adviceText.textContent = `"${slip.advice}"`;

    // Save in localStorage
    adviceHistory.push(slip.id);
    localStorage.setItem("adviceHistory", JSON.stringify(adviceHistory));

  } catch (error) {
    adviceText.textContent = "Could not fetch advice.";
  } finally {
    // Stop animation
    diceIcon.classList.remove("spin");
  }
}

diceBtn.addEventListener("click", getAdvice);