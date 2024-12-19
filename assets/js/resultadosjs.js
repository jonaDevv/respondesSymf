window.addEventListener('load', function () {

    const opcionesSpans = document.querySelectorAll('span[data-opcion]');
    const responderBtn = document.querySelector('.responder-btn');
    var preguntaIDD = null;
    


    document.querySelectorAll('.opciones').forEach(opciones => {
        preguntaIDD = opciones.getAttribute('data-pregunta-id');
        
        console.log('Pregunta ID:', preguntaIDD);
       
    });
    
    // Declarar las variables fuera del alcance de los eventos
    let opcionSeleccionada = null;
    let textoOpcion = null;
    let preguntaId = null; 
    let usuarioId = null;
    

    // Agregar un event listener a cada uno de los spans (opciones)
    opcionesSpans.forEach(span => {
        span.addEventListener('click', function(event) {
            // Obtener el valor del atributo data-opcion
            opcionSeleccionada = event.target.getAttribute('data-opcion');
            textoOpcion = event.target.textContent;  // El texto que muestra el span
            preguntaId = event.target.closest('div').dataset.preguntaId;  // Obtener el ID de la pregunta
            usuarioId = event.target.closest('div').dataset.usuarioId;  // Obtener el ID del usuario
            
            // Remover la clase 'seleccionada' de todas las opciones
            opcionesSpans.forEach(span => {
                span.classList.remove('selected');
            });

            // Agregar la clase 'seleccionada' solo a la opción clickeada
            event.target.classList.add('selected');

            // Mostrar en consola la opción seleccionada
            console.log(`Opción seleccionada: ${opcionSeleccionada}, Texto: ${textoOpcion}, Pregunta: ${preguntaId}, Usuario: ${usuarioId}`);
            
            graficoRespuestas(preguntaIDD);
        });

        
    });




    // Cuando se haga clic en el botón "responder"
    responderBtn.addEventListener('click', function(event) {
            if (opcionSeleccionada !== null) {
                // Crear el objeto de datos en formato JSON
                const data = JSON.stringify({
                    user_id: usuarioId,
                    pregunta_id: preguntaId,
                    opcElegida: opcionSeleccionada
                });

                // Llamar a la función que maneja la respuesta y pasar los datos
                newRespuesta(data);

                // Prevenir el comportamiento por defecto del botón
                event.preventDefault();
            } else {
               
            }
    });
});




// //Obtener respuestas por pregunta
// async function obtenerRespuestasPorPregunta(preguntaId) {

//     var respuestas = await fetch(`/api/resultados/${preguntaId}`);

//     var respuestasPregunta = await respuestas.json();

//     return respuestasPregunta;
// }



async function newRespuesta(data) {
    console.log('Datos a enviar:', JSON.stringify(data));
    try {
        const respuesta = await fetch(`/api/new-respuesta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data // Usamos 'data' que ha sido pasada a la función
        });

        // Si la respuesta no es exitosa, leer el cuerpo como texto
        if (!respuesta.ok) {
            let errorData;
            try {
                // Primero, intenta leer el cuerpo como texto
                errorData = await respuesta.text();

                // Si la respuesta de error es JSON, intenta parsearla
                try {
                    errorData = JSON.parse(errorData);
                } catch (e) {
                    // Si no se puede parsear como JSON, dejarlo como texto
                    errorData = { error: errorData };
                }

            } catch (e) {
                errorData = { error: 'Error al leer la respuesta del servidor' };
            }

            // Aquí mejoramos la visualización del error, usando JSON.stringify si es necesario
            throw new Error(`Error ${respuesta.status}: ${JSON.stringify(errorData, null, 2)}`);
        }

        // Solo si la respuesta es OK, tratamos de leerla como JSON
        const result = await respuesta.json();
        return result;

    } catch (error) {
        // En este punto mostramos el error completo, con detalles
        console.error('Error al enviar respuesta:', error.message);
        console.error('Detalles del error:', error);
    }
}


async function getResultados(id) {
    
    var respuestas = await fetch(`/api/resultados/${id}`);

    var respuestasPregunta = await respuestas.json();

    return respuestasPregunta;
}







function graficoRespuestas(id) {
    // Usar el ID dinámico dentro de la URL del fetch
    getResultados(id)
        .then(conteos => {
            console.log(conteos); // Verifica la estructura de los datos obtenidos

            // Asegurarnos de que las claves 'a', 'b', 'c', 'd' existan en los datos
            var data = [
                conteos.a || 0, // Si no existe, asignamos 0
                conteos.b || 0,
                conteos.c || 0,
                conteos.d || 0
            ];

            var ctx = document.getElementById('respuestasChart').getContext('2d');
            var respuestasChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
                    datasets: [{
                        label: 'Respuestas',
                        data: data, // Usamos los datos obtenidos de la API
                        backgroundColor: ['red', 'blue', 'green', 'yellow'],
                        borderColor: ['darkred', 'darkblue', 'darkgreen', 'darkyellow'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}