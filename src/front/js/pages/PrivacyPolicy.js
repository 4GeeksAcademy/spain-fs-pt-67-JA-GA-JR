import React from "react";
import "../../styles/privacyPolicy.css"

export const PrivacyPolicy = () => {
    const handleClose = () => { // Jorge -> esto es para manejar el cierre de la pestaña con el botón de "Entendido"
        window.close();
    }

    return (
        <div className="privacy-policy-container">
            <h1>Política de Privacidad y Protección de Datos</h1>
            <p>Última actualización: 16 de Agosto de 2024.</p>
            <h3>1.- Introducción:</h3>
            <p>
                Nos comprometemos a proteger su privacidad y a garantizar que su información
                personal esté protegida. Esta política de privacidad describe cómo recopilamos,
                usamos y compartimos sus datos personales cuando utiliza nuestros servicios.
            </p>
            <h3>2.- Datos que Recopilamos</h3>
            <p>
                Recopilamos diferentes tipos de información personal sobre usted, incluyendo, pero no
                limitado a su nombre, dirección de correo electrónico, número de teléfono y
                cualquier otra información que usted nos proporcione voluntariamente.
            </p>
            <h3>3.- Uso de su Información:</h3>
            <p>
                Utilizamos la información recopilada para brindarle nuestros servicios, mejorar la
                calidad de los mismos y cumplir con las obligaciones legales y contractuales.
            </p>
            <h3>4.- Compartir su Información:</h3>
            <p>
                No compartimos su información personal con terceros, excepto cuando sea necesario para
                cumplir con la ley o para proporcionarle nuestros servicios bajo estrictos términos de
                confidencialidad.
            </p>
            <h3>5.- Seguridad:</h3>
            <p>
                Implementamos medidas de seguridad adecuadas para proteger su información personal
                contra el acceso no autorizado, la alteración, divulgación o destrucción.
            </p>
            <h3>6.- Sus Derechos:</h3>
            <p>
                Usted tiene derecho a acceder, corregir y eliminar su información personal, así como a
                oponerse a su tratamiento. Puede ejercer estos derechos contactándonos a través de los
                medios proporcionados en nuestra página de contacto.
            </p>
            <h3>7.- Cambios en nuestras Políticas de Privacidad:</h3>
            <p>Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
                Le notificaremos sobre cualquier cambio importante mediante la publicación de la nueva política en nuestro sitio web.</p>
            <h3>8 y final.- Contacto:</h3>
            <p>
                Si tiene alguna pregunta sobre esta política de privacidad, puede ponerse en contacto con nosotros a través de soportekuentasklaras@gmail.com.
            </p>
            <h3>Muchas gracias por su atención de parte del equipo legal de KuentasKlaras.com</h3>
            <a href="#" className="btn-close-policy" onClick={handleClose}>¡Entendido!</a>
        </div>
    );
};
