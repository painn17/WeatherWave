import { api } from "./api.js"; // your api key here

let weather_json

//data for first visit 
let current_town = "Лондон"
let current_lang = "en";

// Weather Data Elements
let weather_container = document.querySelector("#weather_container");
// let weather_card = document.querySelector("#weather_card")
let weather_data =  document.querySelector("#weather-label")
let pressure_data =  document.querySelector("#pressure")
let temp_feels_data =  document.querySelector("#temp-feels")
let temp_data =  document.querySelector("#temp")
let wind_speed_data =  document.querySelector("#wind-speed")
let humidity_data =  document.querySelector("#humidity")
let town_data = document.querySelector("#town")

// Input/Search Elements
let find_label = document.querySelector("#find")
let find_button = document.querySelector("#find-button")
let town_input = document.querySelector("#town-input")
let expand = document.querySelector(".expand")
let add_town = document.querySelector("#add_townwidget")

//Loader
let loader_container = document.querySelector(".loader-container")

// Weather labels
let temp_label = document.querySelector("#temp-label")
let temp_feels_label  = document.querySelector("#temp-feels-label")
let wind_speed_label = document.querySelector("#wind-speed-label")
let pressure_label = document.querySelector("#pressure-label")
let humidity_label = document.querySelector("#humidity-label")
let none_text_label = document.querySelector(".none_text")
let weather_icon_label = document.querySelector("#weather_icon")

// Weather Icon Elements
let weather_data_container = document.querySelector(".weather_data")

// General history container
let history_label = document.querySelector(".history")

// Time/Date for main weather Labels
let time_label = document.querySelector("#time-label");
let date_label = document.querySelector("#date-label");

//Language selector
let language = document.querySelector("#language")

// Other Elements
// let time;
let town_history;
let code;
let town_widget_container = document.querySelector(".widget_container")
let fixed_town;


//Icons for weather-label
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

//Colors for page background gradient
let temp_colors = {
  base:"#e2e8f0",
  hot:"#ea580c",
  medium:"#fbce3c",
  cold:"#0284c7",
  very_cold:"#3c6dd7"
}


//History render* actually (temporary "костыль")
history_save("fake");

//Displaying loader before getting weather data
loader_container.style.display = "flex"

//Getting weather data and returnig it
async function fetch_weather(town, lang) {
  code = '';

  let response;
  let json;

  let last_town = localStorage.getItem("last_town")
  let last_lang = localStorage.getItem('lang');
  
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
    none_text_label.textContent = ""
    if (!town && last_town) {
      response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${last_town}&appid=${api}&units=metric&lang=${last_lang}`);
      json = await response.json();
      temperature_gradient(json.main.temp);
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
  catch (error) {
    alert(error)
  }
  

  

  code = json.cod;

  if (code == "404") {
    ;
    find_label.textContent = "";
    weather_data_container.style.display = "none";
    none_text_label.textContent = "Nothing Found... Maybe try find to?";
  }
  
  
  loader_container.style.display = "none"
  return json
}
  
//Assign data to labels/ color to bg accroding on temperature 
function assign_data(json){
  let temperature = json.main.temp;
  let temp_feels = json.main.feels_like;
  let wind_speed = json.wind.speed;                                                   //ДЕСТРУКТУРИЗИРОВАТЬ
  let pressure = json.main.pressure;
  let humidity = json.main.humidity;
  let weather_code = json.weather[0].description; 
  let weather_name = json.weather[0].main; 
  // let town_timezone = json.timezone;
  let time = render_time(json)
  let image = time[3]
  
  town_history = document.querySelectorAll(".town_history")
  
  json.name ? find_label.textContent = json.name : find_label.textContent = last_town;
  time_label.textContent = time[0]
  date_label.textContent = time[1]
  town_data.textContent = json.name;
  weather_data.textContent = weather_code; 
  pressure_data.textContent = pressure;
  temp_feels_data.textContent = Math.round(temp_feels);
  temp_data.textContent = Math.round(temperature);
  wind_speed_data.textContent = (wind_speed);
  humidity_data.textContent = (humidity);
  weather_icon_label.style.background = image[1]
  
  


 
  
}

function temperature_gradient(temperature) {
  temperature = Math.round(temperature)
  console.log("temperatrue function called", temperature);
  if (temperature>=25){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base} 0%, ${temp_colors.hot} 60%)`;
    console.log("hot");
      }
  else if(temperature>=15 && temperature<=24){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base} 0%, ${temp_colors.medium} 60%)`;
    console.log("medium");  
  }
  else if(temperature>=5 && temperature<=14){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base} 0%, ${temp_colors.cold} 60%)`;
    console.log("cold");  
  }
  else if(temperature<=4){
    weather_container.style.background = `linear-gradient(to top, ${temp_colors.base} 0%, ${temp_colors.very_cold} 60%)`;
    console.log("very cold");  
  }
}


