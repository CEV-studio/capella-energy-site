const GOOGLE_SCRIPT_URL = "COLLER_ICI_VOTRE_URL_GOOGLE_APPS_SCRIPT_EXEC";
const state = { profil: "", energie: "", step: 1 };
const titles = ["Votre profil", "Votre contrat", "Vos coordonnées"];

function showStep(step) {
  state.step = step;
  document.querySelectorAll(".compare-step").forEach(el => el.classList.toggle("active", Number(el.dataset.step) === step));
  document.getElementById("step-count").textContent = `Étape ${step} sur 3`;
  document.getElementById("step-title").textContent = titles[step - 1];
  document.getElementById("progress").style.width = `${step * 33.333}%`;
}

document.querySelectorAll("[data-field]").forEach(button => button.addEventListener("click", () => {
  const field = button.dataset.field;
  state[field] = button.dataset.value;
  document.querySelectorAll(`[data-field="${field}"]`).forEach(item => item.classList.toggle("active", item === button));
  document.querySelector(`input[name="${field}"]`).value = state[field];
  if (field === "profil") document.getElementById("company-field").style.display = state.profil === "professionnel" ? "grid" : "none";
}));

document.querySelectorAll("[data-next]").forEach(button => button.addEventListener("click", () => {
  const next = Number(button.dataset.next);
  if (state.step === 1 && (!state.profil || !state.energie)) return alert("Choisissez votre profil et l’énergie concernée.");
  if (state.step === 2) {
    const section = document.querySelector('[data-step="2"]');
    if (![...section.querySelectorAll("input,select")].every(field => field.reportValidity())) return;
  }
  showStep(next);
}));
document.querySelectorAll("[data-back]").forEach(button => button.addEventListener("click", () => showStep(Number(button.dataset.back))));

async function sendForm(form) {
  if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/")) throw new Error("Le formulaire doit encore être connecté à Google Apps Script.");
  const body = new URLSearchParams(new FormData(form));
  await fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body });
}

document.getElementById("compare-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('[type="submit"]');
  button.disabled = true; button.textContent = "Envoi en cours…";
  try { await sendForm(event.currentTarget); event.currentTarget.style.display = "none"; document.querySelector(".progress-head").style.display = "none"; document.querySelector(".progress-track").style.display = "none"; document.getElementById("compare-success").classList.add("active"); }
  catch (error) { document.getElementById("compare-error").textContent = error.message; button.disabled = false; button.textContent = "Recevoir mon analyse →"; }
});

document.querySelectorAll(".lead-form").forEach(form => form.addEventListener("submit", async event => {
  event.preventDefault(); const button = form.querySelector("button"); button.disabled = true;
  try { await sendForm(form); form.innerHTML = '<div class="success"><span class="success-icon">✓</span><h2>Merci, nous vous rappelons rapidement.</h2></div>'; }
  catch (error) { form.parentElement.querySelector(".form-message").textContent = error.message; button.disabled = false; }
}));

showStep(1);
