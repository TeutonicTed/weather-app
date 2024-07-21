// Global Variables
let cityContainer = document.querySelector("#searched-cities")
    cityContainer.innerHTML= ""

let allCities = readFromLocalStorage("searched-cities") || [];
   
    

// API call
async function getWeatherData(city){
    // get city name from form field
    
    console.log(city);

    const apikey = "31fdf621acdb5785b3727e801c1361d8"
    const resp1 = await fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`)
    const data1 = await resp1.json()
    console.log(data1)
    const resp2 = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${data1[0].lat}&lon=${data1[0].lon}&appid=${apikey}&units=imperial`)
    const data2 = await resp2.json()
    console.log(data2)
    
    const currentData = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=imperial`);
    const data3 = await currentData.json();
        
        console.log(data3);

    // now we have the data from the second fetch call


     // Check if the city is not already in the array before adding it
     if (!allCities.includes(city)) {
        allCities.push(city);
        saveToLocalStorage("searched-cities", allCities);
        
     } else {
         console.log("City already exists in the list.");
     }
    
    
    


    displayCurrentWeather(data3);
    displayFiveDayForecast(data2);
    displaySearchedCities();
}

// We make our final fetch call and we get an array with 40 weather objects

function displaySearchedCities(){
  
    cityContainer.textContent = ""
    const sortedWords = allCities.sort(); 
    for (let i = 0; i < allCities.length; i++) {
        const newBtn = document.createElement("button");
        newBtn.setAttribute("class", "btn btn-secondary w-100 mb-1");
        newBtn.textContent = allCities[i]
        newBtn.addEventListener ("click", function(event){
            const cityName = event.target.textContent
            getWeatherData(cityName);
        })
        if (!allCities.includes(newBtn)){
        cityContainer.appendChild(newBtn)   
        
        }
    }
}

function displayCurrentWeather(apiData){
    const searchEl = document.querySelector("#forecast");
searchEl.innerHTML = `
    <div class = "card">
        <div class="current-forecast bg-warning">
            <h2 class="header" id="current-weather">${apiData.name + dayjs.unix(apiData.dt).format(' (MM/DD/YYYY)')} </h2>
            <img src = "https://openweathermap.org/img/wn/${apiData.weather[0].icon}.png" />
            <p class="temp">${apiData.main.temp} °F</p>
            <p class="wind-speed">${apiData.wind.speed} MPH</p>
            <p class="humidity">${apiData.main.humidity} %</p>
        </div>
    </div>
`
; 
  


    console.log("display current weather", apiData);
}



function displayFiveDayForecast(apiData){
console.log(apiData)
    const fiveData = apiData.list;
        // i = one forecast for each of the days  

    const fiveDayContainer = document.querySelector("#five-day-forecast")
    fiveDayContainer.innerHTML = ""
    
    for (let i = 2; i < fiveData.length; i = i+8){
        
            fiveDayContainer.setAttribute("class", "d-flex flew-row")

            console.log(fiveDayContainer);

        // const fiveEl = document.querySelector("#five-day-container")
        fiveDayContainer.innerHTML += `   
                <div class = "card mx-auto">
                    <h5 class = "text-center" id="date">${dayjs(apiData.list[i].dt_txt).format('MM/DD/YYYY')} </h5>
                    <img src = "https://openweathermap.org/img/wn/${apiData.list[i].weather[0].icon}.png" id="weath-icon"/>
                    <p class ="temp">${apiData.list[i].main.temp} °F</p>
                    <p class ="temp">${apiData.list[i].wind.speed} MPH</p>
                    <p class ="temp">${apiData.list[i].main.humidity} %</p>
                </div>
                `
            
    }
   
}



// the cool solution involves: array.filter() + a JS math operator



// Call functions to save & read into local storage
 function saveToLocalStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}


function readFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name));
}


// Event Listeners
document.querySelector("#submit-btn").addEventListener("click", function(event){
    event.preventDefault()
    const searched = document.getElementById ("city-input")
    const cityName = searched.value
    getWeatherData(cityName);
})

cityContainer.addEventListener("click", function(event){
    if( event.target.matches("button") ){
        const cityName = event.target.textContent;
        getWeatherData(cityName);
    }
})



// When the file loads, display all previous cities



