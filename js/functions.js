// Fonction pour valider le formulaire de recherche
function validateForm() {
  const bookTitleInput = document.getElementById("bookTitle");
  const authorInput = document.getElementById("author");

  if (bookTitleInput.value.trim() === "" || authorInput.value.trim() === "") {
      alert("Veuillez remplir tous les champs du formulaire.");
      return false;
  }
  return true;
}


// Fonction pour rechercher les livres avec l'API de Google Books
async function searchBooks(title, author) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${title ? `intitle:${title}` : ''}${author ? `+inauthor:${author}` : ''}`;
  
  try {
      const response = await fetch(apiUrl);
      if (response.ok) {
          const data = await response.json();
          displayResults(data);
      } else {
          throw new Error("Erreur lors de la recherche.");
      }
  } catch (error) {
      alert(error.message);
  }
}
 
// Fonction unifiée pour afficher un livre
function displayBook(book, container, isFromSession=false) {
  var bookElement = document.createElement("div");
  bookElement.classList.add("book-card");

  var thumbnailElement = document.createElement("img");
  thumbnailElement.src = book.volumeInfo?.imageLinks?.thumbnail || book.thumbnail || "img/unavailable.png";
  thumbnailElement.classList.add("book-thumbnail");

  var titleElement = document.createElement("h3");
  titleElement.textContent = book.volumeInfo?.title || book.bookTitle;

  var authorsElement = document.createElement("p");
  authorsElement.textContent = "Auteur(s): " + (book.volumeInfo?.authors?.join(", ") || book.authors || "Auteur inconnu");
  authorsElement.classList.add("book-authors");

  var descriptionElement = document.createElement("p");
  descriptionElement.textContent = book.volumeInfo?.description?.substring(0, 200) || book.description || "Information manquante";
  descriptionElement.classList.add("book-description");

  var idElement = document.createElement("p");
  idElement.textContent = "Id : " + (book.id || book.bookId);
  idElement.classList.add("book-id");

  bookElement.appendChild(thumbnailElement);
  bookElement.appendChild(titleElement);
  bookElement.appendChild(idElement);
  bookElement.appendChild(authorsElement);
  bookElement.appendChild(descriptionElement);

  if(isFromSession) {
      var removeButton = document.createElement("button");
      removeButton.classList.add("delete-button");
      removeButton.innerHTML = '<i class="fas fa-trash"></i>';
      removeButton.addEventListener("click", function() {
          removeBookFromSession(book.bookId || book.id);
      });
      bookElement.appendChild(removeButton);
  } else {
      var bookmarkElement = document.createElement("button");
      bookmarkElement.classList.add("bookmark-button");
      bookmarkElement.innerHTML = '<i class="fas fa-bookmark"></i>';
      bookmarkElement.addEventListener("click", function() {
          addBookToPochliste(book);
      });
      bookElement.appendChild(bookmarkElement);
  }

  container.appendChild(bookElement);
}


function displayResults(response) {
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";

  if (response.totalItems === 0) {
      resultsContainer.innerHTML = "Aucun livre trouvé.";
      return;
  }

  const books = response.items;
  const sessionData = sessionStorage.getItem("pochliste");
  const pochlisteBooks = sessionData ? JSON.parse(sessionData) : [];
  const pochlisteBookIds = pochlisteBooks.map(book => book.bookId);

  books.forEach(function(book) {
      if (!pochlisteBookIds.includes(book.id)) {
          displayBook(book, resultsContainer);
      }
  });
}

function addBookToPochliste(book) {

  // Récupérer la poch'liste depuis la sessionStorage
  var sessionData = sessionStorage.getItem("pochliste");
  var pochliste = sessionData ? JSON.parse(sessionData) : [];

  // Vérifier si le livre est déjà présent dans la poch'liste
  for(var i = 0; i < pochliste.length; i++) {
    if(pochliste[i].bookId === book.id) {
      alert("Vous ne pouvez ajouter deux fois le même livre.");
      return;
    }
  }

  // Ajouter le livre à la poch'liste
  pochliste.push({
    bookId: book.id,
    bookTitle: book.volumeInfo.title,
    authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Auteur inconnu",
    description: book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) : "Information manquante",
    thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "img/unavailable.png"
  });

  // Mettre à jour la sessionStorage
  sessionStorage.setItem("pochliste", JSON.stringify(pochliste));
 
  displayBooksFromSession();  

}

// Fonction pour ajouter le livre à la session
function addBookToSession(book) {
  var sessionData = sessionStorage.getItem("pochliste");
  var pochliste = sessionData ? JSON.parse(sessionData) : [];

  pochliste.push(book);
  sessionStorage.setItem("pochliste", JSON.stringify(pochliste));
}

// Fonction pour retirer le livre de la session
function removeBookFromSession(bookId) {
  var sessionData = sessionStorage.getItem("pochliste");
  var pochliste = sessionData ? JSON.parse(sessionData) : [];

  var updatedPochliste = pochliste.filter(function(book) {
    return book.bookId !== bookId;
  });

  sessionStorage.setItem("pochliste", JSON.stringify(updatedPochliste));
  displayBooksFromSession();  
}
 
// Fonction pour afficher les livres depuis la session
function displayBooksFromSession() {
  var sessionData = sessionStorage.getItem("pochliste");
  var pochliste = sessionData ? JSON.parse(sessionData) : [];
  var pochlisteContainer = document.getElementById("pochlisteContainer");
  pochlisteContainer.innerHTML = "";

  pochliste.forEach(function(book) {
      displayBook(book, pochlisteContainer, true);
  });
}


