
// Fonction qui récupère la liste des employés de l'API 
function getListEmployee() {

  // Récupère le corps du tableau
  // et réinitialise son HTML pour éviter de dupliquer la liste
  const listEmployee = document.getElementById("listEmployee");
  listEmployee.innerHTML = "";

  // Création et préparation de la requête pour récupèrer la liste des employés
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees",
    true
  );

  // Gestion de la réponse de la requête
  xhttp.onreadystatechange = function () {

    // Si la requête s'est bien passée
    if (this.readyState == 4 && this.status == 200) {

      // Convertis la réponse de la requête en JSON
      let listEmployeeJSON = JSON.parse(this.responseText);

      console.log(listEmployeeJSON);
      // Boucle qui récupére chaque employé du JSON
      listEmployeeJSON.forEach((employee) => {

        // Créer une nouvelle ligne pour le tableau
        let newRow = document.createElement("tr");

        // Boucle qui récupère les informations d'un employé
        for (const information in employee) {

          // Récupére les informations voulues (obligé car des modifications d'employés bizarres ont été faites)
          if (information == "name" || information == "last_name" || information == "job_title"
                      || information == "email" || information == "id") {
            
            // Créer une cellule, injecte l'information dedans et insère la cellule dans la ligne
            let newInformation = document.createElement("td");
            newInformation.innerText = employee[information];
            newRow.append(newInformation);
          }
        }

        // Créer un bouton pour modifier les informations de l'employé
        let modifButton = document.createElement("button");
        modifButton.type = "button";
        modifButton.innerText = "Modifier";
        modifButton.className ="btn btn-secondary";
        modifButton.addEventListener("click", () => {
            getEmployee(employee["id"]);
        });

        // Créer un bouton pour supprimer l'employé
        let supprButton = document.createElement("button");
        supprButton.type = "button";
        supprButton.innerText = "Supprimer";
        supprButton.className = "btn btn-danger mt-2";
        supprButton.addEventListener("click", () => {
          deleteEmployee(employee);
        });

        // Créer une cellule pour contenir les deux boutons
        let buttons = document.createElement("td");
        let buttonContainer = document.createElement("div");
        buttonContainer.className = "row p-2"
        
        buttonContainer.append(modifButton);
        buttonContainer.append(supprButton);

        buttons.append(buttonContainer);

        // Insère la cellule des boutons dans la ligne
        newRow.append(buttons);

        // Insère la ligne dans le tableau
        listEmployee.append(newRow);
      });
    } else {

      // Si la requête s'est mal passée 
      if (this.readyState == 4 && this.status != 200) {

        // récupère le body du HTML
        const htmlBody = document.getElementById("body");

        // Réinitialise le body
        htmlBody.innerHTML = "";

        // Affiche une image d'erreur
        let errorImage = document.createElement("img");
        errorImage.src = "./images/404error.png";

        // Affiche un texte d'erreur
        let errorMessage = document.createElement("h1");
        errorMessage.innerText = "Server might actually be down !!! Try again later !!!";

        // Insère l'image et le texte d'erreur dans le body
        htmlBody.append(errorImage);
        htmlBody.append(errorMessage);

      }
    }
  };

  // Envoi de la requête à l'API
  xhttp.send();
}

// Récupération de la liste des employés au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    getListEmployee();
});

// Récupère la modale
let modal = document.getElementById("myModal");

// Récupère le bouton qui ouvre la modale pour ajouter un employé
let addEmployeeBtn = document.getElementById("addEmployee");

// Récupère l'élément (le "X" en haut à droite) qui sert à fermer la modale
let closeModalBtn = document.getElementsByClassName("close")[0];

// Récupère le contenu de la modale
let modalContent = document.getElementsByClassName("modalContent")[0];

// Ferme la modale lors d'un clic sur le "X" en haut à droite
closeModalBtn.onclick = function () {
  modal.style.display = "none";
};

// Ferme la modale lors d'un clic en dehors de la modale
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Evénement qui adapte la modale et l'affiche
addEmployeeBtn.addEventListener("click", () => {

  // Réinitialise les inputs
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("jobTitle").value = "";
  document.getElementById("email").value = "";

  // Récupère et modifie le titre
  let title = document.getElementById("title");
  title.innerText = "Informations du nouvel employé";

  // Vérifie si un bouton "Ajouter" existe et le supprime si c'est le cas
  // pour éviter de le dupliquer
  let addButton = document.getElementById("addButton");
  if (addButton != null) {
    addButton.remove();
  }

  // Vérifie si un bouton "Valider" existe et le supprime si c'est le cas 
  let validateButton = document.getElementById("validateButton");
  if (validateButton != null) {
    validateButton.remove();
  }

  // Créer un bouton "Ajouter" et l'insère dans la modale
  const addButtonContainer = document.createElement("div");
  addButtonContainer.className ="row p-2"

  addButton = document.createElement("button");
  addButton.setAttribute("type", "button");
  addButton.innerText = "Ajouter";
  addButton.id = "addButton";
  addButton.className = "btn btn-primary fs-4";
  addButton.addEventListener("click", () => {
    createNewEmployee();
  });

  addButtonContainer.append(addButton);
  modalContent.append(addButtonContainer);

  // Affiche la modale
  modal.style.display = "block";
});

