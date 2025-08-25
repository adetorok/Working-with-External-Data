const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const carouselInner = document.getElementById("carouselInner");

const API_KEY = "YOUR_API_KEY_HERE";
const baseUrl = "https://api.thecatapi.com/v1";

const api = axios.create({
  baseURL: baseUrl,
  params: { api_key: API_KEY }
});

api.interceptors.request.use((config) => {
  config.metadata = { start: performance.now() };
  console.log(`Question 3) → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    const end = performance.now();
    const start = response.config.metadata?.start ?? end;
    console.log(`Question 3) ← ${response.status} ${response.config.url} (${(end - start).toFixed(1)} ms)`);
    return response;
  },
  (error) => {
    const end = performance.now();
    const start = error.config?.metadata?.start ?? end;
    console.log(`Question 3) × ERROR ${error.config?.url} (${(end - start).toFixed(1)} ms)`);
    return Promise.reject(error);
  }
);

function clearCarouselAndInfo() {
  carouselInner.innerHTML = "";
  infoDump.innerHTML = "";
}

function makeInfo(breed) {
  if (!breed) return;
  const title = document.createElement("h3");
  title.textContent = `${breed.name} (${breed.origin})`;
  const desc = document.createElement("p");
  desc.textContent = breed.description || "";
  const temp = document.createElement("p");
  temp.innerHTML = "<strong>Temperament:</strong> " + (breed.temperament || "—");
  infoDump.appendChild(title);
  infoDump.appendChild(desc);
  infoDump.appendChild(temp);
}

function addSlide(url, isActive) {
  const tpl = document.getElementById("carouselItemTemplate");
  const clone = tpl.content.firstElementChild.cloneNode(true);
  const img = clone.querySelector("img");
  img.src = url;
  img.alt = "Cat image";
  if (isActive) clone.classList.add("active");
  carouselInner.appendChild(clone);
}

async function getBreeds() {
  const { data } = await api.get("/breeds");
  return data;
}

async function getBreedImages(breedId, limit = 10) {
  const { data } = await api.get("/images/search", {
    params: { breed_id: breedId, limit }
  });
  return Array.isArray(data) ? data : [];
}

async function initialLoadAxios() {
  console.log("Question 1) (Axios) Loading breeds");
  try {
    const breeds = await getBreeds();
    for (let i = 0; i < breeds.length; i++) {
      const opt = document.createElement("option");
      opt.value = breeds[i].id;
      opt.textContent = breeds[i].name;
      breedSelect.appendChild(opt);
    }
    if (breeds.length > 0) {
      breedSelect.value = breeds[0].id;
      await loadBreedAxios(breedSelect.value);
    }
  } catch (err) {
    console.log("Error loading breeds:", err);
  }
}

async function loadBreedAxios(breedId) {
  console.log("Question 2) (Axios) Breed selected:", breedId);
  try {
    clearCarouselAndInfo();
    const images = await getBreedImages(breedId, 10);
    for (let i = 0; i < images.length; i++) {
      addSlide(images[i].url, i === 0);
    }
    if (images.length && images[0].breeds && images[0].breeds[0]) {
      makeInfo(images[0].breeds[0]);
    }
  } catch (err) {
    console.log("Error loading breed images:", err);
    infoDump.innerHTML = `<div class="alert alert-danger">Error loading breed images.</div>`;
  }
}

breedSelect.addEventListener("change", async function () {
  await loadBreedAxios(breedSelect.value);
});

(function () {
  initialLoadAxios();
})();