# RESTful API built in Node and Express

Using the new Express 4.0 Router to build an API

## Requirements

- Node and npm

## Installation

- Clone the repo: `git clone https://github.com/NehaUpadhyay25/pokemon-challenge.git`
- Install dependencies: `npm install`
- Start the server: `node server.js`

## Testing the API
Test your API using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)

### Get Pokemon lists
- API <br> GET/ <localhost:8000/getPokemonData>
- **Input** <br>
    ```
    { 
        "type": "flying", 
        "habitat": "cave" 
    }

- **Expected response** <br>
   ```
   {
       "count": 3,
       "pokemon": [
           {
               "name": "zubat",
               "sprite": "media/zubat.png"
           },
           {
               "name": "golbat",
               "sprite": "media/golbat.png"
           },
           {
               "name": "crobat",
               "sprite": "media/crobat.png"
           }
       ]
   }