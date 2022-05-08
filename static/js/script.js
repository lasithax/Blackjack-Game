//Blackjack
let blackjackGame={
    'you' : {'scoreSpan': '#your-blackjack-result', 'div':'#your-box','score':0 } ,
    "dealer" : {'scoreSpan': '#dealer-blackjack-result', 'div':'#dealer-box','score':0 },
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],

    'cardsMap' : {'2':2, '3':3, '4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'K': 10,'J': 10,'Q': 10,'A' : [1,11]},
    
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,

    'isStand' :false,
    'isTurnsOver' :false,
};

const YOU=blackjackGame['you'];
const DEALER=blackjackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);

document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);

document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogic);


function showCard(activePlayer,randomIndex){
    if(activePlayer['score']<=21){
    let cardImage=document.createElement("img");
    cardImage.src = 'static/images/'+randomIndex+'.png';
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
}

function randomCard(){
    let r = Math.floor((Math.random() * 13));
    return blackjackGame['cards'][r];
}

//HIT Function

function blackjackHit(){
if(blackjackGame['isStand']===false){
{
    let card=randomCard();
    showCard(YOU,card);
    updateScore(card,YOU);
    showScore(YOU);
}
}
}

//Deal Function

function blackjackDeal(){
    if(blackjackGame['isTurnsOver']===true){
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for(i=0; i<dealerImages.length ; i++){
            dealerImages[i].remove();
        }
        for(i=0; i<yourImages.length ; i++){
            yourImages[i].remove();
        }
        //set scores to 0
        YOU['score']=0;
        DEALER['score']=0;
        //update YOU Score in front-end
        document.querySelector(YOU['scoreSpan']).textContent=YOU['score'];
        document.querySelector(YOU['scoreSpan']).style.color='white';
        //update Dealer Score in front-end
        document.querySelector(DEALER['scoreSpan']).textContent=DEALER['score'];
        document.querySelector(DEALER['scoreSpan']).style.color='white';
        //setting defaults for validation checks of buttons
        blackjackGame['isStand']=false;
        blackjackGame['isTurnsOver']=false;
        //update result text and color
        document.querySelector('#blackjack-result').textContent='Play Again';
        document.querySelector('#blackjack-result').style.color='white';
    }
}

//score

function updateScore(card,activePlayer){
    if(card==='A'){
    // if adding 11 keeps me below 21,add 11, otherwise, add 1
    if(activePlayer['score'] +blackjackGame['cardsMap'][card][1]<=21)
    {
        activePlayer['score']+=blackjackGame['cardsMap'][card][1];
    }
    else{
        activePlayer['score']+=blackjackGame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score']+=blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score']>21){
        document.querySelector(activePlayer['scoreSpan']).textContent='Bust';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    if(activePlayer['score']<=21){
    document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
    }
}

function updateTable(){
    document.querySelector('#wins').textContent=blackjackGame['wins'];
    document.querySelector('#losses').textContent=blackjackGame['losses'];
    document.querySelector('#draws').textContent=blackjackGame['draws'];
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand']=true;

    while(DEALER['score']<16 && blackjackGame['isStand']===true){
    let card=randomCard();
    showCard(DEALER,card);
    updateScore(card,DEALER);
    showScore(DEALER);
    await sleep(1000);
    }
    
    blackjackGame['isTurnsOver']=true;
    let winner=computeWinner();
    showResult(winner);
    
}

//Deciding Winner

function computeWinner(){
    let winner;
    if(YOU['score']<=21){
        //higher score than delaer or when dealer busts but you're 21 or under
        if(YOU['score']>DEALER['score'] || (DEALER['score']>21))
        {
            console.log(' you won ');
            winner = YOU;
            blackjackGame['wins']++;
        }
        else if(YOU['score']<DEALER['score']){
            console.log(' you Lost ');
            winner = DEALER;
            blackjackGame['losses']++;
        }
        else if(YOU['score']===DEALER['score']){
            console.log(' you drew ');
            blackjackGame['draws']++;
        }
    }
        //When user busts but dealer doesn't
        else if(YOU['score']>21 && (DEALER['score']<=21)){
            console.log(' you Lost ');
            winner = DEALER;
            blackjackGame['losses']++;
        }
        //you and the dealer busts
        else if(YOU['score']>21 && (DEALER['score']>21)){
            console.log(' you drew ');
            blackjackGame['draws']++;
        }

    return winner;
}

function showResult(winner){
    if(blackjackGame['isTurnsOver']===true){
        if(winner===YOU){
            document.querySelector('#blackjack-result').textContent='YOU WON';
            winSound.play();
            document.querySelector('#blackjack-result').style.color='Green';
        }
        else if(winner===DEALER){
            document.querySelector('#blackjack-result').textContent='YOU LOST';
            lossSound.play();
            document.querySelector('#blackjack-result').style.color='Red';
        }
        else {
            document.querySelector('#blackjack-result').textContent='YOU DREW';
            document.querySelector('#blackjack-result').style.color='black';
        }
        updateTable();
    }
}
