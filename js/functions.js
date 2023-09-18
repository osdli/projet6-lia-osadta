// F onction displayBooks
function displayBooks(books) {
  let htmlString = '';
  for(let book of books) {
      htmlString += `
      <div class="book-card">
          <div class="book-info">
              <h2 class="book-title">${book.title}</h2>
              <p class="book-author">${book.author}</p>
              <p class="book-release">${book.release}</p>
          </div>
          <div class="book-image-container">
              <img class="book-image" src="${book.image}" alt="${book.title}">
          </div>
      </div>`;
  }
  document.querySelector('.books-container').innerHTML = htmlString;
}
// Fonction pour valider le formulaire de recherche
function validateForm() {
  var bookTitleInput = document.getElementById("bookTitle");
  var authorInput = document.getElementById("author");

  if (bookTitleInput.value.trim() === "" || authorInput.value.trim() === "") {
    alert("Veuillez remplir tous les champs du formulaire.");
    return false;
  }
  return true;
}

  // Fonction pour rechercher les livres avec l'API de Google Books
function searchBooks(title, author) {
  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  
  if (title) {
    apiUrl += "intitle:" + title;
  }
  
  if (author) {
    apiUrl += "+inauthor:" + author;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      displayResults(response);
    } else if (xhr.readyState === 4) {
      alert("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
    }
  };
  xhr.send();
}
  
function displayResults(response) {
  var resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";

  if (response.totalItems === 0) {
    resultsContainer.innerHTML = "Aucun livre trouvé.";
    return;
  }

    var books = response.items;

    // Récupérer les ID de livres déjà dans la poch'liste pour ne pas les réafficher
    var sessionData = sessionStorage.getItem("pochliste");
    var pochlisteBooks = sessionData ? JSON.parse(sessionData) : [];
    var pochlisteBookIds = pochlisteBooks.map(book => book.bookId);

    books.forEach(function(book) {
        // Si le livre est déjà dans la poch'liste, ne pas le réafficher dans les résultats de recherche
        if (!pochlisteBookIds.includes(book.id)) {
            var bookElement = document.createElement("div");
            bookElement.classList.add("book-card");

            var thumbnailElement = document.createElement("img");
            thumbnailElement.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "img/unavailable.png";
            thumbnailElement.classList.add("book-thumbnail");

            var titleElement = document.createElement("h3");
            titleElement.textContent = book.volumeInfo.title;
            titleElement.classList.add("book-title");

            var authorsElement = document.createElement("p");
            authorsElement.textContent = "Auteur(s): " + (book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Auteur inconnu");
            authorsElement.classList.add("book-authors");

            var descriptionElement = document.createElement("p");
            descriptionElement.textContent = book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) : "Information manquante";
            descriptionElement.classList.add("book-description");

            var bookmarkElement = document.createElement("button");
            bookmarkElement.classList.add("bookmark-button");
            bookmarkElement.innerHTML = '<i class="fas fa-bookmark"></i>';
            bookmarkElement.addEventListener("click", function() {
                addBookToPochliste(book);
            });

            bookElement.appendChild(bookmarkElement);
            bookElement.appendChild(titleElement);
            bookElement.appendChild(authorsElement);
            bookElement.appendChild(descriptionElement);
            bookElement.appendChild(thumbnailElement);
            

            resultsContainer.appendChild(bookElement);
        }
    });
}

function addBookToPochliste(book) {

   // Vérifier si le livre est déjà présent dans la poch'liste
   var existingBook = document.querySelector('.pochliste-book[data-book-id="' + book.id + '"]');
   if (existingBook) {
     alert("Vous ne pouvez ajouter deux fois le même livre.");
     return;
   }

  var pochlisteContainer = document.getElementById("pochlisteContainer");
  console.log("book log =",book);
  var bookData = {
    bookId: book.id,
    bookTitle: book.volumeInfo.title,
    // Ajouts supplémentaires pour les autres informations
    authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Auteur inconnu",
    description: book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) : "Information manquante",
    thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "img/unavailable.png"
  };

  addBookToSession(bookData);
  displayBooksFromSession();  // Mettre à jour l'affichage

  
    // Créer l'élément représentant le livre dans la poch'liste
    var bookElement = document.createElement("div");
    bookElement.classList.add("pochliste-book");
    bookElement.setAttribute("data-book-id", book.id);
  
    var titleElement = document.createElement("h4");
    titleElement.textContent = book.volumeInfo.title;
  
   
  
    bookElement.appendChild(titleElement);
    bookElement.appendChild(removeButton);
  
    // Ajouter le livre à la poch'liste
    pochlisteContainer.appendChild(bookElement);

    // Ajouter le livre aux favoris en créant dynamiquement l'élément dans le corps de la page
   var favoritesContainer = document.getElementById("favoritesContainer");
  if (!favoritesContainer) {
    favoritesContainer = document.createElement("div");
    favoritesContainer.id = "favoritesContainer";
    document.body.appendChild(favoritesContainer);
  }

  var favoriteBookElement = document.createElement("div");
  favoriteBookElement.textContent = book.volumeInfo.title;  // Utilisation de book.volumeInfo.title au lieu de bookTitle
  favoritesContainer.appendChild(favoriteBookElement);
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
  displayBooksFromSession();  // Mettre à jour l'affichage
}

  
// Fonction pour afficher les livres depuis la session
function displayBooksFromSession() {
  var sessionData = sessionStorage.getItem("pochliste");
  var pochliste = sessionData ? JSON.parse(sessionData) : [];
  var pochlisteContainer = document.getElementById("pochlisteContainer");
  pochlisteContainer.innerHTML = "";

  pochliste.forEach(function(book) {
    var bookElement = document.createElement("div");
    bookElement.classList.add("pochliste-book");
    bookElement.setAttribute("data-book-id", book.bookId);

    var thumbnailElement = document.createElement("img");
    thumbnailElement.src = book.thumbnail;
    thumbnailElement.classList.add("book-thumbnail");

    var titleElement = document.createElement("h4");
    titleElement.textContent = book.bookTitle;

    var authorsElement = document.createElement("p");
    authorsElement.textContent = "Auteur(s): " + book.authors;
    authorsElement.classList.add("book-authors");

    var descriptionElement = document.createElement("p");
    descriptionElement.textContent = book.description;
    descriptionElement.classList.add("book-description");

    var removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener("click", function() {
      removeBookFromSession(book.bookId);
    });

    bookElement.appendChild(thumbnailElement);
    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorsElement);
    bookElement.appendChild(descriptionElement);
    bookElement.appendChild(removeButton);

    pochlisteContainer.appendChild(bookElement);
  });
}
