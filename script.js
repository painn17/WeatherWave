import { api } from "./api.js";

let current_town = "Лондон"
let current_lang = "ru";

let weather_container = document.querySelector("#weather_container");
let weather_card = document.querySelector("#weather_card")

let weather_data =  document.querySelector("#weather-label")
let pressure_data =  document.querySelector("#pressure")
let temp_feels_data =  document.querySelector("#temp-feels")
let temp_data =  document.querySelector("#temp")
let wind_speed_data =  document.querySelector("#wind-speed")
let humidity_data =  document.querySelector("#humidity")
let town_data = document.querySelector("#town")

let find_label = document.querySelector("#find")
let find_button = document.querySelector("#find-button")
let town_input = document.querySelector("#town-input")
let expand = document.querySelector(".expand")
let add_town = document.querySelector("#add_townwidget")

let temp_label = document.querySelector("#temp-label")
let temp_feels_label  = document.querySelector("#temp-feels-label")
let wind_speed_label = document.querySelector("#wind-speed-label")
let pressure_label = document.querySelector("#pressure-label")
let humidity_label = document.querySelector("#humidity-label")

let none_text_label = document.querySelector(".none_text")

let weather_data_container = document.querySelector(".weather_data")
let weather_icon_label = document.querySelector("#weather_icon")
let time_label = document.querySelector("#time-label");
let date_label = document.querySelector("#date-label");
let history_label = document.querySelector(".history")
let language = document.querySelector("#language")
let time;
let town_history
let code;
let town_widget_container = document.querySelector(".widget_container")
let fixed_town 


let weather_icons_day = [
  {
    main: "Clouds",
    time: "Day",
    src: "./assets/day/cloudy_day.png"
  },
  {
    main: "Clear",
    time: "Day",
    src: "./assets/day/clear_day.png"
  }
  ,
  {
    main: "Rain",
    time: "Day",
    src: "./assets/day/rainy_day.png"
  }
  ,
  {
    main: "Rain",
    time: "Day",
    src: "./assets/day/rainy_day.png"
  }
]
let weather_icons_night = [
  {
    main: "Clouds",
    time: "Night",
    src: "./assets/night/cloudy_night.png"
  },
  {
    main: "Clear",
    time: "Night",
    src: "./assets/night/clear_sky_night.png"
  }
  ,
  {
    main: "Rain",
    time: "Night",
    src: "./assets/night/rainy_night.png"
  }
  ,
  {
    main: "Rain",
    time: "Night",
    src: "./assets/night/rainy_night.png"
  }
]

let temp_colors = {
  base:"#e2e8f0",
  hot:"#ea580c",
  medium:"#fb923c",
  cold:"#0284c7",
  very_cold:"#3c6dd7"
}



history_save("fake");



