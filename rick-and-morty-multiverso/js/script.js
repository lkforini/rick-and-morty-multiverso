// Endereco principal da API oficial de personagens.
const API_URL = "https://rickandmortyapi.com/api/character";

// Capturamos os elementos do HTML que o JavaScript precisa atualizar.
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const clearFiltersButton = document.querySelector("#clearFiltersButton");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const characterGrid = document.querySelector("#characterGrid");
const totalCount = document.querySelector("#totalCount");
const pageNumber = document.querySelector("#pageNumber");
const paginationLabel = document.querySelector("#paginationLabel");
const resultsMessage = document.querySelector("#resultsMessage");

// Guardamos a pagina atual para controlar os botoes de navegacao.
let currentPage = 1;
let totalPages = 1;

/**
 * Consulta a API com os filtros selecionados e atualiza a pagina.
 * A API permite combinar os parametros page, name e status.
 */
function loadCharacters() {
  const parameters = new URLSearchParams();
  const name = searchInput.value.trim();
  const status = statusFilter.value;

  parameters.append("page", currentPage);

  if (name !== "") {
    parameters.append("name", name);
  }

  if (status !== "") {
    parameters.append("status", status);
  }

  const requestURL = `${API_URL}?${parameters.toString()}`;

  setLoading(true);
  characterGrid.replaceChildren();
  resultsMessage.textContent = "Consultando o banco de dados interdimensional...";

  // fetch() envia a requisicao HTTP. then() trata a resposta em etapas.
  fetch(requestURL)
    .then(function (response) {
      // fetch nao considera respostas HTTP 404/500 como erro automaticamente.
      // Por isso verificamos response.ok antes de converter o JSON.
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Nenhum personagem encontrado com esses filtros.");
        }

        if (response.status === 429) {
          throw new Error("A API recebeu muitas requisicoes. Aguarde um pouco e tente novamente.");
        }

        throw new Error(`A API respondeu com o status HTTP ${response.status}.`);
      }

      return response.json();
    })
    .then(function (data) {
      // Atualiza os indicadores usando os dados retornados pela API.
      totalPages = data.info.pages;
      totalCount.textContent = data.info.count.toLocaleString("pt-BR");
      pageNumber.textContent = `${currentPage} / ${totalPages}`;
      paginationLabel.textContent = `Pagina ${currentPage} de ${totalPages}`;
      resultsMessage.textContent = `Exibindo ${data.results.length} de ${data.info.count} personagem(ns) encontrados.`;

      // Cada personagem recebido gera um novo card no DOM.
      data.results.forEach(function (character) {
        const card = createCharacterCard(character);
        characterGrid.appendChild(card);
      });

      // Mostra no console a resposta para facilitar a demonstracao tecnica.
      console.info("Personagens recebidos da API:", data.results);
      console.info("Informacoes de paginacao:", data.info);

      updatePaginationButtons(data.info);
    })
    .catch(function (error) {
      // Limpa os cards anteriores e mostra uma mensagem compreensivel.
      characterGrid.replaceChildren();
      totalCount.textContent = "0";
      pageNumber.textContent = "—";
      paginationLabel.textContent = "Sem resultados";
      resultsMessage.textContent = error.message;
      showEmptyState("Portal sem coordenadas", error.message);
      previousButton.disabled = true;
      nextButton.disabled = true;
      console.error("Falha ao consultar a Rick and Morty API:", error);
    })
    .finally(function () {
      setLoading(false);
    });
}

/** Cria um card completo usando os campos recebidos da API. */
function createCharacterCard(character) {
  const card = document.createElement("article");
  card.className = "character-card";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "character-card__image-wrap";

  const image = document.createElement("img");
  image.className = "character-card__image";
  image.src = character.image;
  image.alt = `Imagem de ${character.name}`;
  image.loading = "lazy";

  const idBadge = document.createElement("span");
  idBadge.className = "character-card__id";
  idBadge.textContent = `ID #${character.id}`;

  imageWrapper.appendChild(image);
  imageWrapper.appendChild(idBadge);

  const body = document.createElement("div");
  body.className = "character-card__body";

  const topLine = document.createElement("div");
  topLine.className = "character-card__topline";

  const name = document.createElement("h3");
  name.className = "character-card__name";
  name.textContent = character.name;

  const status = document.createElement("span");
  const statusKey = character.status.toLowerCase();
  status.className = `status-badge status-badge--${statusKey}`;
  status.textContent = translateStatus(character.status);

  topLine.appendChild(name);
  topLine.appendChild(status);

  const species = document.createElement("p");
  species.className = "character-card__species";
  species.textContent = `${character.species} • ${translateGender(character.gender)}`;

  const details = document.createElement("div");
  details.className = "character-card__details";
  details.appendChild(createDetailRow("Origem", character.origin.name));
  details.appendChild(createDetailRow("Local atual", character.location.name));

  body.appendChild(topLine);
  body.appendChild(species);
  body.appendChild(details);

  card.appendChild(imageWrapper);
  card.appendChild(body);

  return card;
}

/** Cria uma linha de informacao do card sem inserir HTML como texto. */
function createDetailRow(labelText, valueText) {
  const row = document.createElement("div");
  row.className = "character-detail";

  const label = document.createElement("span");
  label.className = "character-detail__label";
  label.textContent = labelText;

  const value = document.createElement("span");
  value.className = "character-detail__value";
  value.textContent = valueText || "Nao informado";

  row.appendChild(label);
  row.appendChild(value);
  return row;
}

function translateStatus(status) {
  const translations = {
    Alive: "Vivo",
    Dead: "Morto",
    unknown: "Desconhecido"
  };

  return translations[status] || status;
}

function translateGender(gender) {
  const translations = {
    Female: "Feminino",
    Male: "Masculino",
    Genderless: "Sem genero",
    unknown: "Genero desconhecido"
  };

  return translations[gender] || gender;
}

function showEmptyState(titleText, descriptionText) {
  const box = document.createElement("div");
  box.className = "empty-state";

  const title = document.createElement("strong");
  title.textContent = titleText;

  const description = document.createElement("span");
  description.textContent = descriptionText;

  box.appendChild(title);
  box.appendChild(description);
  characterGrid.appendChild(box);
}

function updatePaginationButtons(info) {
  previousButton.disabled = !info.prev;
  nextButton.disabled = !info.next;
}

function setLoading(isLoading) {
  characterGrid.setAttribute("aria-busy", String(isLoading));
  searchForm.querySelector("button[type='submit']").disabled = isLoading;

  // Durante a requisicao, evita que o usuario dispare outra pagina.
  // Quando a resposta chega, updatePaginationButtons() define os estados corretos.
  if (isLoading) {
    previousButton.disabled = true;
    nextButton.disabled = true;
  }
}

// Envio do formulario: pesquisa o nome e/ou status informados.
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  currentPage = 1;
  loadCharacters();
});

// Limpa os campos e volta para a primeira pagina.
clearFiltersButton.addEventListener("click", function () {
  searchInput.value = "";
  statusFilter.value = "";
  currentPage = 1;
  loadCharacters();
});

previousButton.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage -= 1;
    loadCharacters();
  }
});

nextButton.addEventListener("click", function () {
  if (currentPage < totalPages) {
    currentPage += 1;
    loadCharacters();
  }
});

// Carrega os primeiros personagens assim que o script e o HTML estao prontos.
loadCharacters();