// Receiving time and a picture depending on the received time and returning all of it (temporary "Костыль")
function render_time(json) {
  let now = moment().utcOffset(json.timezone / 60);
    let time_data = now.format("HH:mm");
    let date_data = now.format("YYYY.MM.DD");
    let time = now.format("HH")
    let image = change_image(json, time)
  // setTimeout(() => { .weather[0].main
  //     render_time(json);
  //       }, 60000);
  return [time_data, date_data, time, image]
      }

// Checking time for town and returning image with modified/non-modified data (temporary "костыль", tailwind works sometimes with issues)
function change_image(json, time) {
  let weather_icon
    if (time >= 18 || time <= 6) {
      weather_icon = weather_icons_night.filter((item) => {
      return item.main === json.weather[0].main
      
      })
    }
    else if (time > 6 || time < 18) { 
      weather_icon = weather_icons_day.filter((item) => {
      return item.main === json.weather[0].main
      
      })
  }
    ;
  let icon_url = `url('${weather_icon[0].src}')`
  let icon_url_modified = `url('${weather_icon[0].src}') no-repeat center`
     return [icon_url, icon_url_modified]
  }
  
  //Function to save current town to "bookmarks" 
  function save_town_widget(town) {
    ;
    let temp_storage = []
    let widget = localStorage.getItem('widget')
    if (town && widget != null && code != "404") {
      if (!widget.includes(town)) {
        ;
        temp_storage.push(town)
        temp_storage = temp_storage.concat(localStorage.getItem('widget').split(','))
        ;
        localStorage.setItem('widget', temp_storage);}
        
    }
    else {
      ;
      localStorage.setItem('widget', '')
      save_town_widget(town)    
    }
      
      if (temp_storage.length > 5) {
        temp_storage.shift();
      }
      ;
    render_widget();
  }

//renders "bookmarks" (Do I even need to put quotes on bookmarks? i can use "pinned", why i am so bad in english)
async function render_widget() {
  let data;
  let temp_storage;
  let time;
  town_widget_container.innerHTML = ""
  temp_storage = localStorage.getItem("widget").split(',');
  ;
  if (temp_storage.includes("")) {
    temp_storage.pop()
  }
  ;
  for (const item of temp_storage) {
    data = await fetch_weather(item); 
    time = render_time(data);
    let image = time[3]
    town_widget_container.innerHTML +=
      `<div
        class="flex flex-row items-center relative fixed-town max-md:shadow-none shadow-2xl p-4 max-md:p-8 h-28 bg-no-repeat"
        id = "fixed_town"
        style="background-image: ${image[0]}; background-repeat: no-repeat; background-position: center;"
      >
        <div
          class="flex flex-col items-center fixed-town-data"
        >
          <div class="flex flex-row gap-2 items-center">
            <span class="fixed-town-name-data">${data.name}</span>
            <span>|</span>
            <span class="fixed-town-time-data">${time[0]}</span>
          </div>
          <div class="fixed-town-temp-data">${data.main.temp.toFixed()}°</div>
          <div
              id="weather_icon_widget"
              class="bg-no-repeat bg-center w-min " 
            >
              <span
                id="weather-label"
                class="overflow-hidden text-ellipsis capitalize fixed-town-state-data">
                ${data.weather[0].description}</span>
            </div>
          <div </div>
        </div>
        <div class="minus opacity-0">
          <span class="material-symbols-outlined"> do_not_disturb_on </span>
        </div>
      </div>`;
  }
  fixed_town = document.querySelectorAll("#fixed_town");
  ;
  delete_widget()
} 

// Deletes selected pinned town
function delete_widget() {
  ;
  fixed_town = document.querySelectorAll("#fixed_town");
  let temp_storage = localStorage.getItem('widget').split(',')
  if (temp_storage.includes("")) {
    temp_storage.shift()
  }
  fixed_town.forEach(element => {
    element.addEventListener("click", () => {
      ;
      let cityName = element.firstElementChild.firstElementChild.firstElementChild.textContent
      temp_storage.splice(temp_storage.indexOf(cityName), 1)
      localStorage.setItem('widget', temp_storage);
      render_widget()
    })
  });
}