//РАЗДЕЛИТЬ fetch и присваивание 
async function getWeatherTemp(town, lang) { 
  code = '';

  let response;
  let json;

  let last_town = localStorage.getItem(1)
  let last_lang = localStorage.getItem(3);
  
  let not_found = "Nothing Found... Maybe try find to?"

  if (lang == "ru" || last_lang == "ru") { 
    temp_label.textContent = 'Температура: '
    temp_feels_label.textContent = 'Чувствуется как: '
    wind_speed_label.textContent = 'Скорость ветра: '
    pressure_label.textContent = 'Давление: '
    humidity_label.textContent = 'Влажность: '
    find_button.textContent = "Поиск"
    not_found = 'Ничего не найдено... Может попробуете найти?'
    language.value = "ru"
  }
  else if (lang == "en" || last_lang == "en") {
    temp_label.textContent = 'Temperature: '
    temp_feels_label.textContent = 'Feeling like: '
    wind_speed_label.textContent = 'Wind speed: '
    pressure_label.textContent = 'Pressure: '
    humidity_label.textContent = 'Humidity: '
    find_button.textContent = "Find"
    not_found = 'Nothing Found... Maybe try find to?'
    language.value = "en"
  }
  else if (lang == "ua" || last_lang == "ua") {
    temp_label.textContent = 'Температура: '
    temp_feels_label.textContent = 'Вiдчуваеться як: '
    wind_speed_label.textContent = 'Швидкiсть повiтря: '
    pressure_label.textContent = 'Тиск: '
    humidity_label.textContent = 'Вологість: '
    find_button.textContent = "Пошук"
    not_found = 'Нічого не знайдено... Може, спробуєте знайти?'
    language.value = "ua"
  }

  try { 
    weather_data_container.style.display = "block";
    weather_container.style.background = "none"
    none_text_label.textContent = ""
    if (!town && last_town) {
      response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${last_town}&appid=${api}&units=metric&lang=${last_lang}`);
      json = await response.json();
    }
    else if (town) {
      response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=${api}&units=metric&lang=${last_lang}`);
      json = await response.json();
    }
    else {
      find_label.textContent = "";
      weather_data_container.style.display = "none";
      none_text_label.textContent = "Nothing Found... Maybe try find to?"
    }
  }
  catch(error) {
      alert(error)
  }
  

  console.log("жысон", json)

  code = json.cod;

  if (code == "404") {
    console.log(code);
    find_label.textContent = "";
    weather_data_container.style.display = "none";
    none_text_label.textContent = "Nothing Found... Maybe try find to?";
  }

  
  
  let temperature = json.main.temp;
  let temp_feels = json.main.feels_like;
  let wind_speed = json.wind.speed;                                                   //ДЕСТРУКТУРИЗИРОВАТЬ
  let pressure = json.main.pressure;
  let humidity = json.main.humidity;
  let weather_code = json.weather[0].description; 
  let weather_name = json.weather[0].main; 
  let town_timezone = json.timezone;
  let weather_icon;
  
  function render_time() {
    let now = moment().utcOffset(town_timezone / 60);
      time_label.textContent = now.format("HH:mm");
      date_label.textContent = now.format("YYYY.MM.DD");
      time = +now.format("HH")
      change_image()
    setTimeout(() => {
        render_time();
          }, 60000);
        }

  render_time();
  
  town_history = document.querySelectorAll(".town_history")
  
  town ? find_label.textContent = town : find_label.textContent = last_town;
  town_data.textContent = json.name;
  weather_data.textContent = weather_code; 
  pressure_data.textContent = pressure;
  temp_feels_data.textContent = Math.round(temp_feels);
  temp_data.textContent = Math.round(temperature);
  wind_speed_data.textContent = (wind_speed);
  humidity_data.textContent = (humidity);
 
  
  function change_image() {
    if (time >= 18 || time <= 6) {
      weather_icon = weather_icons_night.filter((item) => {
      return item.main === weather_name
      
      })
    }
    else if (time > 6 || time < 18) { 
      weather_icon = weather_icons_day.filter((item) => {
      return item.main === weather_name
      
      })
    }
    
  }
  
  weather_icon_label.style.background = `url(${weather_icon[0].src}) no-repeat center`


  if (temperature>=25){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base}, ${temp_colors.hot})`;
  }
  else if(temperature>14 && temperature<=24){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base}, ${temp_colors.medium})`;
  }
  else if(temperature>4 && temperature<15){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base}, ${temp_colors.cold})`;
  }
  else if(temperature<=4){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base}, ${temp_colors.very_cold})`;
  }
  
}

function save_town_widget(town) {
  console.log(localStorage.getItem('widget'), 'widget on start');
  let temp_storage = []
    if (town && !localStorage.getItem('widget').includes(town) && code != "404") {
      console.log('pushing');
      temp_storage.push(town)
      temp_storage = temp_storage.concat(localStorage.getItem('widget').split(','))
      console.log(temp_storage);
      localStorage.setItem('widget', temp_storage);
  }
    else{console.log('!');}
    
    if (temp_storage.length > 5) {
      temp_storage.shift();
    }
  
  console.log(localStorage.getItem('widget').split(','), 'widget on end');
  render_widget();
}

async function render_widget() {
  let data;
  let temp_storage
  town_widget_container.innerHTML = ""
  temp_storage = localStorage.getItem("widget").split(',');
  console.log(temp_storage);
  if (temp_storage.includes("")) {
    temp_storage.pop()
  }
  console.log(temp_storage);
  for (const item of temp_storage) {
    data = await fetch_widget(item); 
    console.log(data, 'data');
    town_widget_container.innerHTML +=
      `<div
        class="flex flex-row items-center relative fixed-town shadow-2xl p-4 h-28"
        id = "fixed_town"
      >
        <div
          class="flex flex-col items-center rounded border fixed-town-data"
        >
          <div class="flex flex-row gap-2 items-center">
            <span class="fixed-town-name-data">${data.name}</span>
          </div>
          <div class="fixed-town-temp-data">${data.main.temp.toFixed()}°</div>
          <div class="fixed-town-state-data capitalize">${data.weather[0].description}</div>
        </div>
        <div class="absolute left-[calc(50%-12px)] -z-10 minus opacity-0">
          <span class="material-symbols-outlined"> do_not_disturb_on </span>
        </div>
      </div>`;
  }
  fixed_town = document.querySelectorAll("#fixed_town");
  console.log(fixed_town);
  delete_widget()
}

