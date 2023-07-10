document.addEventListener("DOMContentLoaded", function() {
    // Création du bouton
    var addButton = document.createElement("button");
    addButton.textContent = "Ajouter un livre";
    addButton.classList.add("green-button");
    addButton.addEventListener("click", function() {
      // Code à exécuter lorsque le bouton est cliqué
      console.log("Le bouton a été cliqué !");
      // Ajouter un livre à la liste
  
      var searchForm = document.createElement("div");
      searchForm.id = "searchForm";
  
      var inputTitle = document.createElement("input");
      inputTitle.type = "text";
      inputTitle.id = "bookTitle";
      inputTitle.placeholder = "Titre du livre";
  
      var labelTitle = document.createElement("label");
      labelTitle.textContent = "Titre du livre";
      labelTitle.setAttribute("for", "bookTitle");
  
      var inputAuthor = document.createElement("input");
      inputAuthor.type = "text";
      inputAuthor.id = "author";
      inputAuthor.placeholder = "Auteur";
  
      var labelAuthor = document.createElement("label");
      labelAuthor.textContent = "Auteur";
      labelAuthor.setAttribute("for", "author");
  
      var searchButton = document.createElement("button");
      searchButton.textContent = "Rechercher";
      searchButton.classList.add("search-button");
  
      var cancelButton = document.createElement("button");
      cancelButton.textContent = "Annuler";
      cancelButton.classList.add("cancel-button");
  
      searchForm.appendChild(labelTitle);
      searchForm.appendChild(inputTitle);
      searchForm.appendChild(labelAuthor);
      searchForm.appendChild(inputAuthor);
      searchForm.appendChild(searchButton);
      searchForm.appendChild(cancelButton);
  
      addButton.parentNode.insertBefore(searchForm, addButton.nextSibling);
  
      searchForm.style.display = "block";
  
      // Écouter l'événement "click" du bouton de recherche
      searchButton.addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du bouton
        console.log("ClickBeforevalidateForm");
        try {
            if (validateForm()) {
                console.log("ClickVF");
              var bookTitle = document.getElementById("bookTitle").value;
              var author = document.getElementById("author").value;
      
              // Effectuer la recherche avec l'API de Google Books
              console.log("ClickSerachBook");
              searchBooks(bookTitle, author);
            }
         
          } catch (error) {
            console.error(error);
            // Expected output: ReferenceError: nonExistentFunction is not defined
            // (Note: the exact output may be browser-dependent)
          }
        var ValidateFormResponse = validateForm(); 

    }); 
  
      // Écouter l'événement "click" du bouton "Annuler"
      cancelButton.addEventListener("click", function() {
        searchForm.style.display = "none"; // Cacher le formulaire
        var resultsContainer = document.getElementById("resultsContainer");
        resultsContainer.style.display = "none"; // Cacher les résultats de recherche
        addButton.style.display = "block"; // Afficher le bouton "Ajouter un livre"
      });
  
      addButton.style.display = "none"; // Cacher le bouton "Ajouter un livre"
    });
  
    // Récupération de l'élément "Ma poch'liste"
    var maPochListe = document.querySelector("#content h2");

    // Vérifier si l'élément de conteneur des résultats existe déjà
    var resultsContainer = document.getElementById("resultsContainer");
       if (!resultsContainer) {
    // Créer l'élément de conteneur des résultats
    resultsContainer = document.createElement("div");
    resultsContainer.id = "resultsContainer";
    maPochListe.parentNode.appendChild(resultsContainer);
  }
  
    // Récupération de l'élément "Poch'Lib"
    var pochLib = document.querySelector(".title");
  
    // Création de la balise <hr>
    var hrElement = document.createElement("hr");
  
    // Insérer le bouton "Ajouter un livre" après l'élément "Nouveau livre"
    maPochListe.parentNode.insertBefore(addButton, maPochListe.nextSibling);
  
    // Insérer la balise <hr> après le bouton "Ajouter un livre"
    maPochListe.parentNode.insertBefore(hrElement, addButton.nextSibling);
  
    // Déplacer l'élément "Ma poch'liste" à la fin
    maPochListe.parentNode.appendChild(maPochListe);
  
    // Appliquer des modifications à la balise <hr>
    hrElement.style.width = "80%";
    hrElement.style.margin = "20px auto";
  
    // Appliquer des styles à l'élément "Poch'Lib"
    pochLib.style.textAlign = "center";
    pochLib.style.marginTop = "0"; // Supprimer la marge supérieure
  
    // Appliquer des styles au bouton "Ajouter un livre"
    addButton.style.marginTop = "20px"; // Ajouter une marge supérieure
  });
  

  
  
  