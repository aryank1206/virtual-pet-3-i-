//Create variables here
var dog,happyDog,database,foodS,foodStock,milkBottle;
var addFoodB,feedFoodB;
var fedTime,lastFed;
var foodObj;
var readState, gameStateS
var bedroomI, washroomI, gardenI
function preload()
{
	dog=loadImage("dogImg.png");
  happyDog=loadImage("dogImg1.png");
  milkBottle=loadImage("milk.png");
  bedroomI=loadImage("Bed Room.png")
  gardenI=loadImage("Garden.png");
  washroomI=loadImage("Wash Room.png")
}



function setup() {
  database=firebase.database();
	createCanvas(1000, 400);
  
  dog1=createSprite(800,200,150,150)
  dog1.addImage(dog);
  dog1.scale=0.2


  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  foodObj=new Food();
  //Buttons:
  //(i)
  feedFoodB=createButton("feed Dog");
  feedFoodB.position(700,100)
  feedFoodB.mousePressed(feedDog)

  //(ii)
  addFoodB=createButton("Add food")
  addFoodB.position(800,100);
  addFoodB.mousePressed(addFood);
  
  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val();
  })

}


function draw() {  

   background(46,139,87);

   
     fedTime=database.ref('feedTime');
     fedTime.on("value",function(data){
       lastFed=data.val();
     })

     fill(255,255,254);
     textSize(15);
     if(lastFed>=12){
       text("last Fed:"+lastFed%12+"PM",250,30);
     }
     else if(lastFed==0){
       text("Last Fed: 12 AM",350,30 );
     }

     else{
       text("Last Feed:"+lastFed+"AM",350,30);
     }

     currentTime=hour();
     if(currentTime==(lastFed+1)){
       update("Playing");
     }
     else if(currentTime==(lastFed+2)){
       update("Sleeping");
     }
     else if(currentTime<(lastFed+2)&& currentTime<=(lastFed+4)){
       update("Bathing");
     }
     else{
       update("Hungry");
       foodObj.display();
     }

       if(gameState!="Hungry"){
         feedFoodB.hide();
         addFoodB.hide();
         dog1.remove();   
       }
       else{
         feedFoodB.show();
         addFoodB.show();
         dog1.addImage(dog)
       }

     if(gameState=="Hungry"){
       text("The Dog is:Hungry!",500,350)
     }
      if(gameState=="Bathing"){
      text("The Dog is:Bathing!",500,350)
    }
    if(gameState=="Sleeping"){
      text("The Dog is:Sleeping!",500,350)
    }
    if(gameState=="Playing"){
      text("The Dog is:Playing!",500,350)
    }

       
   foodObj.display();
  drawSprites();
  //add styles here

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog1.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:second()
  })
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
