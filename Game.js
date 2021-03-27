class Game {
  constructor(){

  }

  getState(){
    //gat the gamestate from the database
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  
  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  ///the game, also async so we can make the game wait to get the data from the database before continuing without the information from the dataqbase needed
  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    //car sprites   Edit: and images for the sprites
    car1 = createSprite(100,200);
    car1.addImage("car1", car1_img);

    car2 = createSprite(300,200);
    car2.addImage("car2", car2_img);
    
    car3 = createSprite(500,200);
    car3.addImage("car3", car3_img);
    
    car4 = createSprite(700,200);
    car4.addImage("car4", car4_img);
    
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAtEnd();


    if(allPlayers !== undefined){

      background(198, 135, 103);
      image(track, 0, -displayHeight*4, displayWidth, displayHeight*5);

      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 260;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          cars[index - 1].shapeColor = "red";
          //moves camera
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    //end the game if the player moves to the end line
    if (player.distance>5200) {
      gameState = 2;
      player.rank+=1;
      Player.updateCarsAtEnd(player.rank);
    }



    drawSprites();


    if (player.rank > 0) {
      text("Rank: "+player.rank, -50, 50);
    }
  }

  //prints that the game has ended in the console
  end(){
    console.log("game ended");
    console.log(player.rank);
  }

}