const domUpdates = {
  showStartScreen() {
    let startScreen = $('<section class="section__start-screen"></section>');
    startScreen.html(`
      <h2 class="h2">THIS IS</h2>
      <h1 class="h1">JEOPARDY</h1>
      <form class="form">
        <label for="name-0" class="label">Player 1</label>
        <input type="text" id="name-0" class="input--name">
        <label for="name-1" class="label">Player 2</label>
        <input type="text" id="name-1" class="input--name">
        <label for="name-2" class="label">Player 3</label>
        <input type="text" id="name-2" class="input--name">
        <input type="submit" value="Start" class="input--submit">
      </form>
    `);
    $('body').prepend(startScreen);
    $('.input--submit').on('click', instantiatePlayers);
  },

  removeStartScreen() {
    $('.section__start-screen').remove();
  },

  presentClue(event) {
    if (event.target.innerHTML !== '') {
      const id = event.target.id;
      const selectedClue = jeopardy.rounds[0].clues[parseInt(id)];
      console.log(selectedClue)
      if (selectedClue.dailyDouble === true) {
        domUpdates.showWagerScreen(selectedClue);
      } else {
        domUpdates.showPopUp(selectedClue, false);
      }
      event.target.innerHTML = '';
      jeopardy.game.cluesRemaining--;
    }
  },

  showWagerScreen(clue) {
    // figure out the max wager the player is allowed
    const maxPointValue = Math.max(...Array.from($('.article__clue'))
      .map(square => {
        return parseInt(square.textContent);
      })
      .filter(num => {
        return !isNaN(num);
      }))
    const maxWager = Math.max(jeopardy.game.activePlayer.score, maxPointValue);
    // have an input box 
    // change the pointValue of the dailydouble to their wager
    domUpdates.showPopUp(clue);
  },

  showPopUp(clue) {
    let popUp = $('<section class="section__pop-up"></section>');
    popUp.html(`
      <p class="p--question">
        ${clue.question}
        <input type="text" class="input--answer">
        <input type="submit" value="Submit" class="input--submit">
      </p>
    `);
    $('body').prepend(popUp);
    $('.input--submit').on('click', function() {
      domUpdates.showClueFeedback(clue);
    });
  },

  showClueFeedback(clue){
    let userAnswer = $('.input--answer').val()
    let feedback;
    if (clue.validateAnswer(userAnswer)) {
      jeopardy.game.activePlayer.score += clue.pointValue;
      feedback = $('<p class="p--feedback">Correct</p>')
    } else {
      jeopardy.game.activePlayer.score -= clue.pointValue;
      feedback = $('<p class="p--feedback">NOPE</p>')
      jeopardy.game.changeActivePlayer();
    }
    $('.p--question').append(feedback);
    $('.p--question').append($('<button class="button--exit">Go back to main screen</button>'))
    $('.button--exit').on('click', function() {
      $('.section__pop-up').remove();
    });
    checkGameState()
    domUpdates.updateScoresOnDOM();
  },

  updatePlayersOnDOM() {
    $('.body--hidden').removeClass('body--hidden')
    jeopardy.players.forEach((player, index) => {
      $(`.h4__player-${index}-name`).text(player.name); 
    });
  },

  updateCategoriesOnDOM() {
    const currentRound = jeopardy.game.roundNumber - 1;
    jeopardy.rounds[currentRound].categories.forEach((category, i) => {
      $(`.article__cat${i}`).text(category);
    });
  },

  updateScoresOnDOM() {
    jeopardy.players.forEach((player, index) => {
      $(`.span__player-${index}-score`).text(player.score); 
    });   
  },

  highlightPlayer(player) {
    $('.span--round').text(jeopardy.game.roundNumber);
    jeopardy.players.forEach((player, i) => {
      if  (player.isActivePlayer === true) {
        $(`.section__player-${i}`).addClass('section--highlighted')
      } else {
        $(`.section__player-${i}`).removeClass('section--highlighted')
      };
    })    
  }
}