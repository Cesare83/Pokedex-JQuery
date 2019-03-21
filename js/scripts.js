var pokemonRepository  = (function() {

  //---------------------------GLOBAL VARIABLES---------------------------------
  //Declaring the repository array:
  var repository = [];
  //API-Adress:
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  //Dialog window to hide/show:
  var $dialogContainer = $('#dialog-container');
  //details-menue var:
  var $detailsMenue = $('#details-menue');
  //favourite pokemon options:
  var favouritePokemon;
  //----------------------------------------------------------------------------

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

  //show-details function:
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
    console.log(item);  //TEST-Output
    //cleaning the previous details:
    $detailsMenue.empty();

    var newDetailsWrapper = $('<div class="details-wrapper"></div>');
    var newNameElement = $('<p class="name-p">name: '+item.name+'</p>');
    var newImageElement = $('<img src='+item.imageUrl+' class="details-image">');
    var newHeightElement = $('<p class="details-p">height: '+item.height+'</p>');
    var newTypesElement = $('<p class="details-p">type: '+item.types+'</p>');

    newDetailsWrapper.append(newNameElement);
    newDetailsWrapper.append(newImageElement);
    newDetailsWrapper.append(newTypesElement);
    newDetailsWrapper.append(newHeightElement);
    $detailsMenue.append(newDetailsWrapper);
    });
  }

  function addListItem(pokemon) {

    var $unorderedList = $('ul');
    //creating the ul-elements:
    var newListIndex = $('<li class="list-item"></li>');
    var newListIndexText = $('<p>'+pokemon.name+'</p>');
    var newListIndexButton = $('<button class="details-button">show details</button>');
    //appending them to $pokemon-list
    newListIndex.append(newListIndexText);
    newListIndex.append(newListIndexButton);
    $unorderedList.append(newListIndex);
    //adding show-details function
    newListIndexButton.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  function activateDialog() {
    //activating dialog buttons:
    var $bulbasaurButton = $('#bulbasaur-button');
    var $charmanderButton = $('#charmander-button');
    var $squirtleButton = $('#squirtle-button');
    //changing value of var favouritePokemon upon choice:
    $bulbasaurButton.on('click', function(event) {
      favouritePokemon = 0;
      confirmChoice("bulbasaur");
    });
    $charmanderButton.on('click', function(event) {
      favouritePokemon = 1;
      confirmChoice("charmander");
    });
    $squirtleButton.on('click', function(event) {
      favouritePokemon = 2;
      confirmChoice("squirtle");
    });
  }

  function confirmChoice(string) {
    var $dialogButtons = $('#dialog-buttons');
    var $dialogText = $('#dialog-text');
    var $buttonImage = $('#'+string);
    var $buttonBulbasaur = $('#bulbasaur');
    var $buttonCharmander = $('#charmander');
    var $buttonSquirtle = $('#squirtle');
    //remove color previous selection:
    $buttonBulbasaur.removeClass('bulbasaur-background');
    $buttonCharmander.removeClass('charmander-background');
    $buttonSquirtle.removeClass('squirtle-background');
    //add the color selection of the current selected one:
    $buttonImage.addClass(string+'-background');

    $dialogText.html('');
    $dialogText.html('you selected '+string);

    $dialogButtons.addClass('is-visible');
    var $cancelButton = $('#cancel-button');
    var $confirmButton = $('#confirm-button');
    $cancelButton.on('click', function(event) {
      //remove selection color from the selected one:
      $buttonBulbasaur.removeClass('bulbasaur-background');
      $buttonCharmander.removeClass('charmander-background');
      $buttonSquirtle.removeClass('squirtle-background');
      //hide confirm/cancel buttons:
      hideConfirmChoice();
    });
    $confirmButton.on('click', function(event) {
      changeColor();
    });
  }

  function hideConfirmChoice() {
    var $dialogButtons = $('#dialog-buttons');
    var $dialogText = $('#dialog-text');
    //hide dialog buttons and updating dialog Text
    $dialogButtons.removeClass('is-visible');
    $dialogText.html('');
    $dialogText.html('Choose your favourite pokemon:');
  }

  function changeColor() {
    var $header = $('header');
    var $pokedex = $('.pokedex');
    var $title = $('#title');

    switch(favouritePokemon) {
      case 0:
      $header.addClass('green-background');
      $pokedex.addClass('green-borders');
      $title.html('Pokedex green');
      break;

      case 1:
      $header.addClass('red-background');
      $pokedex.addClass('red-borders');
      $title.html('Pokedex red');
      break;

      case 2:
      $header.addClass('blue-background');
      $pokedex.addClass('blue-borders');
      $title.html('Pokedex blue');
      break;
    }
    hideDialog();
  }

  function hideDialog() {
    $dialogContainer.addClass('invisible');
  }


  //--------------------RETURNING ACCESSIBLE OBJECT METHODS---------------------

  return {
  getAll: getAll,
  loadList: loadList,
  loadDetails: loadDetails,
  addListItem: addListItem,
  activateDialog: activateDialog
  };

  //--------------------------------IIFE ENDS HERE------------------------------
})();
//loading the pokemon list from the database
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
//activating dialog functions
pokemonRepository.activateDialog();
