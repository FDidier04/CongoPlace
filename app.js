const cities = ["Pointe-Noire", "Brazzaville", "Dolisie", "Nkayi"];
const categories = ["Telephones", "Vehicules", "Immobilier", "Maison", "Mode", "Services", "Vacances", "Emploi", "Famille", "Electronique", "Loisirs", "Autres"];

const palette = [
  "linear-gradient(135deg, #0f6c7d, #40b5a7)",
  "linear-gradient(135deg, #f65a0b, #f4bc4f)",
  "linear-gradient(135deg, #168255, #86c96c)",
  "linear-gradient(135deg, #2f4f6f, #a171d4)",
  "linear-gradient(135deg, #b84c7a, #e49564)",
  "linear-gradient(135deg, #24446f, #d9bf3d)"
];

const seedListings = [
  {
    id: "a1",
    title: "Samsung Galaxy S23 256 Go",
    category: "Telephones",
    price: 320000,
    location: "Nkayi",
    date: "Aujourd'hui",
    verified: true,
    seller: "Grace M.",
    phone: "+242 06 000 0001",
    image: "assets/listing-phone.png",
    description: "Tres bon etat, batterie fiable, chargeur inclus. Remise en main propre possible au centre-ville."
  },
  {
    id: "a2",
    title: "Toyota Corolla propre",
    category: "Vehicules",
    price: 4200000,
    location: "Nkayi",
    date: "Hier",
    verified: true,
    seller: "Patrick K.",
    phone: "+242 06 000 0002",
    image: "assets/listing-car.png",
    description: "Vehicule bien entretenu, papiers disponibles, ideale pour trajets quotidiens."
  },
  {
    id: "a3",
    title: "Appartement 2 chambres",
    category: "Immobilier",
    price: 225000,
    location: "Dolisie",
    date: "Il y a 2 jours",
    verified: false,
    seller: "Immo Sud",
    phone: "+242 06 000 0003",
    image: "assets/listing-apartment.png",
    description: "Appartement lumineux, quartier calme, eau et courant disponibles."
  },
  {
    id: "a4",
    title: "Canape 5 places",
    category: "Maison",
    price: 115000,
    location: "Pointe-Noire",
    date: "Il y a 3 jours",
    verified: true,
    seller: "Linda B.",
    phone: "+242 06 000 0004",
    image: "assets/listing-home.png",
    description: "Canape confortable, tissu propre, disponible immediatement."
  },
  {
    id: "a5",
    title: "Baskets taille 43",
    category: "Mode",
    price: 40000,
    location: "Brazzaville",
    date: "Il y a 4 jours",
    verified: false,
    seller: "Junior S.",
    phone: "+242 06 000 0005",
    image: "assets/listing-home.png",
    description: "Portees deux fois, vendues avec boite. Prix legerement negociable."
  },
  {
    id: "a6",
    title: "Installation antenne et TV",
    category: "Services",
    price: 15000,
    location: "Dolisie",
    date: "Cette semaine",
    verified: true,
    seller: "Merveille Tech",
    phone: "+242 06 000 0006",
    image: "assets/listing-apartment.png",
    description: "Deplacement rapide, installation propre, diagnostic inclus."
  },
  {
    id: "a7",
    title: "Console de jeux avec deux manettes",
    category: "Loisirs",
    price: 135000,
    location: "Pointe-Noire",
    date: "Cette semaine",
    verified: true,
    seller: "Chris N.",
    phone: "+242 06 000 0007",
    image: "assets/listing-phone.png",
    description: "Console propre, fonctionne parfaitement, vendue avec deux jeux."
  },
  {
    id: "a8",
    title: "Refrigerateur economique",
    category: "Electronique",
    price: 165000,
    location: "Brazzaville",
    date: "Il y a 5 jours",
    verified: false,
    seller: "Sarah L.",
    phone: "+242 06 000 0008",
    image: "assets/listing-home.png",
    description: "Refrigerateur familial, faible consommation, disponible a recuperer ce week-end."
  }
];

let listings = loadListings();
let favorites = JSON.parse(localStorage.getItem("congoplace:favorites") || "[]");
let account = JSON.parse(localStorage.getItem("congoplace:account") || "null");

const els = {
  categoryInput: document.querySelector("#categoryInput"),
  sellCategory: document.querySelector("#sellCategory"),
  sellLocation: document.querySelector("#sellLocation"),
  queryInput: document.querySelector("#queryInput"),
  locationInput: document.querySelector("#locationInput"),
  minPrice: document.querySelector("#minPrice"),
  maxPrice: document.querySelector("#maxPrice"),
  verifiedOnly: document.querySelector("#verifiedOnly"),
  sortInput: document.querySelector("#sortInput"),
  listingGrid: document.querySelector("#listingGrid"),
  emptyState: document.querySelector("#emptyState"),
  stats: document.querySelector("#stats strong"),
  favoriteList: document.querySelector("#favoriteList"),
  detailModal: document.querySelector("#detailModal"),
  detailContent: document.querySelector("#detailContent"),
  heroSlider: document.querySelector("#heroSlider"),
  accountAvatar: document.querySelector("#accountAvatar"),
  accountName: document.querySelector("#accountName"),
  accountCity: document.querySelector("#accountCity"),
  accountModal: document.querySelector("#accountModal"),
  accountForm: document.querySelector("#accountForm"),
  accountStatus: document.querySelector("#accountStatus"),
  sellModal: document.querySelector("#sellModal"),
  sellForm: document.querySelector("#sellForm")
};

