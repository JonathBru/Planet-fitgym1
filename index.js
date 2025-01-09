
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

const projects = await getProjects();// Récupère la liste des projets

//structure HTML des projets dans .gallery par "createElement"
export async function generateProjects(projects) {
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = '';// évite les doublons au rechargement de la page
    
    for (let i = 0; i < projects.length; i++) {
        
        const figure = projects[i];

        // Créer un lien vers la page spécifique au projet avec l'ID du projet comme paramètre d'URL
        const linkElement = document.createElement("a");
        linkElement.href = `photo.html?id=${figure.id}`;
        
        const projectElement = document.createElement("figure");
        
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = figure.title;
        
        divGallery.appendChild(linkElement);
        linkElement.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(nomElement);  
    };
};

//appel de la fonction generateProjects
generateProjects(projects);

//fonction asynchrone pour récupérer la liste des catégories depuis l'API
async function getCategories() {
    try{
        const response = await fetch('http://localhost:5679/api/categories');
        const categories = await response.json();
        return categories;
    }
    catch (error) {
        console.log("dans le catch");
        console.log(error);
    };
};


//Object Set pour stocker les boutons des catégories
const setCategory = new Set();

//propriété pour afficher tout les projets sur le bouton "Tous"
const allButton = document.querySelector("#allButton");
allButton.addEventListener("click", () => generateProjects(projects));

//propriétés pour filtrer les projets pour chaque boutons
function filterProjects(categoryId) {
    const filteredProjects = projects.filter((project) => {
        return project.categoryId === categoryId;
    });
    generateProjects(filteredProjects);
}

//Création des boutons pour les catégories renségnées par l'api
async function apiCategoryButtons() {
    const categories = await getCategories();
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener("click", () => filterProjects(category.id));
        setCategory.add(button);
    };
};

//Ajout des boutons au DOM
async function addButtons() {
    const buttonContainer = document.querySelector('.filters');
    await apiCategoryButtons();
    buttonContainer.append(...setCategory);
    
    //application des effets css au click sur les catégories
    const buttons = document.querySelectorAll(".filters button");
    
    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            buttons.forEach((button) => {
                button.classList.remove("clicked");
            });
            this.classList.add("clicked");
        });
    });
};
addButtons();







    