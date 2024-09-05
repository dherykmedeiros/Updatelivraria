document.addEventListener("DOMContentLoaded", function () {
  const addBookBtn = document.getElementById("addBookBtn");
  const bookModal = document.getElementById("bookModal");
  const closeBookModal = document.getElementById("closeBookModal");
  const bookForm = document.getElementById("bookForm");
  const bookFormSubmitBtn = document.getElementById("bookFormSubmitBtn");
  const deleteConfirmationModal = document.getElementById("deleteConfirmationModal");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const saveBtn = document.getElementById("saveBtn"); // Botão de salvar
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let isEditing = false;
  let editingIndex = null;

  function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function generateBookCard(book, index) {
    const card = document.createElement("div");
    card.className = "border rounded-md p-4 shadow-sm flex flex-col gap-2";

    const img = document.createElement("img");
    img.src = book.image ? book.image : "default.jpg";
    img.className = "w-full h-48 object-cover mb-4";
    card.appendChild(img);

    const title = document.createElement("h2");
    title.textContent = book.title;
    title.className = "text-xl font-bold";
    card.appendChild(title);

    const author = document.createElement("p");
    author.textContent = `Author: ${book.author}`;
    card.appendChild(author);

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${book.genre}`;
    card.appendChild(genre);

    const year = document.createElement("p");
    year.textContent = `Year: ${book.year}`;
    card.appendChild(year);

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${book.rating}/5`;
    card.appendChild(rating);

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "flex justify-between mt-4";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "bg-blue-500 text-white rounded-md px-4 py-2";
    editBtn.addEventListener("click", function () {
      openEditBookModal(index);
    });
    actionsContainer.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "bg-red-500 text-white rounded-md px-4 py-2";
    deleteBtn.addEventListener("click", function () {
      openDeleteConfirmationModal(index);
    });
    actionsContainer.appendChild(deleteBtn);

    card.appendChild(actionsContainer);

    return card;
  }

  function renderBooks() {
    const bookGrid = document.getElementById("bookGrid");
    bookGrid.innerHTML = "";
    books.forEach((book, index) => {
      const card = generateBookCard(book, index);
      bookGrid.appendChild(card);
    });
  }

  function openEditBookModal(index) {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("year").value = book.year;
    document.getElementById("rating").value = book.rating;
    document.getElementById("modalTitle").textContent = "Edit Book";
    bookFormSubmitBtn.textContent = "Update Book";
    bookModal.classList.remove("hidden");
    isEditing = true;
    editingIndex = index;
  }

  function closeBookModalFunction() {
    bookModal.classList.add("hidden");
    bookForm.reset();
    document.getElementById("modalTitle").textContent = "Add New Book";
    bookFormSubmitBtn.textContent = "Add Book";
    isEditing = false;
    editingIndex = null;
  }

  function openDeleteConfirmationModal(index) {
    deleteConfirmationModal.classList.remove("hidden");
    confirmDeleteBtn.onclick = function () {
      books.splice(index, 1);
      saveBooksToLocalStorage();
      renderBooks();
      deleteConfirmationModal.classList.add("hidden");
    };
  }

  function closeDeleteConfirmationModal() {
    deleteConfirmationModal.classList.add("hidden");
  }

  addBookBtn.addEventListener("click", function () {
    bookModal.classList.remove("hidden");
  });

  closeBookModal.addEventListener("click", closeBookModalFunction);

  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;
    const rating = document.getElementById("rating").value;

    if (isEditing) {
      books[editingIndex] = { title, author, genre, year, rating };
    } else {
      books.push({ title, author, genre, year, rating });
    }

    saveBooksToLocalStorage();
    renderBooks();
    closeBookModalFunction();
  });

  saveBtn.addEventListener("click", function () {
    downloadBooksAsJSON();
    downloadBooksAsPDF();
  });

  function downloadBooksAsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "books.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function downloadBooksAsPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Book Catalog", 10, 10);

    books.forEach((book, i) => {
      doc.setFontSize(12);
      doc.text(`Title: ${book.title}`, 10, 20 + i * 30);
      doc.text(`Author: ${book.author}`, 10, 30 + i * 30);
      doc.text(`Genre: ${book.genre}`, 10, 40 + i * 30);
      doc.text(`Year: ${book.year}`, 10, 50 + i * 30);
      doc.text(`Rating: ${book.rating}/5`, 10, 60 + i * 30);
    });

    doc.save("books.pdf");
  }

  cancelDeleteBtn.addEventListener("click", closeDeleteConfirmationModal);
  renderBooks();
});
