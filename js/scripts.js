//IIFE-Wrap: please wrap all within it!
var pokemonRepository = (function() {

  //Declaring the repository array:
  var repository = [];
  //API-Adress:
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  //Dialog window to hide/show:
  var $dialogContainer = document.querySelector('#dialog-container');
  //details-menue var:
  var $detailsMenue = document.querySelector('#details-menue');
  //favourite pokemon options:
  var favouritePokemon;

  //show-details function:
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
    console.log(item);  //still useful as a test
    //pokemonRepository.showModal(item);

    //cleaning the previous details:
    $detailsMenue.innerHTML = '';

    var detailsWrapper = document.createElement('div');
    detailsWrapper.classList.add('details-wrapper');

    var nameElement = document.createElement('p');
    nameElement.classList.add('name-p');
    nameElement.innerText = item.name;

    var imageElement = document.createElement('img');
    imageElement.classList.add('details-image');
    imageElement.setAttribute("src",item.imageUrl);

    var heightElement = document.createElement('p');
    heightElement.classList.add('details-p');
    heightElement.innerText = 'height: '+item.height;

    var typesElement = document.createElement('p');
    typesElement.classList.add('details-p');
    typesElement.innerText='type: '+ item.types.join(', ');

    detailsWrapper.appendChild(nameElement);
    detailsWrapper.appendChild(imageElement);
    detailsWrapper.appendChild(typesElement);
    detailsWrapper.appendChild(heightElement);
    $detailsMenue.appendChild(detailsWrapper);
    });
  }

  //get-All function:
  function getAll() {
    return repository;
  }

  //add-Pokemon-Objects function:
  function add(pokemon) {
    repository.push(pokemon);
  }

  //load pokemons from API: (syncro)
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function showDialog() {
    //activating dialog buttons:
    var $bulbasaurButton = document.querySelector('#bulbasaur-button');
    var $charmanderButton = document.querySelector('#charmander-button');
    var $squirtleButton = document.querySelector('#squirtle-button');

    //changing value of favouritePokemon upon choice:
    $bulbasaurButton.addEventListener('click', function(event) {
      favouritePokemon = 0;
      confirmChoice("bulbasaur");
    });
    $charmanderButton.addEventListener('click', function(event) {
      favouritePokemon = 1;
      confirmChoice("charmander");
    });
    $squirtleButton.addEventListener('click', function(event) {
      favouritePokemon = 2;
      confirmChoice("squirtle");
    });
  }

  function confirmChoice(string) {
    var $dialogButtons = document.querySelector('#dialog-buttons');
    var $dialogText = document.querySelector('#dialog-text');
    var $buttonImage = document.querySelector('#'+string);
    var $buttonBulbasaur = document.querySelector('#bulbasaur');
    var $buttonCharmander = document.querySelector('#charmander');
    var $buttonSquirtle = document.querySelector('#squirtle');

    //first remove color previous selection:
    $buttonBulbasaur.classList.remove('bulbasaur-background');
    $buttonCharmander.classList.remove('charmander-background');
    $buttonSquirtle.classList.remove('squirtle-background');

    //then activate the color selection of the current selected one:
    $buttonImage.classList.add(string+'-background');

    $dialogText.innerHTML = '';
    $dialogText.innerHTML = 'you selected '+string;

    $dialogButtons.classList.add('is-visible');
    var $cancelButton = document.querySelector('#cancel-button');
    var $confirmButton = document.querySelector('#confirm-button');
    $cancelButton.addEventListener('click', function(event) {
      //remove selection color from the selected one:
      $buttonBulbasaur.classList.remove('bulbasaur-background');
      $buttonCharmander.classList.remove('charmander-background');
      $buttonSquirtle.classList.remove('squirtle-background');
      //hide confirm/cancel buttons:
      hideConfirmChoice();
    });
    $confirmButton.addEventListener('click', function(event) {
      changeColor();
    });
  }

  function hideConfirmChoice() {
    var $dialogButtons = document.querySelector('#dialog-buttons');
    var $dialogText = document.querySelector('#dialog-text');

    $dialogButtons.classList.remove('is-visible');
    $dialogText.innerHTML = '';
    $dialogText.innerHTML = 'Choose your favourite pokemon:';
  }

  function changeColor() {
    var $header = document.querySelector('header');
    var $pokedex = document.querySelector('.pokedex');
    var $title = document.querySelector('#title');

    switch(favouritePokemon) {
      case 0:
      $header.classList.add('green-background');
      $pokedex.classList.add('green-borders');
      $title.innerHTML = 'Pokedex green';
      break;

      case 1:
      $header.classList.add('red-background');
      $pokedex.classList.add('red-borders');
      $title.innerHTML = 'Pokedex red';
      break;

      case 2:
      $header.classList.add('blue-background');
      $pokedex.classList.add('blue-borders');
      $title.innerHTML = 'Pokedex blue';
      break;
    }
    hideDialog();
  }

  function hideDialog() {
    $dialogContainer.classList.add('invisible');
  }

  //load pokemon-details by clicking showDetailsButton:
  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types.map(function(item) {return item.type.name});
    }).catch(function (e) {
      console.error(e);
    });
  }

  //add-list-item function:
  function addListItem(pokemon) {
    var listItemText = document.createTextNode(pokemon.name);      //$p-text
    var buttonText = document.createTextNode('show details');          //$details-button text

    var $p = document.createElement('p');                              //creating elements on DOM
    var $detailsButton = document.createElement('button');
    var $li = document.createElement('li');
    var $ul = document.querySelector('ul');

    $detailsButton.classList.add('details-button');                   //adding styling to the elements
    $li.classList.add('list-item');
    $ul.classList.add('pokemon-list');

    $detailsButton.appendChild(buttonText);                           //appending them to $pokemon-list
    $p.appendChild(listItemText);
    $li.appendChild($p);
    $li.appendChild($detailsButton);
    $ul.appendChild($li);

    $detailsButton.addEventListener('click', function(event) {       //show-details function
      showDetails(pokemon);
    });
  }

  //return function:
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDialog: showDialog,
  };
})(); //IIFE-Wrap closes here!

//loadList promise:
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
//activating the dialog-buttons:
pokemonRepository.showDialog();
