

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
    closeModalIcon.forEach((crossIcon) => {
        crossIcon.addEventListener("click", () => {
            modal.style.display = "none";
        });
    });

    //fermer la modale en cliquant en dehors de la modale //
    modal.addEventListener("click", (event) => {
        if (!event.target.closest("#firstModal")) {
        modal.style.display = "none";
        };
    });
};

openModal1();