var dog, milkBottle;
var dataBase;
var foodStock, foodS;
var fedTime, lastFed;
var DogSadImg, DogHappyImg, milkBottleImg;
var feed, add;
var foodObj;
var bedroomImg, gardenImg, washroomImg; 
var readState, gameState;
var currentTime;

function preload(){

  DogSadImg = loadImage("images/dogImg.png");
  DogHappyImg = loadImage("images/dogImg1.png");
  milkBottleImg = loadImage("images/Milk.png");

  bedroomImg = loadImage("images/BedRoom.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/WashRoom.png");
  
}

function setup(){
  dataBase = firebase.database();
  createCanvas(600, 700);

  foodObj = new Food();
  
  
  //get the foodS
  foodStock = dataBase.ref('Food');
  foodStock.on("value", readStock);
  
  //get the lastFed time
  fedTime = dataBase.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  //read gameState
  readState = dataBase.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  dog = createSprite(width/2 + 100, height/2, 0, 0);
  dog.addImage(DogSadImg);
  dog.scale = 0.2;


  

  
  //button - feedDog
  feed = createButton("feed DRAGO");
  feed.position(750, 100);
  feed.mousePressed(feedDog);

  //button - addFoods
  add = createButton("Add Food");
  add.position(850, 100);
  add.mousePressed(addFood);
}


function draw(){
  background(46, 139, 87);

  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("Playing")
    foodObj.garden();
  }else if(currentTime == (lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();  
  }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  //foodObj.display();
  if(gameState != "Hungry"){
    feed.hide();
    add.hide();
    dog.remove();
  }else{
    feed.show();
    add.show();
    //dog = createSprite(width/2 + 100, height/2, 0, 0);
    //dog.addImage(DogSadImg);
    //dog.scale = 0.2;
  }


  //display time in the format of "am" and "pm"
  fill(255, 255, 254);
  textSize(15);
  textAlign(CENTER);
  if(lastFed >= 12){
    text("Last Feed: "+lastFed%12 + ":00 PM", width/2, 30);
  }else if(lastFed == 0){
    text("Last Feed: 12:00 AM", width/2, 30);
  }else{
    text("Last Feed: "+lastFed + ":00 AM", width/2, 30);
  } 

  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;     
  }else{
    x = x-1;
  }
  dataBase.ref('/').update({
    Food:x
  })
}

//feed the dog
function feedDog(){
  dog.addImage(DogHappyImg);
  //dog.scale = 0.2;

  //milkBottle = createSprite(width/2, height/2 + 25, 0, 0);
  //milkBottle.addImage(milkBottleImg);
  //milkBottle.scale = 0.1;

  //foodObj.updateFoodStock(foodObj.getFoodStock()-1); //minus bottles of milk
  foodObj.deductFood();
  dataBase.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//add the food
function addFood(){
  foodS++;
  dataBase.ref('/').update({
    Food: foodS
  })
}
function update(state){
  dataBase.ref('/').update({
     gameState: state
  });
}