async function fetch_widget(town) {
  let response;
  let json;
  let last_lang = localStorage.getItem(3);
  try {
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=${api}&units=metric&lang=${last_lang}`);
    json = await response.json();
  } catch (error) {
    alert(error);
  }
  return json;
}

function delete_widget() {
  console.log("delete_widget");
  fixed_town = document.querySelectorAll("#fixed_town");
  let temp_storage = localStorage.getItem('widget').split(',')
  if (temp_storage.includes("")) {
    temp_storage.shift()
  }
  fixed_town.forEach(element => {
    element.addEventListener("click", () => {
      console.log('delete_widget');
      let cityName = element.firstElementChild.firstElementChild.firstElementChild.textContent
      temp_storage.splice(temp_storage.indexOf(cityName), 1)
      localStorage.setItem('widget', temp_storage);
      render_widget()
    })
  });
}

find_button.addEventListener("click", () => {
  current_town = town_input.value;
  getWeatherTemp(current_town, current_lang);
  if (code === "404") {
    console.log('not finding');
  }
  else if (code != "404") {
    console.log('finding...');
    console.log(code);
    history_save(town_input.value)
    localStorage.setItem(1, town_input.value);
  }
  town_input.value = ""
})
town_input.addEventListener("keypress", () => {
  if (event.keyCode === 13) {
    current_town = town_input.value;
    getWeatherTemp(current_town, current_lang);
    if (code === "404") {
      return 0
    }
    
    else if (code != "404") {
      history_save(town_input.value)
      localStorage.setItem(1, town_input.value);
    }
    town_input.value = ""

  }
})

expand.addEventListener("click", () => {
  if (town_widget_container.classList.contains("hidden")) {
    town_widget_container.classList.remove("hidden")
    expand.style.transform = "rotate(360deg)"
  }
  else {
    town_widget_container.classList.add("hidden")
    expand.style.transform = "rotate(180deg)"
  }
})

language.addEventListener("change", () => {
  current_lang = language.value;
  localStorage.setItem(3, current_lang);
  getWeatherTemp(town_data.textContent, language.value)
  render_widget()
})

add_town.addEventListener("click", () => {
  save_town_widget(town_data.textContent)
})

// town_history ? town_history.addEventListener("click", () => {
  
// }) : 0


function history_save(town_name) {

  let history = localStorage.getItem("history")

  if (town_name === "fake") {
    if (history != null) {
      let temp_storage
      temp_storage = localstorage.getitem("history").split(',')
      if (temp_storage.length > 5) {
        temp_storage.shift();
      }
      history_render(temp_storage);
    }
    else{console.log("no storage, that's fake");}
  }

  else if (history === null && code != "404") {
    let temp_storage = []
    temp_storage.push(town_name)
    localStorage.setItem('history', temp_storage)
    if (temp_storage[0] != undefined) {
      history_render(temp_storage);
    }
}

  else if (history != null) {
    
    let temp_storage = []
    if (town_name && !localstorage.getitem("history").includes(town_name) && code != "404") {
      temp_storage.push(town_name)
    }
    else{return 0}
    temp_storage = temp_storage.concat(localstorage.getitem("history").split(','))
    if (temp_storage.length > 5) {
      temp_storage.shift();
    }
    localStorage.setItem('history', temp_storage);
    history_render(temp_storage);
  }

  
  }
  

function history_render(town_arr) {
  let span;  
  history_label.innerHTML = "";
  town_arr.forEach(element => {
    span = document.createElement("span");
    span.innerHTML = `<span class="town_history">${element}</span>`
    history_label.appendChild(span);
  });
  history_enter();
}

function history_enter() {
  town_history = document.querySelectorAll(".town_history")
  town_history.forEach((element => {
  element.addEventListener('click', () => {
    localStorage.setItem(1, element.textContent);
    getWeatherTemp(element.textContent, current_lang);
  })
}))}

// document.onload()
render_widget()
getWeatherTemp()


// Сделать сайдбар с закреплёнными городами
// История городов -- ready
// Вывод времени часового пояса введённого города -- ready
// Если город не введён, то сделать просто пустую страницу с поиском -- ready
// Лоадинг скрин пока не зафетчено
// Погода на несколько дней вперёд (если openweather позволяет)
// Пофиксить баг с появлением в истории ошибочных названий городов 
// Для виджета можно использовать функцию истории

