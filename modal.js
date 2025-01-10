

//fonction pour ouvrir la modale et fermer la modale sur les boutons associés //
async function openModal1() {
    //pointage sur les différents éléments liés à l'ouverture de la première modale//
    const modal = document.querySelector(".modal");
    const openModaleButton = document.querySelector("#modalOpener");
    //pointage sur l'icone de fermeture de la modale//
    const closeModalIcon = document.querySelectorAll(".fa-xmark");

    openModaleButton.addEventListener("click",() => {
        modal.style.display = "flex";
        document.querySelector('#firstModal').style.display = 'flex';
    });
    const addWorkModal = document.querySelector("#secondModal");
    closeModalIcon.forEach((crossIcon) => {
        crossIcon.addEventListener("click", () => {
            modal.style.display = "none";
            addWorkModal.style.display = "none";
        });
    });

    //fermer la modale en cliquant en dehors de la modale //
    modal.addEventListener("click", (event) => {
        if (!event.target.closest("#firstModal") && !event.target.closest("#secondModal")) {
        modal.style.display = "none";
        addWorkModal.style.display = "none";
        };
    });
};

openModal1();

//récupération des projets dynamiquement via l'api
async function getProjects() {
    try {
        const response = await fetch("http://localhost:5679/api/works");
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.log("dans le catch");
        console.log(error);
    }
}

const projects = await getProjects();

//ajout des projets à la liste de la modale //
async function generateModalProjects(projects) {
    const modalGallery = document.querySelector(".modalGallery");
    modalGallery.innerHTML = "";

    for (let i = 0; i < projects.length; i++) {

        const figure = projects[i];



        const projectElement = document.createElement("figure");
        projectElement.setAttribute("data-id", figure.id);

        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        //attribut alt pour voir le nom du projet dans la console //
        imageElement.alt = figure.title;

        //création des icônes corbeille et croix-fléchée //
        const arrowButton = document.createElement("button");
        arrowButton.classList.add("arrowButton");
        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fa-solid", "fa-up-down-left-right");

        const trashButton = document.createElement("button");
        trashButton.classList.add("trashButton");
        trashButton.setAttribute('id', projects[i].id);
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");

        

        modalGallery.appendChild(projectElement);

        projectElement.appendChild(imageElement);

        projectElement.appendChild(arrowButton);
        arrowButton.appendChild(arrowIcon);

        projectElement.appendChild(trashButton);
        trashButton.appendChild(trashIcon);
        
    };
    //await setupModalSortable(modalGallery, projects, generateProjects);
};
generateModalProjects(projects);

/* fonction pour réagencer la gallery grace à la modale
async function setupModalSortable(modalGallery, projects, generateProjects) {
    const sortable = await Sortable.create(modalGallery, {
        draggable: "figure",
        handle: ".arrowButton",
        onEnd: () => {
            const newProjects = [];
            const modalFigures = modalGallery.querySelectorAll("figure");
            modalFigures.forEach((modalFigure) => {
                const projectId = parseInt(modalFigure.getAttribute("data-id"));
                const project = projects.find((project) => project.id === projectId);
                if (project) {
                    newProjects.push(project);
                }
            });
            const gallery = document.querySelector('.gallery');
            gallery.innerHTML = '';
            newProjects.forEach((project) => {
                const projectElement = generateProjects(project);
                gallery.appendChild(projectElement);
            });
        },
    });
}*/

// Stocker une référence au bouton actuellement actif
let activeButton = null;

//afficher la croix directionnelle au clic sur le projet
const projectElements = document.querySelectorAll("figure");
projectElements.forEach((projectElement) => {
    projectElement.addEventListener("click", () => {
        // Supprimer la classe 'active' de tous les éléments de flèche
        const arrowButtons = projectElement.querySelectorAll(".arrowButton");
        arrowButtons.forEach((arrowButton) => {
        arrowButton.classList.remove("active");
        });
        // Ajouter la classe 'active' à l'élément de flèche correspondant
        const arrowButton = projectElement.querySelector(".arrowButton");
        arrowButton.classList.add("active");
        // Retirer la classe 'active' de l'ancien bouton actif
        if (activeButton !== null && activeButton !== arrowButton) {
        activeButton.classList.remove("active");
      }
      // Mettre à jour le bouton actif
      activeButton = arrowButton;
    });
});

//fonction pour faire fonctionner les trashButtons //
function deleteProject() {
    const deleteButton = document.querySelectorAll(".trashButton");
    deleteButton.forEach((button) => {
        button.addEventListener("click", async (event) =>{
            event.preventDefault();
            const id = button.getAttribute("id");
            const deleteResponse = await fetch("http://localhost:5679/api/works/" + id, {

                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
               }); 
            if (deleteResponse.ok) {
                let deleteResponseWork = await fetch("http://localhost:5679/api/works/");
                let projects = await deleteResponseWork.json();
                //on appelle les fonction pour afficher les projets nouvellement mis à jours dynamiquement //
                generateProjects(projects);
                generateModalProjects(projects);
                deleteProject();
                 }
            else {
                    alert ("Erreur");
            };
           });
    });
};
deleteProject();


