// Récupérer les données de la session actuelle
var sessionData = sessionStorage.getItem("pochliste");
var pochliste = sessionData ? JSON.parse(sessionData) : [];

// Vérifier si le livre est déjà présent dans la session
var existingBookInSession = pochliste.find(function(book) {
  return book.bookId === bookId;
});

/*if (existingBookInSession) {
  alert("Vous ne pouvez ajouter deux fois le même livre.");
  return;
}*/

// Ajouter le livre à la session
var bookData = {
  bookId: bookId,
  bookTitle: bookTitle
};

pochliste.push(bookData);

// Enregistrer les données mises à jour dans la session
sessionStorage.setItem("pochliste", JSON.stringify(pochliste));
