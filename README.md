# Countdown-Page

## Getting Started

1. Clone the repository
2. Join to the correct path of the clone
3. Install LiveServer extension from Visual Studio Code [OPTIONAL]
4. Click in "Go Live" from LiveServer extension

---

1. Clone the repository
2. Join to the correct path of the clone
3. Open index.html in your favorite navigator

## Description

I made a web page that allows you to see a countdown, it can be very useful for the section of a page where a new game, product or something like that is about to be released.

## Feel free to edit my code

This function formats the time, i.e., if it is greater than 10 it will show the normal time, if it is less than 10 it will show a 0 ahead.

```
function format0(item){
    if (item < 10){
        item = `0${item}`
    }
    return item;
}
```

Get days

```
const unDia = 24 * 60 * 60 * 1000;

let diasRestantes = Math.floor(tiempoRestante / unDia);
```

Get hours

```
const unaHora = 60 * 60 * 1000;

let horasRestantes = Math.floor((tiempoRestante % unDia) / unaHora);
```

Get minutes

```
const unMin = 60 * 1000;

let minsRestantes = Math.floor((tiempoRestante % unaHora) / unMin);
```

Get seconds

```
const unSeg = 1000;

let segRestantes = Math.floor((tiempoRestante % unMin) / unSeg);
```

## Technologies used

1. Javascript
2. CSS3
3. HTML5

## Galery

![Countdown](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/countdown-0.jpg)

![Countdown](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/countdown-1.jpg)

![Countdown](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/countdown-2.jpg)

![Countdown](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/countdown-3.jpg)

## Portfolio Link

`https://diegolibonati.github.io/DiegoLibonatiWeb/#/projects?q=Countdown%20page`

## Video


https://user-images.githubusercontent.com/99032604/199129935-7fee4660-6ad7-4417-b4dc-70f5934e4e0d.mp4

