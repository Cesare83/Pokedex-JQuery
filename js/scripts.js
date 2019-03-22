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
    return $.ajax(url).then(function (response) {
      item.imageUrl = response.sprites.front_default;
      item.height = response.height;
      item.types = response.types.map(function(item) {return item.type.name});
    }).catch(function (e) {
      console.error(e);
    });
  }

  //show-details function:
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
    console.log(item);  //TEST-Output
    //clean the previous details
    $detailsMenue.empty();
    //create elements
    var newDetailsWrapper = $('<div class="details-wrapper"></div>');
    var newNameElement = $('<p class="name-p">'+item.name+'</p>');
    var newImageElement = $('<img src='+item.imageUrl+' class="details-image">');
    var newHeightElement = $('<p class="details-p">height: '+item.height+'</p>');
    var newTypesElement = $('<p class="details-p">type: '+item.types.join(', ')+'</p>');
    var newLoadingMessage = $('<p class="name-p">Loading..</p>');
    //hide elements for fadeIn effect
    newNameElement.hide();
    newImageElement.hide();
    newHeightElement.hide();
    newTypesElement.hide();
    newLoadingMessage.hide();
    //appending hidden elements
    newDetailsWrapper.append(newLoadingMessage);
    newDetailsWrapper.append(newNameElement);
    newDetailsWrapper.append(newImageElement);
    newDetailsWrapper.append(newTypesElement);
    newDetailsWrapper.append(newHeightElement);
    $detailsMenue.append(newDetailsWrapper);
    //fading in and out loading newLoadingMessage
    newLoadingMessage.fadeIn(500);
    newLoadingMessage.fadeOut(500);
    newNameElement.delay(1000).fadeIn(500);
    newImageElement.delay(1000).fadeIn(500);
    newHeightElement.delay(1000).fadeIn(500);
    newTypesElement.delay(1000).fadeIn(500);
    });
  }

  function addListItem(pokemon) {
    //select node
    var $unorderedList = $('ul');
    //create the ul-elements:
    var newListIndex = $('<li class="list-item"></li>');
    var newListIndexText = $('<p>'+pokemon.name+'</p>');
    var newListIndexButton = $('<button class="details-button">show details</button>');
    //append them to $pokemon-list
    newListIndex.append(newListIndexText);
    newListIndex.append(newListIndexButton);
    $unorderedList.append(newListIndex);
    //add show-details function
    newListIndexButton.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  function showDialog() {
    var $dialogContainer = $('#dialog-container');
    //create $dialogContainer elements
    var newDialogWrapper =$('<div class="dialog-wrapper"></div>');
    var newCenteredText =$('<div class="centered-text"></div>');
    var newDialogText =$('<p id="dialog-text">Choose your favourite pokemon:</p>')
    var newDialogImageWrapper =$('<div class="dialog-img-wrapper"></div>');
    var newWrapperDiv1 =$('<div></div>');
    var newWrapperDiv2 =$('<div></div>');
    var newWrapperDiv3 =$('<div></div>');
    var newBulbasaurButton =$('<button type="button" id="bulbasaur-button"></button>');
    var newCharmanderButton =$('<button type="button" id="charmander-button"></button>');
    var newSquirtleButton =$('<button type="button" id="squirtle-button"></button>');
    var newBulbasaurImage =$('<img id="bulbasaur" class="dialog-img" src="http://www.pokemonget.eu/shop/155-large_default/bulbasaur-6-ivs-shiny.jpg" alt="bulbasaur">');
    var newCharmanderImage =$('<img id="charmander" class="dialog-img" src="http://www.pokemonget.eu/shop/152-large_default/charmander-6-ivs-shiny.jpg" alt="charmander">');
    var newSquirtleImage =$('<img id="squirtle" class="dialog-img" src="http://www.pokemonget.eu/shop/160-large_default/squirtle-6ivs-shiny.jpg" alt="squirtle">');
    var newDialogButtons =$('<div id="dialog-buttons"></div>');
    var newButtonsDiv1 =$('<div class="confirm-cancel-buttons"></div>');
    var newButtonsDiv2 =$('<div class="confirm-cancel-buttons"></div>');
    var newCancelButton =$('<button type="button" id="cancel-button">cancel</button>');
    var newConfirmButton =$('<button type="button" id="confirm-button">confirm</button>');
    //hide newDialogWrapper & cancel/confirm-Buttons for
    newDialogButtons.hide();
    newDialogWrapper.hide();
    //appending children
    newButtonsDiv1.append(newCancelButton);
    newButtonsDiv2.append(newConfirmButton);
    newDialogButtons.append(newButtonsDiv1);
    newDialogButtons.append(newButtonsDiv2);
    newBulbasaurButton.append(newBulbasaurImage);
    newCharmanderButton.append(newCharmanderImage);
    newSquirtleButton.append(newSquirtleImage);
    newWrapperDiv1.append(newBulbasaurButton);
    newWrapperDiv2.append(newCharmanderButton);
    newWrapperDiv3.append(newSquirtleButton);
    newDialogImageWrapper.append(newWrapperDiv1);
    newDialogImageWrapper.append(newWrapperDiv2);
    newDialogImageWrapper.append(newWrapperDiv3);
    newCenteredText.append(newDialogText);
    newDialogWrapper.append(newCenteredText);
    newDialogWrapper.append(newDialogImageWrapper);
    newDialogWrapper.append(newDialogButtons);
    $dialogContainer.append(newDialogWrapper);
    //fadeIn:
    newDialogWrapper.fadeIn(700);
    //change value of var favouritePokemon upon choice:
    newBulbasaurButton.on('click', function(event) {
      favouritePokemon = 0;
      confirmChoice("bulbasaur");
      newDialogButtons.fadeIn(700);
    });
    newCharmanderButton.on('click', function(event) {
      favouritePokemon = 1;
      confirmChoice("charmander");
      newDialogButtons.fadeIn(700);
    });
    newSquirtleButton.on('click', function(event) {
      favouritePokemon = 2;
      confirmChoice("squirtle");
      newDialogButtons.fadeIn(700);
    });
  }

  function confirmChoice(string) {
    var $dialogButtons = $('#dialog-buttons');
    var $dialogText = $('#dialog-text');
    var $buttonImage = $('#'+string);
    var $buttonBulbasaur = $('#bulbasaur');
    var $buttonCharmander = $('#charmander');
    var $buttonSquirtle = $('#squirtle');
    //remove color previous selection
    $buttonBulbasaur.removeClass('bulbasaur-background');
    $buttonCharmander.removeClass('charmander-background');
    $buttonSquirtle.removeClass('squirtle-background');
    //add the color selection of the current selected one
    $buttonImage.addClass(string+'-background');

    $dialogText.hide();
    $dialogText.html('you selected '+string);
    $dialogText.fadeIn(400);

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
    $dialogButtons.fadeOut(350);
    $dialogText.hide();
    $dialogText.html('Choose your favourite pokemon:');
    $dialogText.fadeIn(350);
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
    $dialogContainer.fadeOut();
  }


  //--------------------RETURNING ACCESSIBLE OBJECT METHODS---------------------

  return {
  getAll: getAll,
  loadList: loadList,
  loadDetails: loadDetails,
  addListItem: addListItem,
  showDialog: showDialog
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
pokemonRepository.showDialog();
