const express = require("express");
const fetch = require("node-fetch")
const fs = require('fs')
const request = require('request');
const app = express();
app.use(express.json());

// GET Call for the pokemon data
app.get("/getPokemonData", async (req, res) => {

    if ( !req.body.type && !req.body.habitat) {
        return res.status(400).send( {
            response: "Invalid request"
        });
    }

    try {
        let pokemonData = await getPokemonData(req.body.type, req.body.habitat)

        return res.status(200).send({
            count: pokemonData.length,
            pokemon: pokemonData
        });
    } catch (err) {
        return res.status(400).send({
            response: "Error with the API call"
        });
    }
});

async function getPokemonData(type, habitat) {
    let pokemon_response = []
    const pokemon_type = await getPokemonType(type)
    const pokemon_habitat = await getPokemonHabitat(habitat)

    const common_pokemon = await findCommonPokemon(pokemon_type, pokemon_habitat)
    await getPokemonSprite(common_pokemon)

    common_pokemon.forEach(pokemon => {
        pokemon_response.push({
            name: pokemon.name,
            sprite: `media/${pokemon.name}.png`
        })
    })

    return pokemon_response
}

async function getPokemonSprite(pokemon_data) {

    //create media directory if it doesn't exist
    const dir = "./media"
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    pokemon_data.forEach(pokemon => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(data => data.json())
            .then(data => {
                download(data.sprites.back_default, `./media/${pokemon.name}.png`, function(){})
            })
            .catch(err => {
                throw new Error(err.message);
            });
    })

}


async function getPokemonType(type) {

    let pokemon_type = null
    await fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then(data => data.json())
        .then(data => {
            pokemon_type = data.pokemon
        })
        .catch(err => {
            throw new Error(err.message);
        });

    return pokemon_type

}

async function getPokemonHabitat(habitat) {

    let pokemon_habitat = null
    await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`)
        .then(data => data.json())
        .then(data => {
            pokemon_habitat = data.pokemon_species
        })
        .catch(err => {
            throw new Error(err.message);
        });

    return pokemon_habitat

}

const findCommonPokemon = (pokemon_type, pokemon_habitat) => {
    let common_pokemon = []

    pokemon_habitat.forEach(function (pokemon){
        for (let i =0; i<pokemon_type.length; i++){
            if (pokemon_type[i].pokemon.name === pokemon.name)
                common_pokemon.push({
                    name: pokemon.name,
                    url: pokemon_type[i].pokemon.url
                })
        }
    })


    return common_pokemon
}

const download = (uri, filename, callback) => {
    request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


app.listen(8000, () => {
    console.log("server listening on port 8000!");
});
