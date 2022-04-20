const choices = ["rock","paper","scissors"];
let dislocationPlayAgain = 0;


window.addEventListener("load", (event) => {
    const el = document.getElementsByClassName("background-modal");
    window.addEventListener("click", handleCloseModal, false);

    var rulesButton = document.getElementsByClassName("modal-rules")[0];
    rulesButton.addEventListener("click", handleOpenModal,false);

    for (const option of document.querySelectorAll(".options-container .option")) {
        option.addEventListener("click", selectOptionHandler, false);
    }

    document.getElementById("play-again-button").addEventListener("click", playAgain,false)
    document.getElementById("score").innerText = score;
},false);

function setScoreCookie(score) {
    document.cookie = `score=${score}; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure`;
}

let score = 0;
console.log(document.cookie);
if (document.cookie.length > 0 && document.cookie.indexOf("score") != -1) {
    console.log(document.cookie
        .split('; ')
        .find(row => row.startsWith('score='))
        .split('=')[1]);
    score = document.cookie
        .split('; ')
        .find(row => row.startsWith('score='))
        .split('=')[1];
}
else {
    setScoreCookie(score)
}

function setScore(newScore) {
    score = newScore;
    document.getElementById("score").innerText = newScore;
    setScoreCookie(newScore)
}


function getBoundingBox (element) {
    const box = element.getBoundingClientRect()
    const ret = { }

    // Loops through all DomRect properties.
    // Cannot spread because they're not enumerable.
    for (const prop in box) {
        ret[prop] = box[prop]
    }

    ret.xCenter = (box.left + box.right) / 2
    ret.yCenter = (box.top + box.bottom) / 2

    return ret
}

function vw(v) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
  }


function handleCloseModal (event) {

    var closeButton = document.getElementsByClassName("close")[0];
    
    var bgModal = document.getElementsByClassName("background-modal")[0];
    var modalContainer = document.getElementsByClassName("modal-container")[0];
    
    if(event.target == bgModal || event.target == closeButton || event.target == modalContainer) {
        bgModal.style.opacity = 0;
        modalContainer.style.top = "-100vh";
        setTimeout(() => {  bgModal.style.top = "-100vh"; }, 200);
    }
}

function handleOpenModal (event) {
    var bgModal = document.getElementsByClassName("background-modal")[0];
    var modalContainer = document.getElementsByClassName("modal-container")[0];
    bgModal.style.top = "0";
    bgModal.style.opacity = 1;
    modalContainer.style.top = "0";
}

const selectOptionHandler = (event) => {
    let wrappersToRemove = [];
    for (const option of document.querySelectorAll(".options-container .option")) {
        if(event.target != option && !option.contains(event.target)) {
            option.classList.add("not-selected");
            wrappersToRemove.push(option.closest(".option-wrapper"))
        }
    }
    

    if (vw(100) > 992) {
        const playerElement = document.getElementById("player-choice");
        const playAgainElement = document.getElementById("play-again");

        const boxPlayerElement = getBoundingBox(playerElement);
        const boxPlayAgain = getBoundingBox(playAgainElement);
        if(dislocationPlayAgain == 0){
            dislocationPlayAgain = boxPlayerElement.yCenter - boxPlayAgain.yCenter;
        }
        playAgainElement.style.transform = `translateY(${dislocationPlayAgain}px) scaleX(0)`

    }

    wrappersToRemove.forEach((wrapper) => wrapper.classList.add("not-selected"));
    setTimeout(() => {

        
        const playerChoice = document.getElementById("player-choice");
        let target = moveChoiceToResultScreen(event.target, playerChoice);

        target.classList.add("selected");
        target.parentNode.classList.add("selected");

        playerChoice.classList.add(target.id);
        playerChoice.getElementsByTagName("img")[0].src = target.getElementsByTagName("img")[0].src;

        wrappersToRemove.forEach((wrapper) => wrapper.style.visibility = "hidden");

        setTimeout(() => {
            document.getElementById("results-container").style.visibility = "";
            target.parentNode.style.visibility = "hidden";

            setTimeout(() => {
                const houseChoice = makeHouseChoice();
                const playerChoice = target.id;
                const winner = checkWinner(playerChoice,houseChoice);
                const playerElement = document.getElementById("player-choice");
                const houseElement = document.getElementById("house-choice");

                if (winner == 1) {
                    playerElement.classList.add("winner");
                    document.getElementById("text-result").innerText = "YOU WIN";
                    setScore(++score)
                }
                else if (winner == 2){
                    houseElement.classList.add("winner");
                    document.getElementById("text-result").innerText = "YOU LOSE";
                    setScore(--score)
                }
                else {
                    document.getElementById("text-result").innerText = "TIE";
                }
                setScoreCookie(score);

                if (vw(100) > 992) {
                    playerElement.style.transform = "translateX(-200px)"
                    houseElement.style.transform = "translateX(200px)"

                    setTimeout(() => {
                        const boxTarget = getBoundingBox(target);
                        const boxPlayerChoice = getBoundingBox(playerElement);

                        let transformOriginalChoice = target.style.transform;
                        let n=transformOriginalChoice.lastIndexOf(" ");
                        let str2 = transformOriginalChoice.substring(0,n) + ` translateX(${boxPlayerChoice.xCenter - boxTarget.xCenter}px) `
                            + transformOriginalChoice.substring(n);

                        target.style.transform = str2
                    }, 303);

                    
                    

                    const playAgainElement = document.getElementById("play-again");

                    const boxPlayerElement = getBoundingBox(playerElement);
                    const boxPlayAgain = getBoundingBox(playAgainElement);
                    const transform = `translateY(${dislocationPlayAgain}px) scaleX(1)`;
                    playAgainElement.style.transform = transform;
                }

                let ts = getBoundingBox(document.getElementsByClassName("results-container")[0]).width == vw(100)

            }, 500);

        }, 300);
        
    },150);
    
    document.querySelector(".options-container").style.backgroundImage = "none";
}

