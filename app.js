const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));



/* 
* Lista de itens com suas respectivas probabilidades de 0% a 100% de chances de sair
* A quantidade maxima de itens pra esse evento, por enquanto, é de 8 itens,
* Senbdo eles 4 itens consumiveis, 1 raro do update, 2 itens de cookie e 1 game ticket (pode ser outra coisa.)
*/
const itens = [
    { nome: 0, probabilidade: 98 }, // Item Consumivel 1
    { nome: 1, probabilidade: 96 }, // Item Consumivel 2
    { nome: 2, probabilidade: 94 }, // Item Consumivel 3
    { nome: 3, probabilidade: 90 }, // Item Consumivel 4
    { nome: 4, probabilidade: 12 }, // Arin Black Feather
    { nome: 5, probabilidade: 47 }, // Water Aztec 
    { nome: 6, probabilidade: 39 }, // Game Ticket
    { nome: 7, probabilidade: 39 } // Removedor de cartas (Nunca falha).
];

/* Função para selecionar um item com base na probabilidade */
function sortearItem() {
    const sorteio = Math.random() * 100; // Gera um número aleatório entre 0 e 100
    let somaProbabilidades = 0;

    // Calcula a soma total das probabilidades
    for (const item of itens) {
        somaProbabilidades += item.probabilidade;
    }

    // Sorteia um número entre 0 e a soma total das probabilidades
    let sorteioTotal = Math.random() * somaProbabilidades;

    // Encontra o item correspondente ao número sorteado
    for (const item of itens) {
        if (sorteioTotal <= item.probabilidade) {
            return item.nome; // Retorna o item sorteado
        }
        sorteioTotal -= item.probabilidade;
    }

    /*
    * Esta opção garante que, caso o sistema de probabilidade falhe,
    * o ticket usado retorne pro inventaro.   
    */
    return itens[itens.length - 1].nome;
}

// Pagina do jogo
app.get('/', (req, res) => { res.render(path.join(__dirname + '/public/game.ejs'), {itens}); });

// Roulette API (GET 200) -> Pede para a api rolar um numero baseado na probabilidade e retorna pro cliente.
app.get('/api/v1/sort_item', (req, res) => {
    // Mandando o json com o item pro cliente
    const item = sortearItem();
    console.log(item);
    res.status(200).json({ item_sorted: item });
});

app.listen(3000, () => console.log('Aplicação rodando na porta 3000!'));