let currentEditIndex = -1;

const form = document.getElementById("animeForm");
const titleInput = document.getElementById("animeTitle");
const ratingInput = document.getElementById("animeRating");
const descInput = document.getElementById("animeDesc");
const imgInput = document.getElementById("animeImg");
const list = document.getElementById("animeList");
const searchInput = document.getElementById("searchInput");
const ratingFilter = document.getElementById("ratingFilter");
const darkModeToggle = document.getElementById("darkModeToggle");

let animeData = JSON.parse(localStorage.getItem("animeList")) || [];

function saveToLocalStorage() {
  localStorage.setItem("animeList", JSON.stringify(animeData));
}

function createAnimeItem(anime, index) {
  const li = document.createElement("li");

  const img = document.createElement("img");
  img.src = anime.img;
  img.alt = anime.title;

  const title = document.createElement("h3");
  title.textContent = anime.title;

  const rating = document.createElement("p");
  rating.textContent = `Rating: ${anime.rating}/10`;

  const desc = document.createElement("p");
  desc.textContent = anime.desc;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
    animeData.splice(index, 1);
    saveToLocalStorage();
    renderAnimeList();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", function () {
    titleInput.value = anime.title;
    ratingInput.value = anime.rating;
    descInput.value = anime.desc;
    imgInput.value = anime.img;

    currentEditIndex = index;
    form.querySelector("button").textContent = "Update";
  });

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("button-group");
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  li.appendChild(img);
  li.appendChild(title);
  li.appendChild(rating);
  li.appendChild(desc);
  li.appendChild(buttonGroup);

  return li;
}

function renderAnimeList() {
  list.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();
  const ratingMin = parseInt(ratingFilter.value) || 0;

  animeData.forEach((anime, index) => {
    const matchTitle = anime.title.toLowerCase().includes(keyword);
    const matchRating = parseInt(anime.rating) >= ratingMin;

    if (matchTitle && matchRating) {
      const li = createAnimeItem(anime, index);
      list.appendChild(li);
    }
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const updatedAnime = {
    title: titleInput.value.trim(),
    rating: ratingInput.value,
    desc: descInput.value.trim(),
    img: imgInput.value.trim(),
  };

  if (currentEditIndex === -1) {
    animeData.push(updatedAnime);
  } else {
    animeData[currentEditIndex] = updatedAnime;
    currentEditIndex = -1;
    form.querySelector("button").textContent = "Tambah";
  }

  saveToLocalStorage();
  renderAnimeList();

  titleInput.value = "";
  ratingInput.value = "";
  descInput.value = "";
  imgInput.value = "";
});

searchInput.addEventListener("input", renderAnimeList);
ratingFilter.addEventListener("change", renderAnimeList);

// ========== DARK MODE ==========
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", function () {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});

renderAnimeList();
