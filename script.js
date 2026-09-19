// Vérifie si l'utilisateur est connecté
let estConnecte = localStorage.getItem("connecte");

// Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
if (estConnecte !== "oui") {
    window.location.href = "login.html";
}
// Récupère les objets sauvegardés dans le localStorage
// Si rien n'existe, on initialise un tableau vide
let objets = JSON.parse(localStorage.getItem("objets")) || [];
let editIndex = null; // l'indice du produit actuellement sélectionné pour modification sera dans cette variable

// Fonction pour ajouter un nouvel objet
function ajouterObjet() {
    // Récupère les champs input (nom,image,description,prix,localisation,email,telephone,categorie)
    let nomInput = document.getElementById("nomObjet");
    let imageInput = document.getElementById("imageObjet");
    let descriptionInput = document.getElementById("descriptionObjet");
    let prixInput = document.getElementById("prixObjet");
    let torcInput = document.getElementById("torcObjet");
    let localisationInput = document.getElementById("localisationObjet");
    let emailInput = document.getElementById("emailVendeur");
    let telephoneInput = document.getElementById("telephoneVendeur");
    let categorieInput = document.getElementById("categorie");

    // Vérifie si les champs essentiels sont vides
    if (nomInput.value === "" || imageInput.value === "" || descriptionInput.value === "" || prixInput.value === "" || torcInput.value === "" || localisationInput.value === "" || emailInput.value === "" || telephoneInput.value === "") {
        alert("Remplir tous les champs !");
        return;
    }
    // Ajoute un nouvel objet dans le tableau avec toutes les propriétés
    objets.push({
        nom: nomInput.value.trim(),
        image: imageInput.value.trim(),
        description: descriptionInput.value.trim(),
        prix: prixInput.value.trim(),
        torc: torcInput.value.trim(),
        localisation: localisationInput.value.trim(),
        emailVendeur: emailInput.value.trim(),
        telephoneVendeur: telephoneInput.value.trim(),
        categorie: categorieInput.value,
        likes: 0
    });

    // Met à jour l'affichage de la liste des objets
    afficherObjets();

    // Vide les champs après ajout
    nomInput.value = "";
    imageInput.value = "";
    descriptionInput.value = "";
    prixInput.value = "";
    torcInput.value = "";
    localisationInput.value = "";
    emailInput.value = "";
    telephoneInput.value = "";
    categorieInput.value = "Electronique";
    // Sauvegarde les données dans le localStorage
    sauvegarderObjets();

}
function creerCarteObjet(objet, index) {
    let li = document.createElement("li");
    let titre = document.createElement("p");
    titre.textContent = objet.nom;
    let img = document.createElement("img");
    img.src = objet.image;
    img.style.width = "100px";

    let bouton = document.createElement("button");
    bouton.textContent = "Supprimer";
    bouton.classList.add("supprimerbtn");
    bouton.onclick = (event) => {
        event.stopPropagation();
        supprimerObjet(index);
    };

    let editBtn = document.createElement("button");
    editBtn.textContent = "+";
    editBtn.classList.add("edit-item-btn");
    editBtn.title = "Modifier ce produit";
    editBtn.onclick = (event) => {
        event.stopPropagation();
        ouvrirEditeurProduit(index);
    };

    let boutonLike = document.createElement("button");
    boutonLike.classList.add("likebtn");

    if (objet.liked) {
        boutonLike.classList.add("liked");
    }

    boutonLike.innerHTML = `❤️ <span class="like-count">${objet.likes || 0}</span>`;
    boutonLike.title = "J'aime";

    boutonLike.onclick = (event) => {
        event.stopPropagation();
        ajouterLike(index);
    };

    li.onclick = () => afficherDetail(objet);

    let details = document.createElement("div");
    details.className = "objet-details";

    details.innerHTML = `
        <p>${objet.description || "aucune description"}</p>
        <p><strong>Prix :</strong> ${objet.prix ? objet.prix + " $" : "N/A"}</p>
        <p><strong>troc :</strong> ${objet.troc || "N/A"}</p>
        <p><strong>Localisation :</strong> ${objet.localisation || "N/A"}</p>
        <p><strong>Catégorie :</strong> ${objet.categorie || "N/A"}</p>
        <p><strong>Vendeur :</strong> ${objet.emailVendeur || "N/A"} / ${objet.telephoneVendeur || "N/A"}</p>
    `;

    let divButtons = document.createElement("div");
    divButtons.className = "buttons";
    divButtons.appendChild(boutonLike);

    const CentreControlPage = window.location.pathname.endsWith("centrecontrol.html");

    if (CentreControlPage) {
        divButtons.appendChild(bouton);
        li.appendChild(editBtn);
    }

    li.appendChild(titre);
    li.appendChild(img);
    li.appendChild(details);
    li.appendChild(divButtons);

    return li;
}
// Fonction pour afficher les objets dans la liste
function afficherObjets(categorie = null) {
    let liste = document.getElementById("listeObjets");
    if (!liste) {
        return;
    }
    let recherche = "";
    let champRecherche = document.getElementById("recherche");
    if (champRecherche) {
        recherche = champRecherche.value.toLowerCase();
    }
    liste.innerHTML = "";
    objets.forEach((objet, index) => {
        if (categorie && objet.categorie !== categorie) {
            return;
        }
        if (!objet.nom.toLowerCase().includes(recherche)) {
            return;
        }
        liste.appendChild(creerCarteObjet(objet, index));
    });
}

