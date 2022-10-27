const months =[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const giveaway = document.querySelector(".info-center h4");
const tiempo = document.querySelectorAll(".cd-center h4");
const countdownOver = document.querySelector(".countdown-container");

const fechaFinal = new Date(2022, 6, 29, 17, 30, 0);

giveaway.textContent = `Giveaway Ends On ${weekdays[fechaFinal.getDay()]}, ${fechaFinal.getDate()} ${months[fechaFinal.getMonth()]} ${fechaFinal.getFullYear()} ${fechaFinal.getHours()}:${fechaFinal.getMinutes()}am`;


function obtenerTiempoRestante(){
const fechaActual = new Date();

let tiempoRestante = fechaFinal - fechaActual;

const unDia = 24 * 60 * 60 * 1000; 
const unaHora = 60 * 60 * 1000;
const unMin = 60 * 1000;
const unSeg = 1000; 

let diasRestantes = Math.floor(tiempoRestante / unDia);
let horasRestantes = Math.floor((tiempoRestante % unDia) / unaHora); 
let minsRestantes = Math.floor((tiempoRestante % unaHora) / unMin); 
let segRestantes = Math.floor((tiempoRestante % unMin) / unSeg); 

const arrayTiempoRestante = [diasRestantes, horasRestantes, minsRestantes, segRestantes];

function format0(item){
    if (item < 10){
        item = `0${item}`
    }
    return item;
}


tiempo.forEach(function(t, index){
    t.innerHTML = format0(arrayTiempoRestante[index]);
});

if(tiempoRestante <= 0){
    clearInterval(cd);
    countdownOver.innerHTML = "<p> Finalizo :( </p>"
}

}

let cd = setInterval(obtenerTiempoRestante, 1000);

obtenerTiempoRestante();