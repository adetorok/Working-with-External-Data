import * as Carousel from "./Carousel.mjs";
// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_hV6azyYxA43Kk8Sp3SemXlAzV2Fo3zdJxerduZZSPUJvGO3sFiXxKVL9jgLuCmDU";
const headers = { 'x-api-key' : API_KEY };
const baseUrl = "https://api.thecatapi.com/v1";
/**
 * 1. Create an async function "initialLoad" that does the following:
 * 
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

async function initialLoad(){
 
 await fetchData();

}

async function fetchData(){
try {
  
let data = await fetch(`${baseUrl}/breeds`,{headers});
let breeds = await data.json();
console.log(breeds);

for (let i =0; i <breeds.length; i++){
  const elet = document.createElement("option");
  const breed= breeds[i];
  elet.value = breed.id;
  elet.textContent = breed.name;
  breedSelect.appendChild(elet);
}

} catch (error) {
  
}
}
(function(){
  initialLoad();
})();
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

// Question 2) Event handler for breedSelect

const carouselInner = document.getElementById("carouselInner");

// when user selects a breed, fetch multiple images, build carousel, and show info
breedSelect.addEventListener("change", async function () {
  console.log("Question 2) Breed selected");

  try {
    // //clear previous content //
    carouselInner.innerHTML = "";
    infoDump.innerHTML = "";

    // //selected breed id // //
    const breedId = breedSelect.value;
    if (!breedId) return;
    const res = await fetch(
      `${baseUrl}/images/search?breed_id=${encodeURIComponent(breedId)}&limit=10&api_key=${API_KEY}`
    );
    const images = await res.json();
    console.log(images);

    
    for (let i = 0; i < images.length; i++) {
      const imgObj = images[i];

      const template = document.getElementById("carouselItemTemplate");
      const clone = template.content.firstElementChild.cloneNode(true);

      const img = clone.querySelector("img");
      img.src = imgObj.url;
      img.alt = breedId;

      if (i === 0) clone.classList.add("active"); // first slide active

      carouselInner.appendChild(clone);
    }

    if (images.length && images[0].breeds && images[0].breeds[0]) {
      const b = images[0].breeds[0];

      const title = document.createElement("h3");
      title.textContent = `${b.name} (${b.origin})`;

      const desc = document.createElement("p");
      desc.textContent = b.description || "";

      const temperament = document.createElement("p");
      temperament.innerHTML = "<strong>Temperament:</strong> " + (b.temperament || "—");

      infoDump.appendChild(title);
      infoDump.appendChild(desc);
      infoDump.appendChild(temperament);
    }
  } catch (err) {
    console.log("Error in Question 2:", err);
    infoDump.innerHTML = `<div class="alert alert-danger">Error loading breed images.</div>`;
  }
});

(function createInitialCarouselOnce() {
  const check = setInterval(() => {
    if (breedSelect && breedSelect.options.length > 0) {
      // pick the first breed and fire "change"
      breedSelect.value = breedSelect.options[0].value;
      breedSelect.dispatchEvent(new Event("change"));
      clearInterval(check);
    }
  }, 100);
})();

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
// const breedSelect = document.getElementById("breedSelect");
// const infoDump = document.getElementById("infoDump");
// const carouselInner = document.getElementById("carouselInner");

// const API_KEY = "YOUR_API_KEY_HERE";
// const baseUrl = "https://api.thecatapi.com/v1";

// const api = axios.create({
//   baseURL: baseUrl,
//   params: { api_key: API_KEY }
// });

// api.interceptors.request.use((config) => {
//   config.metadata = { start: performance.now() };
//   console.log(`Question 3) → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
//   return config;
// });

// api.interceptors.response.use(
//   (response) => {
//     const end = performance.now();
//     const start = response.config.metadata?.start ?? end;
//     console.log(`Question 3) ← ${response.status} ${response.config.url} (${(end - start).toFixed(1)} ms)`);
//     return response;
//   },
//   (error) => {
//     const end = performance.now();
//     const start = error.config?.metadata?.start ?? end;
//     console.log(`Question 3) × ERROR ${error.config?.url} (${(end - start).toFixed(1)} ms)`);
//     return Promise.reject(error);
//   }
// );

// function clearCarouselAndInfo() {
//   carouselInner.innerHTML = "";
//   infoDump.innerHTML = "";
// }

// function makeInfo(breed) {
//   if (!breed) return;
//   const title = document.createElement("h3");
//   title.textContent = `${breed.name} (${breed.origin})`;
//   const desc = document.createElement("p");
//   desc.textContent = breed.description || "";
//   const temp = document.createElement("p");
//   temp.innerHTML = "<strong>Temperament:</strong> " + (breed.temperament || "—");
//   infoDump.appendChild(title);
//   infoDump.appendChild(desc);
//   infoDump.appendChild(temp);
// }

// function addSlide(url, isActive) {
//   const tpl = document.getElementById("carouselItemTemplate");
//   const clone = tpl.content.firstElementChild.cloneNode(true);
//   const img = clone.querySelector("img");
//   img.src = url;
//   img.alt = "Cat image";
//   if (isActive) clone.classList.add("active");
//   carouselInner.appendChild(clone);
// }

// async function getBreeds() {
//   const { data } = await api.get("/breeds");
//   return data;
// }

// async function getBreedImages(breedId, limit = 10) {
//   const { data } = await api.get("/images/search", {
//     params: { breed_id: breedId, limit }
//   });
//   return Array.isArray(data) ? data : [];
// }

// async function initialLoadAxios() {
//   console.log("Question 1) (Axios) Loading breeds");
//   try {
//     const breeds = await getBreeds();
//     for (let i = 0; i < breeds.length; i++) {
//       const opt = document.createElement("option");
//       opt.value = breeds[i].id;
//       opt.textContent = breeds[i].name;
//       breedSelect.appendChild(opt);
//     }
//     if (breeds.length > 0) {
//       breedSelect.value = breeds[0].id;
//       await loadBreedAxios(breedSelect.value);
//     }
//   } catch (err) {
//     console.log("Error loading breeds:", err);
//   }
// }

// async function loadBreedAxios(breedId) {
//   console.log("Question 2) (Axios) Breed selected:", breedId);
//   try {
//     clearCarouselAndInfo();
//     const images = await getBreedImages(breedId, 10);
//     for (let i = 0; i < images.length; i++) {
//       addSlide(images[i].url, i === 0);
//     }
//     if (images.length && images[0].breeds && images[0].breeds[0]) {
//       makeInfo(images[0].breeds[0]);
//     }
//   } catch (err) {
//     console.log("Error loading breed images:", err);
//     infoDump.innerHTML = `<div class="alert alert-danger">Error loading breed images.</div>`;
//   }
// }

// breedSelect.addEventListener("change", async function () {
//   await loadBreedAxios(breedSelect.value);
// });

// (function () {
//   initialLoadAxios();
// })();
/**
 *
 *
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

export async function favourite(imageId) {
  try {
    await fetch(baseUrl + "/favourites?api_key=" + API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_id: imageId, sub_id: "my-user" })
    });
    console.log("Question 4) Added favourite:", imageId);
  } catch (err) {
    console.log("Favourite error:", err);
  }
}

async function showFavourites() {
  try {
    Carousel.clear();
    infoDump.innerHTML = "";
    const res = await fetch(
      baseUrl + "/favourites?sub_id=my-user&limit=20&api_key=" + API_KEY
    );
    const favs = await res.json();
    for (let i = 0; i < favs.length; i++) {
      const f = favs[i];
      if (!f.image || !f.image.url) continue;
      const el = Carousel.createCarouselItem(
        f.image.url,
        "favourite",
        f.image_id || (f.image && f.image.id) || ""
      );
      Carousel.appendCarousel(el);
    }
    const h = document.createElement("h3");
    h.textContent = "Your Favourites";
    infoDump.appendChild(h);
    Carousel.start();
  } catch (err) {
    console.log("Get favourites error:", err);
    infoDump.innerHTML = `<div class="alert alert-danger">Error loading favourites.</div>`;
  }
}

getFavouritesBtn.addEventListener("click", showFavourites);
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
function setProgress(p) {
  if (progressBar) progressBar.style.width = p + "%";
}
function startProgress() { setProgress(8); }
function finishProgress() { setProgress(100); setTimeout(() => setProgress(0), 700); }
async function fetchWithProgress(url, options) {
  startProgress();
  try { return await fetch(url, options); }
  finally { finishProgress(); }
}
/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
