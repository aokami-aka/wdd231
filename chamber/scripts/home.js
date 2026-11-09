// API key.
const WEATHER_API_KEY = "1564816cbf1c15c5d844f106e386ab0e";

// João Pessoa coordinates
const LATITUDE = -7.1195;
const LONGITUDE = -34.8450;

const currentWeather = document.querySelector("#currentWeather");
const weatherForecast = document.querySelector("#weatherForecast");

async function getWeather() {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        currentWeather.textContent = "Add your OpenWeatherMap API key to display weather information.";
        weatherForecast.textContent = "Forecast unavailable.";
        return;
    }

    const baseURL = "https://api.openweathermap.org/data/2.5/";

    const currentURL =
        `${baseURL}weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${WEATHER_API_KEY}`;

    const forecastURL =
        `${baseURL}forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${WEATHER_API_KEY}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentURL),
            fetch(forecastURL)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Weather API request failed.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        console.error("Weather error:", error);
        currentWeather.textContent = "Weather information is currently unavailable.";
        weatherForecast.textContent = "Forecast unavailable.";
    }
}

function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    currentWeather.replaceChildren();

    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.alt = description;
    icon.width = 90;
    icon.height = 90;

    const temperatureText = document.createElement("p");
    temperatureText.className = "current-temperature";
    temperatureText.textContent = `${temperature}°C`;

    const descriptionText = document.createElement("p");
    descriptionText.className = "weather-description";
    descriptionText.textContent =
        description.charAt(0).toUpperCase() + description.slice(1);

    const locationText = document.createElement("p");
    locationText.textContent = data.name;

    currentWeather.append(
        icon,
        temperatureText,
        descriptionText,
        locationText
    );
}

function displayForecast(data) {
    weatherForecast.replaceChildren();

    const timezone = data.city.timezone;

    // Get today's date using João Pessoa's local time.
    const localNow = new Date(Date.now() + timezone * 1000);

    const todayKey = localNow.toISOString().slice(0, 10);

    const days = new Map();

    data.list.forEach((item) => {
        const localDate = new Date((item.dt + timezone) * 1000);
        const dateKey = localDate.toISOString().slice(0, 10);

        if (dateKey <= todayKey) return;

        if (!days.has(dateKey)) {
            days.set(dateKey, []);
        }

        days.get(dateKey).push(item);
    });

    const forecastDates = [...days.keys()].slice(0, 3);

    forecastDates.forEach((dateKey) => {
        const dayItems = days.get(dateKey);

        const minTemperature = Math.round(
            Math.min(...dayItems.map(item => item.main.temp_min))
        );

        const maxTemperature = Math.round(
            Math.max(...dayItems.map(item => item.main.temp_max))
        );

        // Select the forecast closest to noon.
        const representative = dayItems.reduce((best, item) => {
            const itemHour = new Date(
                (item.dt + timezone) * 1000
            ).getUTCHours();

            const bestHour = new Date(
                (best.dt + timezone) * 1000
            ).getUTCHours();

            return Math.abs(itemHour - 12) < Math.abs(bestHour - 12)
                ? item
                : best;
        });

        const date = new Date(`${dateKey}T12:00:00Z`);

        const dayName = new Intl.DateTimeFormat("en", {
            weekday: "short",
            timeZone: "UTC"
        }).format(date);

        const card = document.createElement("article");
        card.className = "forecast-card";

        const day = document.createElement("h4");
        day.textContent = dayName;

        const icon = document.createElement("img");
        icon.src = `https://openweathermap.org/img/wn/${representative.weather[0].icon}.png`;
        icon.alt = representative.weather[0].description;
        icon.width = 50;
        icon.height = 50;

        const temperatures = document.createElement("p");
        temperatures.textContent =
            `${minTemperature}° / ${maxTemperature}°C`;

        card.append(day, icon, temperatures);
        weatherForecast.appendChild(card);
    });

    if (forecastDates.length < 3) {
        weatherForecast.textContent = "Three-day forecast is unavailable.";
    }
}

// MEMBER SPOTLIGHTS

const spotlightGrid = document.querySelector("#spotlightGrid");

function createSpotlight(member) {
    const card = document.createElement("article");
    card.className = "spotlight-card";

    const heading = document.createElement("div");
    heading.className = "spotlight-heading";

    const name = document.createElement("h3");
    name.textContent = member.name;

    const tagline = document.createElement("p");
    tagline.textContent = member.tagline;

    heading.append(name, tagline);

    const details = document.createElement("div");
    details.className = "spotlight-details";

    const image = document.createElement("img");
    image.className = "spotlight-logo";
    image.src = `images/${member.image}`;
    image.alt = `${member.name} logo`;
    image.loading = "lazy";
    image.width = 240;
    image.height = 160;

    const info = document.createElement("div");
    info.className = "spotlight-info";

    const address = document.createElement("p");
    const addressLabel = document.createElement("strong");
    addressLabel.textContent = "Address: ";
    address.append(addressLabel, document.createTextNode(member.address));

    const phone = document.createElement("p");
    const phoneLabel = document.createElement("strong");
    phoneLabel.textContent = "Phone: ";
    phone.append(phoneLabel, document.createTextNode(member.phone));

    const website = document.createElement("p");
    const websiteLabel = document.createElement("strong");
    websiteLabel.textContent = "Website: ";

    const link = document.createElement("a");
    link.href = member.website;
    link.textContent = "Visit website";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    website.append(websiteLabel, link);

    const levels = {
        1: "Member",
        2: "Silver Member",
        3: "Gold Member"
    };

    const membership = document.createElement("span");
    membership.className = "membership";
    membership.textContent = levels[member.membershipLevel] || "Member";

    info.append(address, phone, website, membership);
    details.append(image, info);
    card.append(heading, details);

    return card;
}

async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load members.");
        }

        const members = await response.json();

        // Only silver and gold members are eligible.
        const eligibleMembers = members.filter(
            member => member.membershipLevel === 2 ||
                      member.membershipLevel === 3
        );

        // Randomize member order.
        const shuffledMembers = eligibleMembers.sort(
            () => Math.random() - 0.5
        );

        // Display three randomly selected members.
        const selectedMembers = shuffledMembers.slice(0, 3);

        spotlightGrid.replaceChildren();

        selectedMembers.forEach(member => {
            spotlightGrid.appendChild(createSpotlight(member));
        });

    } catch (error) {
        console.error("Spotlight error:", error);
        spotlightGrid.textContent =
            "Member spotlights are currently unavailable.";
    }
}

// INITIALIZE HOME PAGE

getWeather();
getSpotlights();