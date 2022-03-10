let i = 0;
let text = "Can you guess their favorite dog breed...?";
let speed = 50;
const about = document.querySelector("#nav-gallery-tab");
const search = document.querySelector("#nav-search-tab");
about.addEventListener("click", handleGal);
search.addEventListener("click", handleSearch);

window.onload = function typeWriter() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i);
    ++i;
    setTimeout(typeWriter, speed);
  }
};

typeWriter();

function handleGal() {
  galLocation();
}

function handleSearch() {
  searLocation();
}
