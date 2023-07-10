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
      var thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "";
  
      var bookElement = document.createElement("div");
      bookElement.classList.add("book");
  
      var thumbnailElement = document.createElement("img");
      thumbnailElement.src = thumbnail;
  
      var titleElement = document.createElement("h3");
      titleElement.textContent = bookTitle;
  
      var authorsElement = document.createElement("p");
      authorsElement.textContent = "Auteur(s): " + authors;
  
      bookElement.appendChild(thumbnailElement);
      bookElement.appendChild(titleElement);
      bookElement.appendChild(authorsElement);
  
      resultsContainer.appendChild(bookElement);
    });
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
      var thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "";
  
      var bookElement = document.createElement("div");
      bookElement.classList.add("book");
  
      var thumbnailElement = document.createElement("img");
      thumbnailElement.src = thumbnail;
  
      var titleElement = document.createElement("h3");
      titleElement.textContent = bookTitle;
  
      var authorsElement = document.createElement("p");
      authorsElement.textContent = "Auteur(s): " + authors;
  
      bookElement.appendChild(thumbnailElement);
      bookElement.appendChild(titleElement);
      bookElement.appendChild(authorsElement);
  
      resultsContainer.appendChild(bookElement);
    });
  
    // Appel à la fonction createResultsContainer
    resultsContainer();
  }
  
  
  
  