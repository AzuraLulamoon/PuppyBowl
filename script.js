const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2306-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

async function fetchPlayers() {
    try {
        const response = await fetch(`${APIURL}/players`);
        const data = await response.json();
        console.log(data);
        return data.data.players;
    } catch(err) {
        console.log('error', err)
    }
};
async function fetchSinglePlayer(id) {
   try {
    const response = await fetch(`${APIURL}/players/${id}`)
    const data = await response.json();
    return data.data.player;
   } catch(err) {
    console.log('error', err);
   }
};

async function renderPlayers() {
    playerContainer.innerHTML = ''
    
    try {
    const playerArr = await fetchPlayers();
    console.log(playerArr)

    for(let player of playerArr) {
        let playerElement = document.createElement("div");
        playerElement.innerHTML =
            `<img id="pupImg" src=${player.imageUrl}>
             <h3>${player.name}</h3>
             <p>${player.breed}</p>
             <p>${player.status}</p>`;
             playerElement.className = 'singlePlayer'

    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete'
    deleteButton.className = 'clickers'
    deleteButton.addEventListener('click', async () => {
        await deletePlayer(player.id)
    })

    let detailButton = document.createElement("button");
    detailButton.innerHTML = 'Details'
    detailButton.className = 'clickers'
    detailButton.addEventListener('click', async (event) => {
        console.log('detail list');
        renderSinglePlayer(player.id);
    })
    playerElement.appendChild(deleteButton);
    playerElement.appendChild(detailButton);
    playerContainer.appendChild(playerElement);
    }
  } catch(err) {
    console.log('error', err);
  }
};

async function renderSinglePlayer(id) {
    playerContainer.innerHTML = ''
    const singlePlayer = await fetchSinglePlayer(id);

    let playerDetails = document.createElement("div");
    playerDetails.className = 'detailPage'
    playerDetails.innerHTML = 
    `<img id="pupImg2" src=${singlePlayer.imageUrl}>
    <h3>${singlePlayer.name}</h3>
    <p>${singlePlayer.breed}</p>
    <p>${singlePlayer.status}</p>`;
let closeButton = document.createElement("button");
closeButton.innerHTML = 'back'
closeButton.className = 'clickers'
closeButton.addEventListener('click', () => {
    renderPlayers();
})
playerContainer.appendChild(playerDetails);
playerDetails.appendChild(closeButton);
};

const renderForm = (playerObj) => {
    try {
    newPlayerFormContainer.innerHTML =
    `<h1 id="headerCard">Welcome to PuppyBowl!</h1>
    <h3 class ="formPlayer" id="cPlayer">Create a Player</h3>
    <input class ="inputs" type="text" id="name" name="Name" placeholder="Name"/>
    <input class="inputs" type="text" id="breed" name="Breed" placeholder="Breed"/>`;
    // <input type="text" id="status" name="Status" placeholder="Status"/>

    let submitButton = document.createElement('button');
    submitButton.innerHTML = 'Create';
    submitButton.className = 'clickers';
    submitButton.id = 'submitClick'
    submitButton.addEventListener('click', () => {
        const newPlayer = {
            name: document.getElementById('name').value,
            breed: document.getElementById('breed').value,
            // status: document.getElementById('status').value,
        }
        console.log(newPlayer);
        submitForm(newPlayer);
    })
    newPlayerFormContainer.appendChild(submitButton);
    } catch(err) {
        console.log('error', err);
    }
};

async function deletePlayer(id) {
    const response = await fetch(`${APIURL}/players/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    console.log('Player Removed', data);
    const rerender = async () => {
        const players = await fetchPlayers();
    renderPlayers(players);
    }
    rerender();
};
const submitForm = async (newPlayer) => {
    try {
        const response = await fetch (`${APIURL}/players`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newPlayer)
            });
            const data = await response.json();
            console.log('added', data);
            renderForm();
            const rerender = async () => {
                const players = await fetchPlayers();
            renderPlayers(players);
            }
            rerender();
    } catch(err) {
        console.log('error', err);
    }
};

const init = async () => {
    const players = await fetchPlayers();
    renderPlayers(players);

    renderForm();
}

init();
