let game = document.getElementById("game");

// делим поле на ячейки

for (let i=1; i<101; i++) {
    let excel = document.createElement("div");
    game.appendChild(excel);
    excel.classList.add("excel");
}

//присваиваем координаты

let excel = document.getElementsByClassName("excel");
let x = 1, 
    y = 10;

for (let i=0; i<excel.length; i++){
    if (x>10) {
        x=1;
        y--;
    }
    
    excel[i].setAttribute("posX", x);
    excel[i].setAttribute("posY", y);
    x++;
}
//создаем змею

function generateSnake(){
    let posX = Math.round(Math.random() * (10-3)+3);
    let posY = Math.round(Math.random() * (10-1)+1);
    return [posX, posY];
}
let coordinates = generateSnake();

let snakeBody = [document.querySelector('[posX ="' + coordinates[0] + '"][posY = "'+ coordinates[1] + '"]'), 
                document.querySelector('[posX ="' + (coordinates[0]-1) + '"][posY = "'+ coordinates[1] + '"]'), 
                document.querySelector('[posX ="' + (coordinates[0]-2) + '"][posY = "'+ coordinates[1] + '"]')];

for (let i=0; i<snakeBody.length; i++){
    snakeBody[i].classList.add('snakeBody');
}
snakeBody[0].classList.add('snakeHead');

//создаем яблоко

let apple;

function createApple(){
    function generateApple() {
        let posX = Math.round(Math.random() * (10-3)+3);
        let posY = Math.round(Math.random() * (10-1)+1);
        return [posX, posY];   
    }
    
    let appleCoordinates = generateApple();
   

    apple = document.querySelector('[posX ="' + appleCoordinates[0] + '"][posY = "'+ appleCoordinates[1] + '"]');

    while (apple.classList.contains('snakeBody')) {
        let appleCoordinates = generateApple();
        apple = document.querySelector('[posX ="' + appleCoordinates[0] + '"][posY = "'+ appleCoordinates[1] + '"]');
    }

    apple.classList.add('apple');
}
createApple();


// считаем очки
let input = document.querySelector(".points_now");
let score = 0;
input.value = score;

//записываем рекорд
let inputRec = document.querySelector(".points_record");
let highScore = 0;
// inputRec.value = highScore;
// let scoreEnd = 0;


const updateHighScore = () => {
    const highScore = parseInt(localStorage.getItem('highScore'), 10);
    if (score > highScore) {
      localStorage.setItem('highScore', score);
      inputRec.value = highScore;
    }
  };
  
  window.onload = function () {
    // canvas = document.querySelector('#canvas');
    // canvasContext = canvas.getContext('2d');
    if (localStorage.getItem('highScore') === null) {
      localStorage.setItem('highScore', 0);
    } else {
        inputRec.value = localStorage.getItem('highScore');
    }

  }




//движение змеи

let direction = 'right';

// steps - переменная, которая не дает нажать сразу несколько кнопок. следующую кнопку можно нажать только после предыдущего шага.
let steps = false;

function move() {
    let snakeCoordinates = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];
    snakeBody[0].classList.remove('snakeHead');
    snakeBody[snakeBody.length-1].classList.remove('snakeBody');
    snakeBody.pop();

    if (direction == 'right') {
        if (snakeCoordinates[0] < 10) {
            snakeBody.unshift(document.querySelector('[posX ="' + (+snakeCoordinates[0] + 1) + '"][posY = "'+ snakeCoordinates[1] + '"]'));
            
        } else {
            snakeBody.unshift(document.querySelector('[posX ="1"][posY = "'+ snakeCoordinates[1] + '"]'));
        }
    } else if (direction == 'left') {
        if (snakeCoordinates[0] > 1) {
            snakeBody.unshift(document.querySelector('[posX ="' + (+snakeCoordinates[0] - 1) + '"][posY = "'+ snakeCoordinates[1] + '"]'));
    
        } else {
            snakeBody.unshift(document.querySelector('[posX ="10"][posY = "'+ snakeCoordinates[1] + '"]'));
        }
    } else if (direction == 'up') {
        if (snakeCoordinates[1] < 10 ) {
            snakeBody.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY = "'+ (+snakeCoordinates[1]+1) + '"]'));
    
        } else {
            snakeBody.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY = "1"]'));
        }
    } else if (direction == 'down') {
        if (snakeCoordinates[1] > 1) {
            snakeBody.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY = "'+ (+snakeCoordinates[1] -1) + '"]'));
    
        } else {
            snakeBody.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY = "10"]'));
        }
    }

   if (snakeBody[0].getAttribute('posX') == apple.getAttribute('posX') && snakeBody[0].getAttribute('posY') == apple.getAttribute('posY')) {
    apple.classList.remove('apple');
    let a = snakeBody[snakeBody.length-1].getAttribute('posX');
    let b = snakeBody[snakeBody.length-1].getAttribute('posY');
    snakeBody.push(document.querySelector('[posX = "'+ a + '"][posY = "' + b + '"]'));
    createApple();
    score++;
    input.value = score;
    
   }
// если у головы появляется класс тела - змея врезалась в себя

   if (snakeBody[0].classList.contains('snakeBody')){
    
    alert(
        `          Игра окончена. 
        Нажмите кнопку "Сбросить" для начала новой игры. 

        Набранные очки: ${score}`);
    updateHighScore();
    clearInterval(interval);
    
   }

    snakeBody[0].classList.add('snakeHead');
    for (let i=0; i < snakeBody.length; i++) {
        snakeBody[i].classList.add('snakeBody');
    }
    steps = true;
}

let interval = setInterval(move, 500);

window.addEventListener('keydown', function (e) {
    if (steps == true){
        if (e.key == 'ArrowRight' && direction!='left'){
            direction = 'right';
            document.querySelector('.snakeHead').style = 'transform: rotate(90deg);';
            steps = false;
          } 
          else if (e.key == 'ArrowLeft' && direction!='right') {
              direction = 'left';
              document.querySelector('.snakeHead').style = 'transform: rotate(-90deg);';

              steps = false;
          } else if (e.key == 'ArrowUp' && direction!='down') {
              direction = 'up';
              steps = false;
          } else if (e.key == 'ArrowDown' && direction!='up') {
              direction = 'down';
              document.querySelector('.snakeHead').style = 'transform: rotate(180deg);';
              steps = false;
          }
    }
    
});
function reload () {//перегрузка параметров (кнопка «Сбросить»)
    window.location.reload();
}