const sliderState = {
  index: 0,
  timer: null
};

function loadListings() {
  const saved = JSON.parse(localStorage.getItem("congoplace:listings") || "[]");
  const allowed = new Set(cities);
  return [...saved, ...seedListings].filter((listing) => allowed.has(listing.location));
}

function saveUserListing(listing) {
  const saved = JSON.parse(localStorage.getItem("congoplace:listings") || "[]");
  localStorage.setItem("congoplace:listings", JSON.stringify([listing, ...saved]));
}

function formatPrice(value) {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0
  }).format(value)} FCFA`;
}

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function populateOptions() {
  cities.forEach((city) => {
    els.locationInput.append(new Option(city, city));
    els.sellLocation.append(new Option(city, city));
    els.accountCity.append(new Option(city, city));
  });

  categories.forEach((category) => {
    els.categoryInput.append(new Option(category, category));
    els.sellCategory.append(new Option(category, category));
  });
}

function getFilteredListings() {
  const query = normalize(els.queryInput.value);
  const location = els.locationInput.value;
  const category = els.categoryInput.value;
  const min = Number(els.minPrice.value || 0);
  const max = Number(els.maxPrice.value || Infinity);

  const filtered = listings.filter((item) => {
    const searchable = normalize(`${item.title} ${item.category} ${item.description}`);
    const matchesQuery = !query || searchable.includes(query);
    const matchesLocation = !location || item.location === location;
    const matchesCategory = !category || item.category === category;
    const matchesPrice = item.price >= min && item.price <= max;
    const matchesVerified = !els.verifiedOnly.checked || item.verified;
    return matchesQuery && matchesLocation && matchesCategory && matchesPrice && matchesVerified;
  });

  return filtered.sort((a, b) => {
    if (els.sortInput.value === "priceAsc") return a.price - b.price;
    if (els.sortInput.value === "priceDesc") return b.price - a.price;
    return listings.indexOf(a) - listings.indexOf(b);
  });
}

function renderListings() {
  const filtered = getFilteredListings();
  els.listingGrid.innerHTML = "";
  els.stats.textContent = filtered.length;
  els.emptyState.hidden = filtered.length > 0;

  filtered.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.style.setProperty("--thumb", item.thumb || palette[index % palette.length]);
    card.style.setProperty("--image", item.image ? `url("${item.image}")` : "none");
    card.innerHTML = `
      <div class="listing-thumb">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ""}
        <span class="badge">${item.category}</span>
      </div>
      <div class="listing-body">
        <h3 class="listing-title">${item.title}</h3>
        <div class="price">${formatPrice(item.price)}</div>
        <div class="meta">${item.location} &middot; ${item.date}${item.verified ? " &middot; Verifie" : ""}</div>
        <div class="card-actions">
          <button class="ghost-btn" type="button" data-detail="${item.id}">Voir</button>
          <button class="icon-btn" type="button" data-favorite="${item.id}" aria-label="Ajouter aux favoris">${favorites.includes(item.id) ? "&hearts;" : "&#9825;"}</button>
        </div>
      </div>
    `;
    els.listingGrid.append(card);
  });
}

function renderFavorites() {
  const saved = listings.filter((item) => favorites.includes(item.id));
  els.favoriteList.innerHTML = saved.length
    ? saved.map((item) => `<div class="favorite-pill"><strong>${item.title}</strong><span>${formatPrice(item.price)}</span></div>`).join("")
    : `<p class="empty-state">Aucun favori pour le moment.</p>`;
}

function renderAccount() {
  if (!account) {
    els.accountAvatar.textContent = "?";
    els.accountName.textContent = "Creer un compte";
    return;
  }

  const first = account.firstName.charAt(0) || "";
  const last = account.lastName.charAt(0) || "";
  els.accountAvatar.textContent = `${first}${last}`.toUpperCase();
  els.accountName.textContent = `${account.firstName} ${account.lastName}`;
}

function openDetail(id) {
  const item = listings.find((listing) => listing.id === id);
  if (!item) return;
  els.detailContent.innerHTML = `
    <div class="detail-layout" style="--thumb:${item.thumb || palette[0]}">
      <div class="detail-visual">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ""}
      </div>
      <div class="detail-info">
        <p class="eyebrow">${item.category}</p>
        <h2>${item.title}</h2>
        <div class="price">${formatPrice(item.price)}</div>
        <p>${item.description}</p>
        <p class="meta">${item.location} &middot; ${item.date} &middot; Vendeur: ${item.seller}${item.verified ? " &middot; Verifie" : ""}</p>
        <a class="post-btn" href="tel:${item.phone}">Contacter le vendeur</a>
      </div>
    </div>
  `;
  els.detailModal.showModal();
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter((itemId) => itemId !== id) : [...favorites, id];
  localStorage.setItem("congoplace:favorites", JSON.stringify(favorites));
  renderListings();
  renderFavorites();
}

function resetFilters() {
  document.querySelector("#searchForm").reset();
  els.locationInput.value = "";
  els.minPrice.value = "";
  els.maxPrice.value = "";
  els.categoryInput.value = "";
  els.verifiedOnly.checked = false;
  els.sortInput.value = "recent";
  renderListings();
}

function createId() {
  return crypto.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createListing(form) {
  const data = new FormData(form);
  const listing = {
    id: createId(),
    title: data.get("title").trim(),
    price: Number(data.get("price")),
    category: data.get("category"),
    location: data.get("location"),
    phone: data.get("phone").trim(),
    description: data.get("description").trim(),
    seller: account ? `${account.firstName} ${account.lastName}` : "Nouveau vendeur",
    date: "Maintenant",
    verified: false,
    thumb: palette[Math.floor(Math.random() * palette.length)],
    image: "assets/listing-home.png"
  };

  listings = [listing, ...listings];
  saveUserListing(listing);
  form.reset();
  els.sellModal.close();
  renderListings();
  document.querySelector("#annonces").scrollIntoView({ behavior: "smooth" });
}

function createAccount(form) {
  const data = new FormData(form);
  account = {
    firstName: data.get("firstName").trim(),
    lastName: data.get("lastName").trim(),
    email: data.get("email").trim(),
    phone: data.get("phone").trim(),
    city: data.get("city")
  };

  localStorage.setItem("congoplace:account", JSON.stringify(account));
  renderAccount();
  els.accountStatus.textContent = "Compte cree avec succes.";

  setTimeout(() => {
    els.accountModal.close();
    els.accountStatus.textContent = "";
    form.reset();
  }, 700);
}

function selectCategory(category) {
  const match = categories.find((item) => normalize(item).includes(normalize(category)) || normalize(category).includes(normalize(item)));
  els.categoryInput.value = match || "";
  renderListings();
  document.querySelector("#annonces").scrollIntoView({ behavior: "smooth" });
}

function showSlide(index) {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
  if (!slides.length) return;

  sliderState.index = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === sliderState.index);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === sliderState.index);
  });
}

function startSlider() {
  stopSlider();
  sliderState.timer = setInterval(() => {
    showSlide(sliderState.index + 1);
  }, 4500);
}

function stopSlider() {
  if (sliderState.timer) {
    clearInterval(sliderState.timer);
    sliderState.timer = null;
  }
}

populateOptions();
renderListings();
renderFavorites();
renderAccount();
startSlider();

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderListings();
  document.querySelector("#annonces").scrollIntoView({ behavior: "smooth" });
});

[els.minPrice, els.maxPrice, els.verifiedOnly, els.sortInput, els.categoryInput, els.locationInput].forEach((control) => {
  control.addEventListener("input", renderListings);
});

els.queryInput.addEventListener("input", renderListings);

document.querySelector("#resetFilters").addEventListener("click", resetFilters);

document.body.addEventListener("click", (event) => {
  const detailId = event.target.closest("[data-detail]")?.dataset.detail;
  const favoriteId = event.target.closest("[data-favorite]")?.dataset.favorite;
  const category = event.target.closest("[data-category-link]")?.dataset.categoryLink;

  if (detailId) openDetail(detailId);
  if (favoriteId) toggleFavorite(favoriteId);
  if (category) {
    event.preventDefault();
    selectCategory(category);
  }
  if (event.target.closest("[data-slide-prev]")) {
    showSlide(sliderState.index - 1);
    startSlider();
  }
  if (event.target.closest("[data-slide-next]")) {
    showSlide(sliderState.index + 1);
    startSlider();
  }
  if (event.target.closest("[data-slide-dot]")) {
    showSlide(Number(event.target.closest("[data-slide-dot]").dataset.slideDot));
    startSlider();
  }
  if (event.target.closest("[data-open-sell]")) els.sellModal.showModal();
  if (event.target.closest("[data-open-account]")) els.accountModal.showModal();
  if (event.target.closest("[data-close-detail]")) els.detailModal.close();
  if (event.target.closest("[data-close-sell]")) els.sellModal.close();
  if (event.target.closest("[data-close-account]")) els.accountModal.close();
});

els.heroSlider.addEventListener("mouseenter", stopSlider);
els.heroSlider.addEventListener("mouseleave", startSlider);

els.sellForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createListing(event.currentTarget);
});

els.accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createAccount(event.currentTarget);
});
