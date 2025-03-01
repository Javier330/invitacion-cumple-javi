document.addEventListener("DOMContentLoaded", function () {
    const introScreen = document.querySelector(".screen.intro");
    const mainScreen = document.getElementById("main");
    const menuScreen = document.getElementById("menu");
    const confirmScreen = document.getElementById("confirm");
    const menuButton = document.getElementById("menuButton");
    const confirmButton = document.getElementById("confirmButton");
    const confirmForm = document.getElementById("confirmForm");

    // Animación de inicio al hacer clic en la pantalla
    introScreen.addEventListener("click", function () {
        introScreen.classList.add("hidden");
        mainScreen.classList.remove("hidden");
    });

    // Cambiar a pantalla del menú
    menuButton.addEventListener("click", function () {
        mainScreen.classList.add("hidden");
        menuScreen.classList.remove("hidden");
    });

    // Cambiar a pantalla de confirmación
    confirmButton.addEventListener("click", function () {
        menuScreen.classList.add("hidden");
        confirmScreen.classList.remove("hidden");
    });

    // Control de selección de asistencia
    document.getElementById("attend").addEventListener("change", function () {
        document.getElementById("stayOption").classList.toggle("hidden", !this.checked);
    });

    document.getElementById("notAttend").addEventListener("change", function () {
        if (this.checked) {
            document.getElementById("attend").checked = false;
            document.getElementById("stayOption").classList.add("hidden");
        }
    });

    document.getElementById("attend").addEventListener("change", function () {
        if (this.checked) {
            document.getElementById("notAttend").checked = false;
        }
    });

    // Temporizador de cuenta regresiva
    function countdown() {
        const eventDate = new Date("May 10, 2025 00:00:00").getTime();
        const countdownElement = document.getElementById("countdown");

        setInterval(function () {
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    }
    countdown();

    // Enviar formulario con EmailJS
    confirmForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const attend = document.getElementById("attend").checked;
        const notAttend = document.getElementById("notAttend").checked;
        const stay = document.getElementById("stay").checked;
        const message = document.getElementById("message").value;
        
        if (!name || (!attend && !notAttend)) {
            alert("Por favor, selecciona tu nombre y si asistirás o no.");
            return;
        }

        emailjs.send(andreumatasjavi@gmail.com {
            nombre: name,
            asistencia: attend ? "Sí asisto" : "No asisto",
            se_queda: stay ? "Sí" : "No",
            mensaje: message
        }).then(function () {
            alert("Confirmación enviada");
            confirmScreen.classList.add("hidden");
            if (attend) {
                document.body.innerHTML = "<h2>¡Gracias por asistir!</h2><button onclick='addToCalendar()'>Agregar al calendario</button>";
            } else {
                document.body.innerHTML = "<h2>Lamentamos que no puedas asistir, pero ya iremos hablando.</h2>";
            }
        }, function (error) {
            alert("Error al enviar confirmación: " + error);
        });
    });
});
