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

            var idElement = document.createElement("p");
            idElement.textContent = "Id : " + book.id;
            idElement.classList.add("book-id");

            var bookmarkElement = document.createElement("button");
            bookmarkElement.classList.add("bookmark-button");
            bookmarkElement.innerHTML = '<i class="fas fa-bookmark"></i>';
            bookmarkElement.addEventListener("click", function() {
                addBookToPochliste(book);
            });

            bookElement.appendChild(bookmarkElement);
            bookElement.appendChild(titleElement);
            bookElement.appendChild(idElement);
            bookElement.appendChild(authorsElement);
            bookElement.appendChild(descriptionElement);
            bookElement.appendChild(thumbnailElement);
            

            resultsContainer.appendChild(bookElement);
        }
    });
}

function addBookToPochliste(book) {

  // Récupérer la poch'liste depuis la sessionStorage
  var sessionData = sessionStorage.getItem("pochliste");
  var pochliste = sessionData ? JSON.parse(sessionData) : [];

  console.log("ID du livre à ajouter:", book.id);
  console.log("Poch'liste actuelle:", pochliste);
  
  // Vérifier si le livre est déjà présent dans la poch'liste
  for(var i = 0; i < pochliste.length; i++) {
    console.log("Comparaison de l'ID:", pochliste[i].bookId, book.id);
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
 
  console.log("book log =",book);
  
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
      var bookElement = document.createElement("div");
      bookElement.classList.add("book-card");   // Utilisation de "book-card" pour uniformiser le style

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

      var idElement = document.createElement("p");
        idElement.textContent = "Id : " + book.bookId;
        idElement.classList.add("book-id");

      var removeButton = document.createElement("button");
      removeButton.classList.add("delete-button");
      removeButton.innerHTML = '<i class="fas fa-trash"></i>';
      removeButton.addEventListener("click", function() {
          removeBookFromSession(book.bookId);
      });

      bookElement.appendChild(thumbnailElement);
      bookElement.appendChild(titleElement);
      bookElement.appendChild(idElement);
      bookElement.appendChild(authorsElement);
      bookElement.appendChild(descriptionElement);
      bookElement.appendChild(removeButton);

      pochlisteContainer.appendChild(bookElement);
  });
}


