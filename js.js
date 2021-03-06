// LEECHER - PARAVONAT
// GAME
// Made by Kutor
// Started on 2018.07.17.
// (yeah, I didn't reall use ternary operators back then, I should have)


// SOME GENERAL VARIABLES

let playerName = "";

let trainTexts = ["ROSSZ DOLOG #1", "ROSSZ DOLOG #2", "ROSSZ DOLOG #3", "ROSSZ DOLOG #4", "ROSSZ DOLOG #5", "ROSSZ DOLOG #6", "ROSSZ DOLOG #7", "ROSSZ DOLOG #8", "ROSSZ DOLOG #9", "ROSSZ DOLOG #10", ];
let trainTextsCurrentCharacter = [];

let trainCount = 0;
let trainsGone = 0;
let animationSpeed = 15;
let trainInterval = 900;
let playerLevel = 1;
let gameOver = false;
let bonusCount = 0;

const music_eclipse = new Audio('sound/music1.ogg');
const sound_lvl = new Audio('sound/sound_lvl.ogg');
const sound_explode = new Audio('sound/sound_explode.ogg');
const sound_victory = new Audio('sound/sound_victory.ogg');
const sound_bonus = new Audio('sound/sound_bonus.ogg');
const sound_trainGone = new Audio('sound/sound_trainGone.ogg');
const sound_train1 = new Audio('sound/sound_train1.ogg');
const sound_train2 = new Audio('sound/sound_train2.ogg');
const sound_train3 = new Audio('sound/sound_train3.ogg');
const trainSounds = [sound_train1, sound_train2, sound_train3];
let currentMusic;

const playerDiv = document.getElementById("player");
const playArea = document.getElementById("play_area");

const playSound = (sound) => {
  if (currentMusic.volume > 0) {
    sound.play();
  }
}


// START THE GAME

const playerCharacters = [{
    id: 0,
    name: "Anett",
    image: "img/img_char_anett.png",
    charText: "A zenekar csalogánya",
    charArray: ["ANETT ROSSZ DOLOG 1", "ANETT ROSSZ DOLOG 2"],
  },
  {
    id: 1,
    name: "Ági",
    image: "img/img_char_agi.png",
    charText: "A szexi csellós lány",
    charArray: ["ÁGI ROSSZ DOLOG 1", "ÁGI ROSSZ DOLOG 2"],
  },
  {
    id: 2,
    name: "Barci",
    image: "img/img_char_barci.png",
    charText: "A rezidens metálisten",
    charArray: ["BARCI ROSSZ DOLOG 1", "BARCI ROSSZ DOLOG 2"],

  },
  {
    id: 3,
    name: "Dáve",
    image: "img/img_char_dave.png",
    charText: "A tomboló dob-romboló",
    charArray: ["DÁVE ROSSZ DOLOG 1", "DÁVE ROSSZ DOLOG 2"],
  },
  {
    id: 4,
    name: "Prétor",
    image: "img/img_char_pretor.png",
    charText: "Az egofil komponista",
    charArray: ["PRÉTOR ROSSZ DOLOG 1", "PRÉTOR ROSSZ DOLOG 2"],
  },
  {
    id: 5,
    name: "Márton",
    image: "img/img_char_marton.png",
    charText: "Ratyi Kapitány",
    charArray: ["MÁRTON ROSSZ DOLOG 1", "MÁRTON ROSSZ DOLOG 2"],
  },
];


const init = () => {
  document.getElementById("data_field").style.display = "none";
  for (i = 0; i < playerCharacters.length; i++) {
    document.getElementById("select_players").innerHTML += `<div class='${playerCharacters[i].id} character character_select ' id='${playerCharacters[i].name}'><img class="img_char" src="${playerCharacters[i].image}"><h4>${playerCharacters[i].name.toUpperCase()}</h4><p>${playerCharacters[i].charText}</p></div>`;
  }
  for (i = 0; i < playerCharacters.length; i++) {
    document.getElementsByClassName(i)[0].addEventListener("click", function () {
      playerName = this.id;

      for (k = 0; k < playerCharacters.length; k++) {
        if (playerCharacters[k].name == playerName)
          trainTextsCurrentCharacter = playerCharacters[k].charArray;
      }
      newGame();
    }, false);
  }
}


