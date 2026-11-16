# Portal Multiversal - Rick and Morty

Projeto academico de front-end que consome a [Rick and Morty API](https://rickandmortyapi.com/) e cria cards de personagens dinamicamente com JavaScript puro.

## Tecnologias

- HTML5: estrutura semantica da pagina.
- CSS3: identidade visual e responsividade, sem frameworks.
- JavaScript: `fetch()`, Promises (`then`, `catch`, `finally`), manipulacao do DOM, `createElement()` e `appendChild()`.

## Como executar no computador

### Opção 1 — Baixando pelo GitHub

1. Acesse o repositório do projeto.
2. Clique no botão verde `Code`.
3. Selecione `Download ZIP`.
4. Extraia o arquivo baixado para uma pasta do computador.
5. Abra o Visual Studio Code.
6. Clique em `File > Open Folder` e selecione a pasta extraída.
7. Abra o arquivo `index.html`.
8. Clique com o botão direito e selecione `Open with Live Server`.

### Opção 2 — Utilizando os arquivos do projeto

Se você já possui os arquivos do projeto no computador, basta abrir a pasta principal no Visual Studio Code e executar o `index.html` utilizando o Live Server.

**Observação:** não é necessário enviar o arquivo ZIP para o GitHub. O repositório já contém os arquivos individuais organizados nas pastas correspondentes.

Tambem e possivel abrir `index.html` diretamente no navegador, pois o projeto nao usa servidor proprio nem processo de compilacao. Para desenvolvimento, o Live Server facilita a atualizacao automatica.

## Funcionalidades

- Carregamento inicial de personagens.
- Busca pelo nome.
- Filtro por status: vivo, morto ou desconhecido.
- Paginacao anterior/proxima, usando os links `info.prev` e `info.next` da API.
- Cards dinamicos com nome, imagem, status, especie, genero, origem e localizacao atual.
- Mensagens para carregamento, ausencia de resultados e falhas HTTP/rede.
- Layout responsivo para desktop, tablet e celular.

## API utilizada

Endpoint principal: `https://rickandmortyapi.com/api/character`

Filtros aceitos pela API usados neste projeto:

- `page`: numero da pagina.
- `name`: nome do personagem.
- `status`: `alive`, `dead` ou `unknown`.

A documentacao informa que a resposta e JSON e que cada pagina pode conter ate 20 registros. A documentacao consultada nao declara um numero fixo de requisicoes permitido por minuto/dia. O projeto faz requisicoes apenas ao carregar, pesquisar, limpar filtros ou navegar entre paginas; tambem exibe mensagem caso receba HTTP 429. Nao e necessario token nos exemplos REST documentados.

Documentacao: https://rickandmortyapi.com/documentation

