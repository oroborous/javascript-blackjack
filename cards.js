const imageDirectory = "cards-png-100x153-numbered";

var playerHand = 0;
var dealerHand = 0;
var gameOver = false;

$(document).ready(function () {
    $("#hit").click(playerHit);
    $("#stand").click(playerStand);
    $("#playAgain").click(startGame);

    startGame();

    function startGame() {
        // clear out the winner paragraph
        $("p").text("");

        // hide the "Play Again" button
        $("#playAgain").hide();

        // reset both scores
        playerHand = 0;
        dealerHand = 0;

        // reset game over flag
        gameOver = false;

        // Give the player their first card
        playerHit();
    }

    function playerHit() {
        // call the drawCard function to generate a new card
        drawCard("player");

        // after the player goes, the dealer goes
        dealerTurn();
    }


    function dealerTurn() {
        // Dealer must take a card on 17 or less
        if (dealerHand <= 17) {
            // call the drawCard function to generate a new card
            drawCard("dealer");
        }

        // Did the dealer bust?
        if (dealerHand > 21) {
            $("#dealerTotal").text("Bust!");
            // game is over
            gameOver = true;
        }

        // Did the player bust?
        if (playerHand > 21) {
            $("#playerTotal").text("Bust!");
            // game is over
            gameOver = true;
        }

        if (gameOver)
        {
            endGame();
        }
    }

    function playerStand() {
        // game is over when player declines more cards
        gameOver = true;

        // dealer gets one more turn
        dealerTurn();
    }

    function endGame() {
        // Get the last card in the player's area
        var lastCard = $("#playerArea img").last();

        // Remove all images from both play areas
        $(".playArea img").remove();

        // Add the card to the discard pile
        $("#discardPile").empty().append(lastCard);

        // Who had more points?
        if (playerHand > dealerHand && playerHand <= 21) {
            $("p").text("You win!");
        } else if (dealerHand > playerHand && dealerHand <= 21) {
            $("p").text("Dealer wins!");
        } else {
            $("p").text("No winner this hand");
        }

        // Show the Play Again button
        $("#playAgain").show();
    }


    function drawCard(forPlayer) {
        // Create a new image element
        var cardImage = $("<img>");

        // set the image's alt text
        cardImage.attr("alt", "playing card");

        // Generate random number 1 - 52
        var randomNumber = Math.floor(Math.random() * 52) + 1;

        // What is the card's face value? 13 cards per suit
        var faceValue = randomNumber % 13;

        // What is this card worth?
        var points;

        // Determine a card's points
        if (faceValue === 1) // ace
        {
            points = 11;
        } else if (faceValue > 1 && faceValue < 11) // 2 - 10
        {
            points = faceValue;
        } else // jack, queen, king
        {
            points = 10;
        }

        if (forPlayer === "dealer") {
            // add points to dealer
            dealerHand += points;

            // How many cards are in the dealer's area?
            var numDealerCards = $("#dealerArea img").length;

            // if this is the dealer's first card
            if (numDealerCards === 0) {
                // put new total on screen
                $("#dealerTotal").text(`: ${dealerHand} Showing`);

                // create a face-up card
                // set the image's src attribute
                cardImage.attr("src", `${imageDirectory}/${randomNumber}.png`);
            } else {
                // create a face-down card
                cardImage.attr("src", `${imageDirectory}/blue_back.png`);
            }

            // add the card to the dealer's area of the table
            $("#dealerArea").append(cardImage);
        } else {
            // add points to player
            playerHand += points;

            // put new total on screen
            $("#playerTotal").text(`: ${playerHand}`);

            // create a face-up card
            // set the image's src attribute
            cardImage.attr("src", `${imageDirectory}/${randomNumber}.png`);

            // add the card to the player's area of the table
            $("#playerArea").append(cardImage);
        }
    }
});