// Fonction qui insère un nouvel employé dans l'API
function createNewEmployee() {

  // Récupère les informations rentrées dans le formulaire
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let jobTitle = document.getElementById("jobTitle").value;
  let email = document.getElementById("email").value;

  // Vérifie que tout les champs sont valorisés
  if (firstName != "" && lastName != "" && jobTitle != "" && email != "") {

    // Définition des patterns pour vérifier le format des inputs
    let emailInputPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$/;

    // Préparation du message d'erreur
    let errorInput = "";

    // Vérifie que chaque input est conforme au pattern et concatène un string dans le message d'erreur
    if(!emailInputPattern.test(email)) {
      errorInput += "- Email invalide. Ex : monAdresse@email.com !\n";
    }

    // Si le message d'erreur est vide
    if (errorInput == "") {

      // Création et préparation de la requête pour l'insertion d'un employé
      const xhttp = new XMLHttpRequest();
      xhttp.open(
        "POST",
        "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees",
        true
      );
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
      // Gestion de la réponse de la requête
      xhttp.onreadystatechange = function () {
  
        // Si la requête s'est bien passée
        if (this.readyState == 4 && this.status == 201) {
  
          // Signale que l'insertion s'est bien passée
          alert("Employé inséré avec succès !!");
  
          // Ferme la modale 
          modal.style.display = "none";
  
          // Rafraichit la liste d'employés
          getListEmployee();
        } else {
          // Si la requête s'est mal passée
          if (this.readyState == 4 && this.status != 201) {
            // Signale que l'insertion a échoué
            alert("L'insertion a échoué ! Vérifiez les informations renseignées ou bien réessayez plus tard !")
          }
        }
      };
      
      // Envoi de la requête avec les information à insérer à l'API
      xhttp.send(
        "name=" + firstName + "&last_name=" +
          lastName + "&job_title=" + jobTitle +
          "&email=" + email
      );

    // Si les inputs ne sont pas conformes à leur pattern
    } else {

      // Affiche le message d'erreur
      alert(errorInput);
    }
  // Si des inputs ne sont pas valorisés
  } else {
    // Affiche un message d'erreur
    alert("Tout les champs doivent être renseignés !! ");
  }
}

// Fonction qui supprime un employé en utilisant son identifiant dans l'API
function deleteEmployee(employee) {

  // Demande de confirmation avant suppression
  let confirmMessage = "Êtes-vous sûr de vouloir supprimer l'employé N°" + employee["id"] + " ?\n\n";
  confirmMessage += "Informations : \n\n";
  confirmMessage += "- Prénom : " + employee["name"] + "\n";
  confirmMessage += "- Nom : " + employee["last_name"] + "\n";
  confirmMessage += "- Poste : " + employee["job_title"] + "\n";
  confirmMessage += "- Email : " + employee["email"] + "\n";

  if (confirm(confirmMessage)) {
   
    // Création et préparation de la requête pour la suppression d'un employé
    const xhttp = new XMLHttpRequest();
    xhttp.open(
      "DELETE",
      "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/" + employee["id"],
      true
    );
  
    // Gestion de la réponse de la requête
    xhttp.onreadystatechange = function () {
  
      // Si la requête s'est bien passée
      if (this.readyState == 4 && this.status == 200) {
  
        // Signale que la suppression s'est bien passée
        alert("Employee N°" + employee["id"] + " has been successfully deleted !!");
  
        // Rafraichit la liste
        getListEmployee();
      } else {
  
        // Si la requête s'est mal passée
        if (this.readyState == 4 && this.status != 200) {
          
          // Signale que la suppression a échoué
          alert("Employee N°" + employee["id"] + " has been successfully deleted !!");
        }
      }
    };
  
    // Envoi de la requête à l'API
    xhttp.send();
  } 
}