function remplirFormulaireEdition(index) {
    // Charge les valeurs du produit sélectionné dans le formulaire d'édition
    if (index === null || index < 0 || index >= objets.length) {
        return;
    }

    let objet = objets[index]; //   récupère l’élément du tableau objets à la position index et le stocke dans une variable locale objet
    editIndex = index;

    document.getElementById("editNom").value = objet.nom || "";
    document.getElementById("editImage").value = objet.image || "";
    document.getElementById("editDescription").value = objet.description || "";
    document.getElementById("editPrix").value = objet.prix || "";
    document.getElementById("edittroc").value = objet.troc || "";
    document.getElementById("editLocalisation").value = objet.localisation || "";
    document.getElementById("editEmail").value = objet.emailVendeur || "";
    document.getElementById("editTelephone").value = objet.telephoneVendeur || "";
    
}
function ouvrirEditeurProduit() {
    let model = document.getElementById("editProductModal");
    let select = document.getElementById("editProductSelect");

    select.innerHTML = "";

    for (let i = 0; i < objets.length; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = objets[i].nom;
        select.appendChild(option);
    }

    remplirFormulaireEdition(0);

    model.classList.remove("hidden");
}
function fermerEditeurProduit() {
    // Cache le model d'édition
    let model = document.getElementById("editProductModal");
    if (model) {
        model.classList.add("hidden");
    }
}

function sauverProduitModifie() {
    // Enregistre les modifications du produit sélectionné
    if (editIndex === null || editIndex < 0 || editIndex >= objets.length) {
        return;
    }

    let objet = objets[editIndex];
    objet.nom = document.getElementById("editNom").value.trim() || objet.nom;
    objet.image = document.getElementById("editImage").value.trim() || objet.image;
    objet.description = document.getElementById("editDescription").value.trim() || objet.description;
    objet.prix = document.getElementById("editPrix").value.trim() || objet.prix;
    objet.troc = document.getElementById("edittroc").value.trim() || objet.troc;
    objet.localisation = document.getElementById("editLocalisation").value.trim() || objet.localisation;
    objet.emailVendeur = document.getElementById("editEmail").value.trim() || objet.emailVendeur;
    objet.telephoneVendeur = document.getElementById("editTelephone").value.trim() || objet.telephoneVendeur;

    sauvegarderObjets();
    afficherObjets();
    fermerEditeurProduit();
}

function initialiserEditeurProduit() {
    let select = document.getElementById("editProductSelect");
    let saveBtn = document.getElementById("saveProductChanges");
    let closeBtn = document.getElementById("closeEditModal");

    if (select) {
        select.addEventListener("change", function () {
            remplirFormulaireEdition(this.value);
        });
    }

    saveBtn.addEventListener("click", sauverProduitModifie);
    closeBtn.addEventListener("click", fermerEditeurProduit);
}
function afficherFavoris() {
    let liste = document.getElementById("listeObjetsFav");
    if (!liste) {
        return;
    }
    liste.innerHTML = "";
    let favorisTrouves = false;
    objets.forEach((objet, index) => {
        if (objet.liked) {
            favorisTrouves = true;
            liste.appendChild(creerCarteObjet(objet, index));
        }
    });
    if (!favorisTrouves) {
        liste.innerHTML = '<p class="messagevide">Aucun favori pour le moment.</p>';
    }
}