// event listener for find button, works with click and "enter" too
find_button.addEventListener("click", async () => {
  
  weather_json = await fetch_weather(current_town, current_lang);
  assign_data(weather_json)
  if (code === "404") {

  }
  else if (code != "404") {
    temperature_gradient(weather_json.main.temp)
    current_town = town_input.value;
    history_save(town_input.value)
    localStorage.setItem("last_town", town_input.value);
  }
  town_input.value = ""
})
// on enter (maybe need to connect them)
town_input.addEventListener("keypress", async () => {
  if (event.keyCode === 13) {
    
    weather_json = await fetch_weather(current_town, current_lang);
    assign_data(weather_json)
    if (code === "404") {
      return 0
    }
    
    else if (code != "404") {
      temperature_gradient(weather_json.main.temp)
      current_town = town_input.value;
      history_save(town_input.value)
      localStorage.setItem("last_town", town_input.value);
    }
    town_input.value = ""

  }
})

//event listener to expand the bookmarks
expand.addEventListener("click", () => {
  if (town_widget_container.classList.contains("hidden")) {
    town_widget_container.classList.remove("hidden")
    if (window.innerWidth <= 1024) {
      expand.style.transform = "rotate(270deg)"
    }
    else {
      expand.style.transform = "rotate(360deg)"
    }
  }
  else {
    town_widget_container.classList.add("hidden")
    if (window.innerWidth <= 1024) {
      expand.style.transform = "rotate(90deg)"
    }
    else {
      expand.style.transform = "rotate(360deg)"
    }
  }
})

// event listener to change the language on page
language.addEventListener("change", async () => {
  current_lang = language.value;
  localStorage.setItem('lang', current_lang);
  assign_data(await fetch_weather(town_data.textContent, language.value))
  render_widget()
})

// Event listener to Function to save current town to "bookmarks"
add_town.addEventListener("click", () => {
  save_town_widget(town_data.textContent)
})

//function to save current town to history for fast navigation
//works bad because of saving the wrong data (if you type somehing like "absdas", you getting nothing page (look for none_text_label), but history saves this "absdas")
function history_save(town_name) {

  let history = localStorage.getItem("history")

  if (town_name === "fake") {
    if (history != null) {
      let temp_storage
      temp_storage = localStorage.getItem("history").split(',')
      if (temp_storage.length > 5) {
        temp_storage.shift();
      }
      history_render(temp_storage);
    }
    else{;}
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
    console.log("History not full/adding history");
    let temp_storage = []
    if (town_name && !localStorage.getItem("history").includes(town_name) && code != "404") {
      temp_storage.push(town_name)
      
    }
    else{return 0}
    temp_storage = temp_storage.concat(localStorage.getItem("history").split(','))
    if (temp_storage.length > 5) {
      temp_storage.pop();
    }
    localStorage.setItem('history', temp_storage);
    history_render(temp_storage);
  }  }
  
//function that renders visited towns
function history_render(town_arr) {
  let span;  
  history_label.innerHTML = "";
  town_arr.forEach(element => {
    span = document.createElement("span");
    span.innerHTML = `<span class="town_history capitalize">${element}</span>`
    history_label.appendChild(span);
  });
  history_enter();
}

//function that adds event listeners to all of history towns
function history_enter() {
  town_history = document.querySelectorAll(".town_history")
  town_history.forEach((element => {
  element.addEventListener('click', async () => {
    localStorage.setItem("last_town", element.textContent);
    weather_json = await fetch_weather(element.textContent, current_lang);
    temperature_gradient(weather_json.main.temp);
    assign_data(weather_json)
  })
}))}

// document.onload()

//rendering widget
render_widget()
//getting data wo weather_json
weather_json = await fetch_weather()
//renders time for weather_json town
render_time(weather_json);
//assigning data to labels depending of data of weather_json
assign_data(weather_json)

// TO DO ||
//       \/

// Сделать сайдбар с закреплёнными городами/Make a sidebar with pinned cities -- ready
// История городов/History of cities -- ready
// Вывод времени часового пояса введённого города(и закреплённых)/Displaying the time zone of the entered city (and pinned ones) -- ready
// Если город не введён/не найден, то показать пустую страницу с поиском и надписью /If the city is not entered/not found, then show a empty page with a search and the inscription -- ready
// Лоадинг скрин пока не зафетчено /Loading screen while fetching -- ready
// Погода на несколько дней вперёд (если openweather позволяет) /Weather for several days ahead (if openweather allows)
// Пофиксить баг с появлением в истории ошибочных названий городов /Fix a bug with the appearance of incorrect city names in the history