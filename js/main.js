document.addEventListener("DOMContentLoaded", function() {
    // Création du bouton
    var addButton = document.createElement("button");
    addButton.textContent = "Ajouter un livre";
    addButton.classList.add("green-button"); // Ajoute la classe "green-button" au bouton
    addButton.addEventListener("click", function() {
      // Code à exécuter lorsque le bouton est cliqué
      console.log("Le bouton a été cliqué !");
      // Logique pour ajouter un livre à la liste
    var searchForm = document.createElement("div");
    searchForm.id = "searchForm";

    var inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.id = "bookTitle";
    inputTitle.placeholder = "Titre du livre";

    var inputAuthor = document.createElement("input");
    inputAuthor.type = "text";
    inputAuthor.id = "author";
    inputAuthor.placeholder = "Auteur";

    var searchButton = document.createElement("button");
    searchButton.textContent = "Rechercher";
    searchButton.id = "searchButton";

    searchForm.appendChild(inputTitle);
    searchForm.appendChild(inputAuthor);
    searchForm.appendChild(searchButton);

    addButton.parentNode.insertBefore(searchForm, addButton.nextSibling);

    searchForm.style.display = "block";
    });
  
    // Récupération de l'élément "Ma poch'liste"
    var maPochListe = document.querySelector("#content h2");
  
    // Récupération de l'élément "Poch'Lib"
    var pochLib = document.querySelector(".title");
  
    // Création de la balise <hr>
    var hrElement = document.createElement('hr');
  
    // Insérer le bouton "Ajouter un livre" après l'élément "Nouveau livre"
    maPochListe.parentNode.insertBefore(addButton, maPochListe.nextSibling);
  
    // Insérer la balise <hr> après le bouton "Ajouter un livre"
    maPochListe.parentNode.insertBefore(hrElement, addButton.nextSibling);
  
    // Déplacer l'élément "Ma poch'liste" à la fin
    maPochListe.parentNode.appendChild(maPochListe);
  
    // Appliquez des modifications à la balise <hr>
    hrElement.style.width = '80%';
    hrElement.style.margin = '20px auto';
  
    // Appliquez des styles à l'élément "Poch'Lib"
    pochLib.style.textAlign = 'center';
    pochLib.style.marginTop = '0'; // Supprimer la marge supérieure
  
    // Appliquez des styles au bouton "Ajouter un livre"
    addButton.style.marginTop = '20px'; // Ajouter une marge supérieure
  });
  