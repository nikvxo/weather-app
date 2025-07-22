import './style.css';

//init the app 
document.addEventListener('DOMContentLoaded', () => {
    console.log('Weather App Initialized');

    // get dom elems
    const form = document.getElementById('weather-form');
    const locationInput = document.getElementById('location-input');
    const weatherDisplay = document.getElementById('weather-display');
    const errorDisplay = document.getElementById('error-message');
    const tempToggle = document.getElementById('temp-toggle');

    //state
    let isCelsius = true; 

    //form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const location = locationInput.value.trim(); 

        console.log(`Fetching weather for: ${location}`);

        // Enhanced input validation
        if (!location) {
            showError('Please enter a location');
            return; 
        }

        if (location.length < 2) {
            showError('Location must be at least 2 characters long');
            return;
        }

        if (!/^[a-zA-Z\s,.-]+$/.test(location)) {
            showError('Please enter a valid city name (letters, spaces, commas, periods, and hyphens only)');
            return;
        }

        // Hide any previous errors
        hideError();

        // Show loading state (you'll need to add this to your HTML)
        showLoading();

        try {
            // Fetch real weather data
            const weatherData = await fetchWeatherData(location);
            displayWeather(weatherData);
        } catch (error) {
            showError('Unable to fetch weather data. Please try again.');
            console.error('API Error:', error);
        } finally {
            hideLoading();
        }
    })

    // Add this function outside the form event listener
    function displayWeather(data) {
        // Get the individual elements inside your weather display
        const cityName = document.getElementById('city-name');
        const temperature = document.getElementById('temperature');
        const tempUnit = document.getElementById('temp-unit');
        const description = document.getElementById('weather-description');
        const feelsLike = document.getElementById('feels-like');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('wind-speed');
        
        // Put the data into the elements
        cityName.textContent = data.city;
        temperature.textContent = Math.round(data.temperature);
        tempUnit.textContent = isCelsius ? '°C' : '°F';
        description.textContent = data.description;
        feelsLike.textContent = `${Math.round(data.feelsLike)}°${isCelsius ? 'C' : 'F'}`;
        humidity.textContent = `${data.humidity}%`;
        windSpeed.textContent = `${data.windSpeed} km/h`;
        
        // Show the weather display (remove 'hidden' class)
        weatherDisplay.classList.remove('hidden');
    }

    // Temperature toggle functionality
    tempToggle.addEventListener('click', () => {
        console.log('Toggle button clicked!');
        
        // Flip the temperature unit
        isCelsius = !isCelsius;
        
        // Update the button text to show what it will toggle TO
        tempToggle.textContent = isCelsius ? '°F' : '°C';
        
        // If we have weather data displayed, update the temperatures
        const currentTemp = document.getElementById('temperature');
        const currentFeelsLike = document.getElementById('feels-like');
        
        if (currentTemp && currentTemp.textContent) {
            // Get current temperature value
            let temp = parseFloat(currentTemp.textContent);
            let feelsLikeTemp = parseFloat(currentFeelsLike.textContent);
            
            // Convert temperature
            if (isCelsius) {
                // Convert F to C
                temp = (temp - 32) * 5/9;
                feelsLikeTemp = (feelsLikeTemp - 32) * 5/9;
            } else {
                // Convert C to F
                temp = (temp * 9/5) + 32;
                feelsLikeTemp = (feelsLikeTemp * 9/5) + 32;
            }
            
            // Update the display
            currentTemp.textContent = Math.round(temp);
            document.getElementById('temp-unit').textContent = isCelsius ? '°C' : '°F';
            currentFeelsLike.textContent = `${Math.round(feelsLikeTemp)}°${isCelsius ? 'C' : 'F'}`;
            
            console.log(`Converted to ${isCelsius ? 'Celsius' : 'Fahrenheit'}: ${Math.round(temp)}°`);
        }
    });

    // Error handling functions
    function showError(message) {
        const errorContainer = document.getElementById('error-message');
        const errorText = errorContainer.querySelector('p');
        
        errorText.textContent = message;
        errorContainer.classList.remove('hidden');
        
        // Hide weather display if showing
        weatherDisplay.classList.add('hidden');
        
        console.log('Error:', message);
    }

    function hideError() {
        const errorContainer = document.getElementById('error-message');
        errorContainer.classList.add('hidden');
    }
});