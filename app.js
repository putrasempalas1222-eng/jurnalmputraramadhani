// Kelola daftar jurnal di sini. Pengunjung tidak dapat menambah atau mengubah data dari halaman.
const JOURNALS = [
  {
    title: "Design and Development of an Integrated Attendance and Task Management Application Based on Android",
    author: "M. Putra Ramadhani, Syarifah Aini, Karnadi",
    source: "Brilliance: Research of Artificial Intelligence, Vol. 6 No. 2, hlm. 204-211",
    category: "Sistem Informasi dan Android",
    year: "2026",
    published: "31 Mei 2026",
    doi: "10.47709/brilliance.v6i2.8543",
    indexed: "SINTA 3",
    license: "CC BY-NC 4.0",
    url: "https://jurnal.itscience.org/index.php/brilliance/article/view/8543",
    doiUrl: "https://doi.org/10.47709/brilliance.v6i2.8543",
    note: "Penelitian tentang pengembangan aplikasi Android terintegrasi untuk absensi dan manajemen tugas dengan GPS, LBS, validasi visual, serta pemantauan tugas waktu nyata."
  }
];

const list = document.querySelector("#journal-list");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#journal-count");
const search = document.querySelector("#journal-search");
const categoryFilter = document.querySelector("#journal-category-filter");
const clearFilters = document.querySelector("#clear-filters");
const template = document.querySelector("#journal-item-template");
const emptyTitle = document.querySelector("#empty-title");
const emptyCopy = document.querySelector("#empty-copy");
const emptyClearFilters = document.querySelector("#empty-clear-filters");

function isSafeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function populateCategories() {
  [...new Set(JOURNALS.map((journal) => journal.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "id"))
    .forEach((category) => categoryFilter.add(new Option(category, category)));
}

function filteredJournals() {
  const term = search.value.trim().toLocaleLowerCase("id-ID");
  const category = categoryFilter.value;
  return JOURNALS.filter((journal) => {
    const searchable = [journal.title, journal.author, journal.source, journal.category, journal.note]
      .filter(Boolean).join(" ").toLocaleLowerCase("id-ID");
    return (!term || searchable.includes(term)) && (category === "all" || journal.category === category);
  });
}

function clearAllFilters() {
  search.value = "";
  categoryFilter.value = "all";
  render();
}

function render() {
  const journals = filteredJournals();
  const isFiltering = Boolean(search.value.trim()) || categoryFilter.value !== "all";
  list.replaceChildren();
  count.textContent = `${journals.length} jurnal tersedia`;
  clearFilters.hidden = !isFiltering;
  emptyState.hidden = journals.length > 0;

  if (JOURNALS.length === 0) {
    emptyTitle.textContent = "Katalog jurnal sedang disusun.";
    emptyCopy.textContent = "Jurnal akan muncul setelah ditambahkan langsung ke konstanta JOURNALS.";
    emptyClearFilters.hidden = true;
  } else {
    emptyTitle.textContent = "Jurnal yang kamu cari belum tersedia.";
    emptyCopy.textContent = "Gunakan kata kunci lain atau hapus penyaringan untuk melihat seluruh katalog.";
    emptyClearFilters.hidden = false;
  }

  journals.forEach((journal, index) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".journal-order").textContent = String(index + 1).padStart(2, "0");
    node.querySelector(".journal-category").textContent = journal.category || "Rujukan";
    node.querySelector(".journal-title").textContent = journal.title;
    node.querySelector(".journal-year").textContent = journal.year || "";
    node.querySelector(".journal-source").textContent = [journal.author, journal.source].filter(Boolean).join(" / ");
    const note = node.querySelector(".journal-note");
    if (journal.note) note.textContent = journal.note;
    else note.remove();
    node.querySelector(".journal-doi").textContent = journal.doi || "Belum tersedia";
    node.querySelector(".journal-published").textContent = journal.published || journal.year || "Belum tersedia";
    node.querySelector(".journal-indexed").textContent = journal.indexed || "Belum tersedia";
    node.querySelector(".journal-license").textContent = journal.license || "Belum tersedia";
    const link = node.querySelector(".journal-link");
    if (isSafeHttpUrl(journal.url)) link.href = journal.url;
    else link.remove();
    const doiLink = node.querySelector(".doi-link");
    if (isSafeHttpUrl(journal.doiUrl)) doiLink.href = journal.doiUrl;
    else doiLink.remove();
    list.append(node);
  });
}

search.addEventListener("input", render);
categoryFilter.addEventListener("change", render);
clearFilters.addEventListener("click", clearAllFilters);
emptyClearFilters.addEventListener("click", clearAllFilters);

populateCategories();
render();
