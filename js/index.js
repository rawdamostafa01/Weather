// ^ element HTML----------
let card = document.querySelector(".row");
let input = document.querySelector("input");
let but = document.querySelector(".but");
// ^ app var----------------

const api_key = "ea886c62137245829cb44803261808";
const api_base = "https://api.weatherapi.com/v1/forecast.json";

// ^function----------------
async function get_weather(location) {
  const respons = await fetch(
    `${api_base}?key=${api_key}&q=${location}&days=7`,
  );
  const data = await respons.json();
  if (respons.status !== 200) {
    input.value = "";
    Swal.fire({
      icon: "error",
      title: "Incorrect name!",
      text: "Please enter the correct country name",
    });
    return;
  }
  display_weather(data);
}
let currentlocation = "London";

function succes(position) {
  currentlocation = `${position.coords.latitude},${position.coords.longitude}`;
  get_weather(currentlocation);
}
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  get_weather("Cairo");
}

function display_weather(data) {
  const days = data.forecast.forecastday;
  const now = new Date();
  let html_card = "";
  for (let [index, day] of days.entries()) {
    const date = new Date(day.date);
    html_card += `<div class="col-md-6 col-lg-4">
            <div class="cardd ${index === 0 ? "active" : ""} bg-opacity-75 pb-3 text-light">
              <div
                class="day nav-card justify-content-between px-3 p-2 text-light"
              >
                <p class=" m-0">${date.toLocaleDateString("en-us", { weekday: "long" })}</p>
                <p class="m-0 now ">${now.getHours()}:${now.getMinutes()} ${now.getHours() > 11 ? "PM" : "AM"} </p>
              </div>
              <div class="contant px-2 d-flex flex-column gap-4">
                <div class="body-card pt-5 p-2">
                  <h2 class="pb-2">${data.location.name}</h2>
                  <div class="degry">
                    <img
                      src="./images/${data.current.condition.text}.svg"
                      class="object-fit-contain"
                      alt=""
                    />
                    <div class="text-degry">
                      <h1 class="m-0">${
                        data.forecast.forecastday[index].hour[now.getHours()]
                          .temp_c
                      }°C</h1>
                      <p class="sup m-0">${
                        data.forecast.forecastday[index].hour[now.getHours()]
                          .feelslike_c
                      } °C</p>
                      <p class="m-0">${data.current.condition.text}</p>
                    </div>
                  </div>
                </div>
                <ul class="w-100 gap-3 m-0 px-2">
                  <li><i class="fas fa-thermometer-three-quarters"></i> ${
                    data.forecast.forecastday[index].hour[now.getHours()]
                      .feelslike_c
                  } °C</li>
                  <li><i class="fas fa-wind me-1"></i>${
                    data.forecast.forecastday[index].hour[now.getHours()]
                      .wind_mph
                  } mph/h</li>
                  <li><i class="fas fa-tint fs-7"></i>  ${
                    data.forecast.forecastday[index].hour[now.getHours()]
                      .humidity
                  } %</li>
                </ul>
              </div>
            </div>
          </div>`;

    card.innerHTML = html_card;
  }

  let all_card = document.querySelectorAll(".cardd");
  for (let card of all_card) {
    card.addEventListener("click", function (e) {
      let activ_card = document.querySelector(".active.cardd");
      activ_card.classList.remove("active");
      e.currentTarget.classList.add("active");
    });
  }
}

// ^event------------------
window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(succes, error);
  } else {
    get_weather("Cairo");
  }
});

input.addEventListener("keydown", function (e) {
  if (e.code === "Enter" || e.key === "Enter") {
    get_weather(this.value);
    get_clear();
  }
});

but.addEventListener("click", function () {
  get_weather(input.value);
  get_clear();
});

function get_clear() {
  input.value = " ";
}