const addWorkButton = document.querySelector(".addWorkButton");

//fonction 'click' pour passer à la modale suivante //
addWorkButton.addEventListener("click", () => {
    const addWorkModal = document.querySelector("#secondModal");

    document.querySelector("#firstModal").style.display = "none";

    addWorkModal.style.display = "flex"
});

//fonction pour supprimer tout les projets //
const deleteAllButton = document.querySelector(".deleteGallery");
deleteAllButton.addEventListener("click", async () =>{
    if (confirm("Voulez-vous vraiment supprimer tous les projets ?")) {
        let responseprojects = await fetch("http://localhost:5679/api/works/");
        let projects = await responseprojects.json();
        for (const project of projects) {
            let id = project.id

            try {
                const deleteResponse = await fetch("http://localhost:5679/api/works/" + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' :'Bearer ' + localStorage.getItem("token")
                    }
                });
                if (deleteResponse.ok) {
                    let deleteResponseAll = await fetch('http://localhost:5679/api/works/');
                    let deletedWorks = await deleteResponseAll.json();
                    generateProjects(deletedWorks);
                    generateModalProjects(deletedWorks);
                };
            }
            catch (error) {
                console.log(`Error deleting project with id ${id}: ${error}`);
            }
        };
        alert("Toutes les données ont été supprimées.");
    };    
});

//modale 2 //
//pointage sur la flèche de retour à la première modale //
const returnButton = document.querySelector(".fa-arrow-left-long");

returnButton.addEventListener("click", () => {
    document.querySelector("#secondModal").style.display = "none"
    document.querySelector("#firstModal").style.display = "flex"
});

//récupération du formulaire

let image = document.getElementById('image');
let title = document.getElementById('title');
let category = document.getElementById('category');
let submit = document.getElementById('submit');


// changer la couleur du Submit si le formulaire est rempli
const enableButton = () => {
    if (image.value !== '' && title.value !== '' && category.value !== '') {
        submit.style.backgroundColor = '#1D6154';
    }
};

image.addEventListener('change', enableButton);
title.addEventListener('change', enableButton);
category.addEventListener('change', enableButton);

// Apercu de la photo du projets avant émission
image.addEventListener('change', () => {
    let file = image.files[0];
    document.querySelector('.pictureUpload').style.background = '#E8F1F7 center / contain no-repeat url(' + URL.createObjectURL(file) + ')';

    document.querySelector('.fa-image').style.display = "none";
    document.querySelector('.labelWork').style.display = "none";
    document.querySelector('.uploadType').style.display = "none";
});

//Fonction pour faire correspondre l'id de la catégorie à l'option choisie
const getIdCategory = async (category) => {
    try {
        const response = await fetch('http://localhost:5679/api/categories');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == category) {
                return data[i].id;
            }
        }
        throw new Error("Catégorie invalide");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

//Envoi du formulaire à l'API
submit.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!title || !category.value || !image) {
        alert("Veuillez remplir tous les champs !");
        return;
    };

    let formData = new FormData();

    formData.append('image', image.files[0]);
    formData.append('title', title.value);

    let categoryID = await getIdCategory(category.value);
    if (!categoryID) {
        alert('Catégorie invalide');
        return;
      }
    //Ajout de l'ID de la catégorie
    formData.append('category', categoryID);

    const response = await fetch('http://localhost:5679/api/works', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
        },
        body: formData
        })
        .then((response) => {
            if (response.status == 201) {      
                // éviter de devoir actualiser en effectuant un rechargement dynamique
                const refreshProject = async () => {
                    let responseWorks = await fetch('http://localhost:5679/api/works/');
                    let works = await responseWorks.json();
                    generateProjects(works);
                    generateModalProjects(works);       
                    deleteProject();
                }

                refreshProject();

                //nettoyer le formulaire d'envoi
                document.getElementById('modalForm').reset()
                document.querySelector('.pictureUpload').style.background = '#E8F1F7';
                document.querySelector('.fa-image').style.display = 'inline-block';
                document.querySelector('.labelWork').style.display = 'flex';
                document.querySelector('.uploadType').style.display = 'block';
                let image = document.getElementById('image');
                if (image.files && image.files[0]) {
                   image.files[0] = null;
                   image.value = '';
            }
        }else {
            alert(`Erreur lors de l'envoi du formulaire`);
        }
    });
});