// Fonction pour afficher les détails d'un objet
// Affiche le panneau de détail produit pour l'objet cliqué
function afficherDetail(objet) {
    // Récupère l'élément HTML qui contient toute la zone de détail du produit
    let detail = document.getElementById("produitDetail");
    // Récupère la partie texte dans la zone de détail
    let detailText = detail.querySelector(".detail-text");
    // Récupère la partie image dans la zone de détail
    let detailImage = detail.querySelector(".detail-image");

    // Remplit le contenu texte et l'image du produit
    detailText.innerHTML = `
       <!-- Affiche le nom du produit dans un titre-->       
        <h2>${objet.nom}</h2>
      <!--Affiche la description du produit Si la description n'existe pas, affiche une chaîne vide -->
        <p>${objet.description || "aucune description disponible"}</p>
      <!-- Affiche le prix du produit Si le prix existe → ajoute "$" Sinon affiche "N/A" -->
        <p><strong>Prix :</strong> ${objet.prix ? objet.prix + "$" : "N/A"}</p>
      <!-- Affiche la possibilité de troc contre -->
        <p><strong>Troc :</strong> ${objet.troc || "N/A"}</p>
      <!-- Affiche la localisation du produit Si elle n'existe pas → affiche "N/A" -->
        <p><strong>Localisation :</strong> ${objet.localisation || "N/A"}</p>
      <!-- Affiche la catégorie du produit Si elle n'existe pas → affiche "N/A" -->
        <p><strong>Catégorie :</strong> ${objet.categorie || "N/A"}</p>
      <!-- Affiche l'email du vendeur -->
        <p><strong>Vendeur :</strong> ${objet.emailVendeur || "N/A"}</p>
      <!-- Affiche le numéro de téléphone du vendeur -->
        <p><strong>Téléphone :</strong> ${objet.telephoneVendeur || "N/A"}</p>
    `;
     // Insère l'image du produit dans la zone image    
    detailImage.innerHTML = `<img src="${objet.image}" alt="${objet.nom}">`;
     // Retire la classe "hidden" pour rendre la zone visible
    detail.classList.remove("hidden");
      // Fait défiler la page automatiquement jusqu'à la section détail
     // "smooth" rend le déplacement fluide
    detail.scrollIntoView({ behavior: "smooth" });
}

// Masque la section de détail produit
function masquerDetail() {
    // Ajoute la classe "hidden" à l'élément ayant l'id "produitDetail"
    // Cela permet de cacher la section des détails du produit
    document.getElementById("produitDetail").classList.add("hidden");
}

function supprimerObjet(index) {
     // Supprime l'objet du tableau
    objets.splice(index, 1);
     // Sauvegarde les changements
    sauvegarderObjets();
     // Met à jour l'affichage
    afficherObjets();
}
// Fonction pour sauvegarderBtn les objets dans le localStorage
function sauvegarderObjets() {
    localStorage.setItem("objets", JSON.stringify(objets));
} 

// Ajoute ou retire un like pour un objet
function ajouterLike(index) {
    // Si l'objet n'est pas encore liké
    if (!objets[index].liked) {
        objets[index].likes++; // augmente le compteur
        objets[index].liked = true;// marque comme liké
    } else {
        objets[index].likes--; // diminue le compteur
        objets[index].liked = false;// enlève le like
    }
     // Sauvegarde et met à jour l'affichage
    sauvegarderObjets();
    afficherObjets();
}
// Fonction de déconnexion
function déconnexion() {
     // Supprime l'état de connexion
    localStorage.removeItem("connecte");
     // Redirige vers la page de login
    window.location.href = "login.html";
}
function Deposerannonce() {
    // Redirige vers la page de login
    window.location.href = "dépotobjet.html";
}
function centredecontrol(){
    window.location.href = "centrecontrol.html";
}
// Lance l'affichage des objets au chargement de la page
afficherObjets();
initialiserEditeurProduit();