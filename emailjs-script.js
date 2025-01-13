// Importation de EmailJS
emailjs.init("e04ocnlIVutfrjKKJ");

window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // these IDs from the previous steps
        emailjs.sendForm('service_qlelsyl', 'template_9cwv4zk', this)
            .then(() => {
                console.log('SUCCESS!');
                
                // Fermer la modale après l'envoi du formulaire
                document.querySelector(".modal").style.display = "none";
                document.querySelector('#firstModal').style.display = 'none';
                
                // Réinitialiser le formulaire
                document.getElementById('contact-form').reset();
                alert('Votre message a bien été envoyé !');
            }, (error) => {
                console.log('FAILED...', error);
            });
    });
}