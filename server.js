const express = require("express");
const fetch = require("node-fetch")
const fs = require('fs')
const request = require('request');
const app = express();
app.use(express.json());

// GET Call for the balance
app.get("/getPokemonData", (req, res) => {

    let response = null

    getPokemonData().then(data => {
        response = {
            count: data.length,
            pokemon: data
        }
        console.log(response)
    })


    return res.status(200).send({
        status: "true",
        response: response
    });
});

async function getPokemonData() {
    let pokemon_response = []
    const pokemon_type = await getPokemonType()
    const pokemon_habitat = await getPokemonHabitat()

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

    pokemon_data.forEach(pokemon => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(data => data.json())
            .then(data => {
                // console.log(data.sprites.back_default)
                download(data.sprites.back_default, `./media/${pokemon.name}.png`, function(){})
            })
            .catch(err => {
                throw new Error(err.message);
            });
    })

}


async function getPokemonType() {

    let pokemon_type = null
    await fetch("https://pokeapi.co/api/v2/type/3")
        .then(data => data.json())
        .then(data => {
            // console.log(data.pokemon)
            pokemon_type = data.pokemon
        })
        .catch(err => {
            throw new Error(err.message);
        });

    return pokemon_type

}

async function getPokemonHabitat() {

    let pokemon_habitat = null
    await fetch("https://pokeapi.co/api/v2/pokemon-habitat/cave")
        .then(data => data.json())
        .then(data => {
            // console.log(data.pokemon_species)
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