// Fonction qui récupère un employé en particulier dans l'API
function getEmployee(id) {
  
  // Récupère et modifie le titre de la modale
  let title = document.getElementById("title");
  title.innerText = "Information de l'employé N°" + id;

  // Vérifie si un bouton "Ajouter" existe et le supprime si c'est le cas
  let addButton = document.getElementById("addButton");
  if (addButton != null) {
      addButton.remove();
  }

  // Vérifie si un bouton "Valider" existe et le supprime si c'est le cas 
  // pour éviter de le dupliquer
  let validateButton = document.getElementById("validateButton");
  if (validateButton != null) {
      validateButton.remove();
  }

  // Créer un bouton "Valider" et l'insère dans la modale
  const validateButtonContainer = document.createElement("div");
  validateButtonContainer.className ="row p-2"

  validateButton = document.createElement("button");
  validateButton.setAttribute("type", "button");
  validateButton.innerText = "Valider";
  validateButton.id = "validateButton";
  validateButton.className = "btn btn-primary fs-4";
  validateButton.addEventListener("click", () => {
      updateEmployee(id);
  });

  validateButtonContainer.append(validateButton);
  modalContent.append(validateButtonContainer);

  // Création et préparation de la requête pour la récupération d'un employé
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/" + id,
    true
  );

  // Gestion de la réponse de la requête
  xhttp.onreadystatechange = function () {

    // Si la requête s'est bien passée
    if (this.readyState == 4 && this.status == 200) {
      
      // Convertis la réponse de la requête en JSON
      let emp = JSON.parse(this.responseText);

      // Récupère les inputs du formulaire
      let fnameInput = document.getElementById("firstName");
      let lnameInput = document.getElementById("lastName");
      let jobtitleInput = document.getElementById("jobTitle");
      let emailInput = document.getElementById("email");

      // Insère les informations de l'employé dans les inputs
      fnameInput.value = emp.name;
      lnameInput.value = emp.last_name;
      jobtitleInput.value = emp.job_title;
      emailInput.value = emp.email;

      // Affiche la modale
      modal.style.display = "block";
        
    } else {

      // Si la requête s'est mal passée
      if (this.readyState == 4 && this.status != 200) {

        // Signale que la récupération de l'employé a échoué
        alert("L'employé N°" + id + " n'existe pas ! Il est possible qu'il ait été supprimé !  Veuillez rafraichir la liste !")
      }
    }
  }
  
  // Envoi de la requête à l'API
  xhttp.send();
}

// Fonction qui met à jour les informations d'un employé en particulier dans l'API
function updateEmployee(id) {

  // Récupère les informations des inputs
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let jobTitle = document.getElementById("jobTitle").value;
  let email = document.getElementById("email").value;

  // Vérifie que tout les champs sont valorisés
  if (firstName != "" && lastName != "" && jobTitle != "" && email != "") {

    // Définition des patterns pour vérifier le format des inputs
    let emailInputPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$/;

    // Préparation du message d'erreur
    let errorInput = "";

    // Vérifie que chaque input est conforme au pattern et concatène un string dans le message d'erreur
    if(!emailInputPattern.test(email)) {
      errorInput += "- Email invalide. Ex : monAdresse@email.com !\n";
    }

    // Si le message d'erreur est vide
    if (errorInput == "") {

      // Création et préparation de la requête pour modifier un employé
      const xhttp = new XMLHttpRequest();
      xhttp.open(
        "PUT",
        "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/" + id,
        true
      );
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      // Gestion de la réponse de la requête
      xhttp.onreadystatechange = function () {

        // Si la requête s'est bien passée
        if (this.readyState == 4 && this.status == 200) {

          // Signale que la modification s'est bien passée
          alert("Mise à jour de l'employé N°" + id + " réussie !!");

          // Ferme la modale 
          modal.style.display = "none";

          // Rafraichit la liste d'employés
          getListEmployee();
        } else {

          // Si la requête s'est mal passée
          if (this.readyState == 4 && this.status != 200) {

            // Signale que la modification a échoué
            alert("La modification a échoué ! Il se peut que l'employé ait été supprimé ! Veuillez rafraichir la liste !");
          }
        }
      };
      
      // Envoi de la requête avec les information à insérer à l'API
      xhttp.send(
        "name=" + firstName + "&last_name=" +
        lastName + "&job_title=" + jobTitle +
          "&email=" + email
      );

    // Si les inputs ne sont pas conformes à leur pattern
    } else {

      // Affiche le message d'erreur
      alert(errorInput);
    }
  // Si des inputs ne sont pas valorisés
  } else {

    // Affiche un message d'erreur
    alert("Tout les champs doivent être renseignés !! ");
  }
}

// Récupère le bouton pour remonter en haut de la page
let backToTopButton = document.getElementById("backToTop");

// Ramène en haut de la page
function backToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Affiche le bouton quand on scroll 100px vers le bas sinon le cache 
function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
}

window.onscroll = function() {scrollFunction()};