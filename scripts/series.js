import getDatos from "./getDatos.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get("id");
const listaTemporadas = document.getElementById("temporadas-select");
const fichaSerie = document.getElementById("temporadas-episodios");
const fichaDescripcion = document.getElementById("ficha-descripcion");

// Funcion para cargar temporadas
function cargarTemporadas() {
  getDatos(`/series/${serieId}/seasons/all`)
    .then((data) => {
      const temporadasUnicas = [
        ...new Set(data.map((temporada) => temporada.season)),
      ];
      listaTemporadas.innerHTML = ""; // Limpia las opciones existentes

      const optionDefault = document.createElement("option");
      optionDefault.value = "";
      optionDefault.textContent = "Seleccione la temporada";
      listaTemporadas.appendChild(optionDefault);

      temporadasUnicas.forEach((temporada) => {
        const option = document.createElement("option");
        option.value = temporada;
        option.textContent = temporada;
        listaTemporadas.appendChild(option);
      });

      const optionTodos = document.createElement("option");
      optionTodos.value = "todas";
      optionTodos.textContent = "Todas las temporadas";
      listaTemporadas.appendChild(optionTodos);
    })
    .catch((error) => {
      console.error("Error al obtener temporadas:", error);
    });
}

// Funcion para cargar episodios de una temporada
function cargarEpisodios() {
  getDatos(`/series/${serieId}/seasons/${listaTemporadas.value}`)
    .then((data) => {
      const temporadasUnicas = [
        ...new Set(data.map((temporada) => temporada.season)),
      ];
      fichaSerie.innerHTML = "";
      temporadasUnicas.forEach((temporada) => {
        const ul = document.createElement("ul");
        ul.className = "episodios-lista";

        const episodiosTemporadaAtual = data.filter(
          (serie) => serie.season === temporada
        );

        const listaHTML = episodiosTemporadaAtual
          .map(
            (serie) => `
                    <li>
                        ${serie.episodeNumber} - ${serie.title}
                    </li>
                `
          )
          .join("");
        ul.innerHTML = listaHTML;

        const paragrafo = document.createElement("p");
        const linha = document.createElement("br");
        paragrafo.textContent = `Temporada ${temporada}`;
        fichaSerie.appendChild(paragrafo);
        fichaSerie.appendChild(linha);
        fichaSerie.appendChild(ul);
      });
    })
    .catch((error) => {
      console.error("Error al obtener episodios:", error);
    });
}

// Funcion para cargar informaciones de la serie
function cargarInfoSerie() {
  getDatos(`/series/${serieId}`)
    .then((data) => {
      fichaDescripcion.innerHTML = `
                <img src="${data.poster}" alt="${data.title}" />
                <div>
                    <h2>${data.title}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de evaluaciones:</b> ${data.rating}</p>
                        <p>${data.synopsis}</p>
                        <p><b>Actores:</b> ${data.actors}</p>
                    </div>
                </div>
            `;
    })
    .catch((error) => {
      console.error("Error al obtener informaciones de la serie:", error);
    });
}

// Adiciona escuchador de evento para el elemento select
listaTemporadas.addEventListener("change", cargarEpisodios);

// Carga las informaciones de la série y las temporadas cuando la página carga
cargarInfoSerie();
cargarTemporadas();
