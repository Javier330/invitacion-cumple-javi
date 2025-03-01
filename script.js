document.addEventListener("DOMContentLoaded", function () {
    const introScreen = document.querySelector(".screen.intro");
    const mainScreen = document.getElementById("main");
    const menuScreen = document.getElementById("menu");
    const confirmScreen = document.getElementById("confirm");
    const menuButton = document.getElementById("menuButton");
    const confirmButton = document.getElementById("confirmButton");
    const confirmForm = document.getElementById("confirmForm");

    // Inicializa EmailJS con la nueva versión
    emailjs.init("pe0HH4JvV48GzrFjn");

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
        document.getElementById("notAttend").checked = false;
    });

    document.getElementById("notAttend").addEventListener("change", function () {
        document.getElementById("attend").checked = false;
        document.getElementById("stayOption").classList.add("hidden");
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

    // Enviar formulario con EmailJS y guardar en Google Sheets
    confirmForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const attend = document.getElementById("attend").checked;
        const notAttend = document.getElementById("notAttend").checked;
        const stay = document.getElementById("stay")?.checked || false;
        const message = document.getElementById("message").value;

        if (!name || (!attend && !notAttend)) {
            alert("Por favor, selecciona tu nombre y si asistirás o no.");
            return;
        }

        const data = {
            nombre: name,
            asistencia: attend ? "Sí asisto" : "No asisto",
            se_queda: stay ? "Sí" : "No",
            mensaje: message
        };

        // Enviar con EmailJS
        emailjs.send("service_iapile1", "template_7zo7f0w", data)
            .then(() => {
                alert("Confirmación enviada correctamente.");
                confirmScreen.classList.add("hidden");
                document.body.innerHTML = attend
                    ? "<h2>¡Gracias por asistir!</h2><button onclick='addToCalendar()'>Agregar al calendario</button>"
                    : "<h2>Lamentamos que no puedas asistir, pero ya iremos hablando.</h2>";
            })
            .catch(error => {
                alert("Error al enviar confirmación por EmailJS: " + JSON.stringify(error));
            });

        // Enviar a Google Sheets
        fetch("https://script.google.com/macros/s/AKfycbyLgpwCGy5fnM3zSUKXrKuwVnO36_KXgup1kWQQiBVoJXWPczP_vMMkD4KpL69ygOvG/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(response => response.text())
        .then(result => {
            console.log("Datos guardados en Google Sheets: " + result);
        }).catch(error => {
            console.error("Error al guardar en Google Sheets: " + error);
        });
    });
});
