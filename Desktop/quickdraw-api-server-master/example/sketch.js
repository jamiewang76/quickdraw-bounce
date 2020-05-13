let categoryName;
//------------------------------------------------------------
let x,y;
let strokeIndex = 0;
let index = 0;
let currentDrawing;
let prevx, prevy;
let myCanvas;
let phase;
let pgs = [];
//let pg;
let lastData;
let currentDrawingStrokeCount;
let totalStroke = 0;
let judge = true;
let m = 1;
//------------------------------------------------------------
//bouncing constants
let xSurface = 0;
let ySurface = 0;
let xspeed;
let yspeed;
//------------------------------------------------------------


function setup() {
  myCanvas = createCanvas(window.innerHeight, window.innerWidth);

  categoryName = createInput("cat");
  categoryName.position(10, height);

  button = createButton("Draw");
  button.mousePressed(requestCategory);
  button.position(150, height);

  requestCategory();

  //------------
  // pg = createGraphics(255,255);
  //------------
}

function requestCategory() {
  loadJSON(
    `http://localhost:8080/drawing/${encodeURI(categoryName.value())}`,
    drawCategory,
    (err) => alert("no such drawing")
  );
}

function drawCategory(data) {
  clear();
  if (data.code == 404) {
    alert("No such drawing");
    return;
  }
  noFill();

//------------------------------------------------------------


currentDrawing = data.drawing;
m=1;
pg = createGraphics(255,255);

//------------------------------------------------------------
  // data.drawing.forEach(([xs, ys]) => {
  //   beginShape();
  //   xs.forEach((x, i) => vertex(x, ys[i]));
  //   endShape(CLOSE);
  // });

}

function draw(){
  clear();
  index = 0
  strokeIndex = 0
  
  if(currentDrawing){
    for(d=0;d<currentDrawing.length;d++){
      
        totalStroke = totalStroke+currentDrawing[d][0].length-1;
      
    }
    
  }

console.log(totalStroke);

if(frameCount % 10 === 0){
  m++;
}
  
      for (let k=0;k<m;k++){
        drawNextStroke();
      }
  
  //m = 1;
  for(let i = 0;i<pgs.length;i++){
    //console.log('in loop');
    image(pgs[i],pgs[i][0],pgs[i][1]);
    pgs[i][0]+=pgs[i][2];
    pgs[i][1]+=pgs[i][3];
    if (pgs[i][0] > window.innerWidth - 127.5 || pgs[i][0] < 127.5) {
      pgs[i][2] = -pgs[i][2];
    }
    if (pgs[i][1] > window.innerHeight - 127.5 || pgs[i][1] < 127.5) {
      pgs[i][3] = -pgs[i][3];
    }
  }

}

function drawNextStroke() {
  //clear();
  rect(0, 0, 10, 10);
  //------------------------------------------------------------
  if(currentDrawing){

    let x = currentDrawing[strokeIndex][0][index];
    let y = currentDrawing[strokeIndex][1][index];
    //console.log(currentDrawing.length);
    //point(x,y);
    //console.log(prevx,prevy);
    line(prevx,prevy,x,y);
    //console.log(x,y);
    stroke(0);
    strokeWeight(3);
    index++;
    if(index>=currentDrawing[strokeIndex][0].length){

      strokeIndex++;
      prevx = undefined;
      prevy = undefined;
      index = 0;
      if(strokeIndex==currentDrawing.length){

        lastData = currentDrawing;
        //console.log(lastData);
        currentDrawing = null;
        currentDrawing = undefined;
        strokeIndex = 0;
        //loadJSON('/angel',gotDrawing);

      }
    }else{

    prevx = x;
    prevy = y;
  }
  phase = true;
  //console.log(data);

  //console.log(currentDrawing);
}else{
  //console.log(data);
  if(phase){
    //('drawing end!');
    //clear();
    phase = false;

    saveDraft(pg,lastData);

  
  }

  //console.log('drawing end!');
}

  //------------------------------------------------------------
    //floating();
    // for(let i = 0;i<pgs.length;i++){
    //   //console.log('in loop');
    //   image(pgs[i],pgs[i][0],pgs[i][1]);
    //   pgs[i][0]+=pgs[i][2];
    //   pgs[i][1]+=pgs[i][3];
    //   if (pgs[i][0] > window.innerWidth - 127.5 || pgs[i][0] < 127.5) {
    //     pgs[i][2] = -pgs[i][2];
    //   }
    //   if (pgs[i][1] > window.innerHeight - 127.5 || pgs[i][1] < 127.5) {
    //     pgs[i][3] = -pgs[i][3];
    //   }
    // }
}

//------------------------------------------------------------
function saveDraft(surface, lastData){
  surface.background('white');
  console.log('draft saved');
  //console.log(lastData);
  for(let path of lastData){
    surface.noFill();
    surface.stroke(0);
    surface.strokeWeight(3);
    surface.beginShape();
    for(let i = 0;i<path[0].length;i++){
      let x = path[0][i];
      let y = path[1][i];
      surface.vertex(x,y);
    }
    surface.endShape();
  }
  //image(surface,0,0);
  let x1 = Math.random() * 500+255;
  let y1 = Math.random() * 500+255;
  surface[0] = 256;
  surface[1] = 256;

  xspeed = Math.random()*10;
  yspeed = Math.random()*10;

  surface[2] = xspeed;
  surface[3] = yspeed;
  //console.log(x1,y1);
  //image(surface,x1,y1);
  if (pgs.length>=10){
    pgs.shift();
  }
  pgs.push(surface);
}


function floating(){
  //console.log(xSurface,ySurface);
  image(pg,xSurface,ySurface);
  xSurface += xspeed;
  ySurface += yspeed;
  if (xSurface > window.innerWidth - 127.5 || xSurface < 127.5) {
    xspeed = -xspeed;
  }
  if (ySurface > window.innerHeight - 127.5 || y < 127.5) {
    yspeed = -yspeed;
  }
}
//------------------------------------------------------------