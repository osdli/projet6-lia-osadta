  // Fonction pour valider le formulaire de recherche
  function validateForm() {
    console.log("VF");
    var bookTitleInput = document.getElementById("bookTitle");
    console.log("VariableBookTitle ", bookTitleInput);
    var authorInput = document.getElementById("author");
  
    if (bookTitleInput.value.trim() === "" || authorInput.value.trim() === "") {
      alert("Veuillez remplir tous les champs du formulaire.2");
      return false; // Empêche la soumission du formulaire
    }
  
    // Si les champs ne sont pas vides
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
  
    // Effectuer la requête AJAX pour récupérer les résultats de recherche
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log("Response" ,response);
        displayResults(response);
      }
    };
    xhr.send();
  }
  
  // Fonction pour afficher les résultats de recherche
  function displayResults(response) {
    var resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Effacer les résultats précédents
  
    if (response.totalItems === 0) {
      resultsContainer.innerHTML = "Aucun livre trouvé.";
      return;
    }
  
    var books = response.items;
    books.forEach(function(book) {
      var bookTitle = book.volumeInfo.title;
      var authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Auteur inconnu";
      var description = book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) : "Information manquante";
      var thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "img/unavailable.png";
      var bookId = book.id;
        
      var bookElement = document.createElement("div");
      bookElement.classList.add("book");
  
      var thumbnailElement = document.createElement("img");
      thumbnailElement.src = thumbnail;
  
      var titleElement = document.createElement("h3");
      titleElement.textContent = bookTitle;
  
      var authorsElement = document.createElement("p");
      authorsElement.textContent = "Auteur(s): " + authors;
  
      var descriptionElement = document.createElement("p");
      descriptionElement.textContent = description;
  
      var bookmarkElement = document.createElement("button");
      bookmarkElement.classList.add("bookmark-button");
      bookmarkElement.innerHTML = '<i class="fas fa-bookmark"></i>'; 
  
      bookmarkElement.addEventListener("click", function() {
        addBookToPochliste(bookId, bookTitle);
      });
  
      bookElement.appendChild(thumbnailElement);
      bookElement.appendChild(titleElement);
      bookElement.appendChild(authorsElement);
      bookElement.appendChild(descriptionElement);
      bookElement.appendChild(bookmarkElement);
  
      resultsContainer.appendChild(bookElement);
    });
  }
  function addBookToPochliste(bookId, bookTitle) {
    var pochlisteContainer = document.getElementById("pochlisteContainer");
  
    // Vérifier si le livre est déjà présent dans la poch'liste
    var existingBook = document.querySelector('.pochliste-book[data-book-id="' + bookId + '"]');
    if (existingBook) {
      alert("Vous ne pouvez ajouter deux fois le même livre.");
      return;
    }
  
    // Créer l'élément représentant le livre dans la poch'liste
    var bookElement = document.createElement("div");
    bookElement.classList.add("pochliste-book");
    bookElement.setAttribute("data-book-id", bookId);
  
    var titleElement = document.createElement("h4");
    titleElement.textContent = bookTitle;
  
    var removeButton = document.createElement("button");
    removeButton.textContent = "Retirer";
    removeButton.addEventListener("click", function() {
      // Supprimer le livre de la poch'liste
      bookElement.remove();
    });
  
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
  favoriteBookElement.textContent = bookTitle;
  favoritesContainer.appendChild(favoriteBookElement);
  }
  
  function addBookToSession(bookId, bookTitle) {
    var sessionData = sessionStorage.getItem("pochliste");
    var pochliste = sessionData ? JSON.parse(sessionData) : [];
  
    var existingBookInSession = pochliste.find(function(book) {
      return book.bookId === bookId;
    });
  
    if (!existingBookInSession) {
      var bookData = {
        bookId: bookId,
        bookTitle: bookTitle
      };
  
      pochliste.push(bookData);
  
      sessionStorage.setItem("pochliste", JSON.stringify(pochliste));
    }
  }
  
  function removeBookFromSession(bookId) {
    var sessionData = sessionStorage.getItem("pochliste");
    var pochliste = sessionData ? JSON.parse(sessionData) : [];
  
    var updatedPochliste = pochliste.filter(function(book) {
      return book.bookId !== bookId;
    });
  
    sessionStorage.setItem("pochliste", JSON.stringify(updatedPochliste));
  }
  
  function displayBooksFromSession() {
    var sessionData = sessionStorage.getItem("pochliste");
    var pochliste = sessionData ? JSON.parse(sessionData) : [];

    var pochlisteContainer = document.getElementById("pochlisteContainer");
  
    // Effacer le conteneur de la poch'liste pour éviter les doublons
    pochlisteContainer.innerHTML = "";

    pochliste.forEach(function(book) {
        var bookElement = document.createElement("div");
        bookElement.classList.add("pochliste-book");
        bookElement.setAttribute("data-book-id", book.bookId);
  
        var titleElement = document.createElement("h4");
        titleElement.textContent = book.bookTitle;
  
        var removeButton = document.createElement("button");
        removeButton.textContent = "Retirer";
        removeButton.addEventListener("click", function() {
            // Supprimer le livre de la poch'liste visuellement
            bookElement.remove();
            // Supprimer le livre de la session également
            removeBookFromSession(book.bookId);
        });
  
        bookElement.appendChild(titleElement);
        bookElement.appendChild(removeButton);
        pochlisteContainer.appendChild(bookElement);
    });
}


  


  
  
  
  