// THE GAME ITSELF
const newGame = () => {
  document.getElementById("init_screen").parentNode.removeChild(document.getElementById("init_screen"));
  document.getElementById("data_field").style.display = "flex";
  document.getElementById("display_player_name").innerHTML = playerName.toUpperCase();

  for (i = 0; i < document.getElementsByClassName("img_train").length; i++) {
    document.getElementsByClassName("img_train")[i].parentNode.removeChild(document.getElementsByClassName("img_train")[i]);
  }


  // GENERAL FUNCTIONS

  const levelDisplay = () => {
    document.getElementById("display_player_level").innerHTML = `SZINT: ${playerLevel}`;
  }

  // music control
  const div_soundControl = document.getElementById("sound_control");
  div_soundControl.addEventListener("click", function () {
    if (currentMusic.volume > 0) {
      currentMusic.volume = 0;
      div_soundControl.innerHTML = "HANG BE";
    } else {
      currentMusic.volume = 1;
      div_soundControl.innerHTML = "HANG KI";
    }
  }, false);

  const reloadGame = () => {
    location.reload(true);
  }


  // CREATE railways, will have railway texture

  const gameAreaHeight = playArea.clientHeight;
  const divider = 9;
  const railwayHeight = Math.floor(gameAreaHeight / divider - 10);
  const trainsDistance = railwayHeight + 10;
  const railwayCount = Math.floor(gameAreaHeight / railwayHeight) - 1;

  playerDiv.style.height = railwayHeight - 10 + "px";
  playerDiv.style.width = playerDiv.style.height;


  // SPAWN TRAINS RANDOMLY

  var trackPositions = [0];
  trackPosTemp = 0;


  // calculate the possible starting vertical positions for trains, i.e. the tracks
  for (i = 0; i < railwayCount; i++) {
    trackPositions.push(trackPosTemp + railwayHeight + 5);
    trackPosTemp += railwayHeight + 5;
  }


  // spawn trains randomly onto the tracks, with timeout as trainInterval
  let lastTrack = 0;
  let whichTrack;
  let currentTrain;
  let currentImage;
  let currentBonus;

  const spawnTrains = setInterval(() => {

    if (gameOver == false) {

      // at every 10th train, increase animation speed for subsequent trains
      if (trainsGone % 10 === 0 && trainInterval > 100 && trainsGone > !0) {
        trainInterval -= 80;
        animationSpeed--;
        playerLevel++;
        levelDisplay();
        $('html > head').append($(`<style>.img_train${playerLevel} { animation-name: trains; animation-duration: ${animationSpeed}s; animation-timing-function: linear;}</style> `));

        currentBonus = document.createElement("div");
        currentBonus.setAttribute("class", "bonus moving");
        currentBonus.style.top = trackPositions[whichTrack] + "px";
        currentBonus.style.height = railwayHeight + "px";

        currentText = document.createElement("h5");
        currentText.appendChild(document.createTextNode("POZITÍV HULLÁMOK"));
        currentBonus.appendChild(currentText);

        playArea.appendChild(currentBonus);

        playSound(trainSounds[Math.floor(Math.random() * trainSounds.length)]);

      }


      whichTrack = Math.floor(Math.random() * railwayCount) + 0;

      if (whichTrack != lastTrack) {

        lastTrack = whichTrack;
        trainCount++;

        currentTrain = document.createElement("div");
        currentTrain.setAttribute("class", `train img_train img_train${playerLevel} moving`);
        currentTrain.style.top = trackPositions[whichTrack] + "px";
        currentTrain.style.zIndex = trainCount;
        currentTrain.style.height = railwayHeight + "px";
        currentTrain.style.left = "105%";

        currentImage = document.createElement("img");
        currentImage.src = `img/img_kutor_${Math.floor(Math.random() * (2 - 0 + 1)) + 0}.png`;
        currentImage.align = "left";
        currentTrain.appendChild(currentImage);

        currentText = document.createElement("h5");
        currentText.appendChild(document.createTextNode(`${trainTexts[Math.floor(Math.random() * trainTexts.length)]}`));
        currentTrain.appendChild(currentText);

        playArea.appendChild(currentTrain);
      } else { //REVERSE TRAINS
        currentTrain = document.createElement("div");
        currentTrain.setAttribute("class", "img_train_reverse train moving");
        currentTrain.style.top = trackPositions[whichTrack] + "px";
        currentTrain.style.zIndex = trainCount;
        currentTrain.style.height = railwayHeight + "px";
        currentTrain.style.right = "105%";

        currentText = document.createElement("h5");
        currentText.appendChild(document.createTextNode(`${trainTextsCurrentCharacter[Math.floor(Math.random() * trainTextsCurrentCharacter.length)]}`));
        currentTrain.appendChild(currentText);

        playArea.appendChild(currentTrain);
      }
    }
    // after evading the 100th train, you win the game
    if (trainsGone >= 100) {
      stahp();
    }
  }, trainInterval)


  // COLLISION

  var rect1;
  var rect2;

  const collideCheck = (diva, divb) => {

    rect1 = {
      x: diva.getBoundingClientRect().x,
      y: diva.getBoundingClientRect().y,
      width: diva.getBoundingClientRect().width,
      height: diva.getBoundingClientRect().height
    };
    rect2 = {
      x: divb.getBoundingClientRect().x,
      y: divb.getBoundingClientRect().y,
      width: divb.getBoundingClientRect().width,
      height: divb.getBoundingClientRect().height
    };

    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y) {
      return true;
    }
    return false;
  }

  const collision = setInterval(() => {
    // remove trains thet have gone off-screen; not exactly a part of collision, but saves processing power to do it in the same function
    for (i = 0; i < document.getElementsByClassName("img_train").length; i++) {
      if (document.getElementsByClassName("img_train")[i].getBoundingClientRect().right <= 0) {
        document.getElementsByClassName("img_train")[i].parentNode.removeChild(document.getElementsByClassName("img_train")[i]);
        trainsGone++;
        document.getElementById("display_train_count").innerHTML = `PARAVONATOK: ${trainsGone}`;
      }
    }
    for (j = 0; j < document.getElementsByClassName("bonus").length; j++) {
      if (document.getElementsByClassName("bonus")[j].getBoundingClientRect().right <= 0) {
        document.getElementsByClassName("bonus")[j].parentNode.removeChild(document.getElementsByClassName("bonus")[j]);
      }
    }

    // actual collision detection

    for (k = 0; k < document.getElementsByClassName("moving").length; k++) {
      if (collideCheck(player, document.getElementsByClassName("moving")[k]) == true) {
        if (document.getElementsByClassName("moving")[k].classList.contains("train")) { // IT'S A TRAIN
          if (bonusCount == 0) { // if player doesn't have buff, game over
            clearInterval(collision);
            stahp();
          } else { // if bonus is on, clear train and remove buff from player
            document.getElementsByClassName("train")[k].parentNode.removeChild(document.getElementsByClassName("moving")[k]);
            playSound(sound_trainGone);
            bonusCount--;
            document.getElementById("display_bonuses").innerHTML = `POZITÍV HULLÁMOK: ${bonusCount}`;
            if (bonusCount == 0) {
              player.classList.remove("buffed")
            }
          }
        } else { // IT'S A BONUS
          document.getElementsByClassName("train")[k].parentNode.removeChild(document.getElementsByClassName("moving")[k]);
          sound_bonus.play();
          if (bonusCount == 0) {
            player.classList.add("buffed")
          }
          bonusCount++;
          document.getElementById("display_bonuses").innerHTML = `POZITÍV HULLÁMOK: ${bonusCount}`;
          document.getElementsByClassName("bonus")[m].parentNode.removeChild(document.getElementsByClassName("bonus")[m]);
        }
      }
    }
  }, 20);


  //GAME OVER

  const stahp = () => {

    for (i = 0; i < document.getElementsByClassName("moving").length; i++) {
      document.getElementsByClassName("moving")[i].style.animationPlayState = "paused";
    }

    gameOver = true;
    document.getElementById("new_game").style.display = "block";
    document.getElementById("new_game").addEventListener("click", reloadGame, false);
    currentMusic.pause();

    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "game_over"
    playArea.appendChild(gameOverScreen);

    if (trainsGone < 100) {
      playSound(sound_explode);
      gameOverScreen.innerHTML = `<h1>GAME OVER<br></h1><h2>Elgázolt a paravonat!<br><br></h2><h3>Sajnáljuk, ${playerName}! Hősiesen küzdöttél, de a ${trainsGone+1}. paravonat elől már te sem tudtál megmenekülni.<br>A zenekar projektje sikertelenül zárult, a Leecher feloszlott, és mindenki megy a maga útjára.<br></h3><h4>Ha még mindig ég a tűz a szívedben és nem adtad fel a küzdelmet, kezdj egy új játékot! De ezúttal úgy kéne, hogy jó legyen!</h4>`;
    } else {
      clearInterval(spawnTrains);
      playSound(sound_victory);
      gameOverScreen.innerHTML = `<h1>GYŐZELEM!<br></h1><br><h3>Gratulálunk, ${playerName}! Hősies küzelmed és halált megvető bátorságod megmentette a zenekart minden veszélytől, ami tervetekre leselkedett.<br> Mr. Negatív belátta, hogy károgása és negatív hullámai nem akadályozhatják a Leecher fényes győzelmét.<br>A zenekar örökké hősként fog ünnepelni!`;
    }
  }


  // MOVEMENT -- thanks to http://jsfiddle.net/fbFuW/220/

  setInterval(movePlane, 20);
  var keys = {}

  $(document).keydown(function (e) {
    keys[e.keyCode] = true;
  });

  $(document).keyup(function (e) {
    delete keys[e.keyCode];
  });

  function movePlane() {
    if (!gameOver) {
      for (var direction in keys) {
        if (!keys.hasOwnProperty(direction)) continue;
        /*
        if (direction == 37) {
            $("#player").animate({left: "-=5"}, 0);                
        }
        if (direction == 39) {
          $("#player").animate({left: "+=5"}, 0);  
      }
      */
        if (direction == 38 && player.getBoundingClientRect().top > playArea.getBoundingClientRect().top + 3) {
          $("#player").animate({
            top: "-=4"
          }, 0);
        }

        if (direction == 40 && player.getBoundingClientRect().bottom < playArea.getBoundingClientRect().bottom) {
          $("#player").animate({
            top: "+=4"
          }, 0);
        }
      }
    }

  }


  // INITIALIZE VARIABLES FOR GAME START
  currentMusic = music_eclipse;
  currentMusic.play();
  currentMusic.loop = true;
  playerDiv.innerHTML = playerName;
  levelDisplay();
  //createRailways();
  spawnTrains();
}

init();