function playAgain(event) {
    const playerChoice = document.getElementById("player-choice");
    const selectedOption = document.querySelector(".option.selected");

    selectedOption.parentNode.style.visibility = "";

    document.getElementById("results-container").style.display = "none";
    document.getElementById("results-container").style.visibility = "hidden";
    const notSelected = document.getElementsByClassName("not-selected");
    while(notSelected.length) {
        notSelected[0].classList.remove('not-selected');
    }
    const selected = document.getElementsByClassName("selected");
    while(selected.length) {
        selected[0].style.transform = "";
        selected[0].classList.remove('selected');
    }
    for (const element of document.getElementsByClassName("option-wrapper")) {
        element.style.display = "";
        element.style.visibility = "";
        element.parentNode.style.visibility = "";
    }
    document.querySelector(".options-container").style.backgroundImage = "";

    document.getElementById("house-choice").classList = "house";
    document.getElementById("house-choice").style.transform = "";

    playerChoice.classList = "result player";
    playerChoice.style.transform = "";

    setTimeout(() => {
        document.getElementById("results-container").style.display = "";
    }, 300);

}


function moveChoiceToResultScreen(target, playerChoice) {

    //The operations need to be done on the option div. This checks if the click was made inside the div and if it wasnt, 
    //recovers it
    if (!target.classList.contains("option")) {
        target = target.closest(".option");
    }

    const boxTarget = getBoundingBox(target);
    const boxPlayerChoice = getBoundingBox(playerChoice);
    // const transform = `translate(${boxContainer.xCenter-boxTarget.xCenter}px, 0px)`;
    // Using the bounding box of the target of the click and the options container, calculate how much it should translate to
    // be in the center of the container
    let transform = `translate(${boxPlayerChoice.xCenter - boxTarget.xCenter}px, ${boxPlayerChoice.yCenter - boxTarget.yCenter}px) scale(${Math.min(300, vw(35)) / Math.min(200, vw(35))})`;
    target.style.transform = transform;


    return target;
}

function makeHouseChoice() {
    const houseChoice = choices[Math.floor(Math.random() * choices.length)];
    const houseChoiceContainer = document.getElementById("house-choice");
    houseChoiceContainer.classList.add(houseChoice);
    houseChoiceContainer.classList.add("active");
    houseChoiceContainer.getElementsByTagName("img")[0].src = `./images/icon-${houseChoice}.svg`;
    return houseChoice;
}

function checkWinner(choicePlayer,choiceHouse) {
    if (choicePlayer == choiceHouse) {
        return 0;
    }
    if(choicePlayer == "paper") {
        if(choiceHouse == "scissors") {
            return 2;
        }
        return 1;
    }
    if(choicePlayer == "rock") {
        if(choiceHouse == "paper") {
            return 2;
        }
        return 1;
    }
    if(choicePlayer == "scissors") {
        if(choiceHouse == "rock") {
            return 2;
        }
        return 1;
    }

}

