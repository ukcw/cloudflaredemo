import flag from "country-code-emoji";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${request.cf.city}&appid=025bc18cb8e646973003463069defa10`
  const init = {
    headers: {
      "content-type" : "application/json;charset=UTF-8",
    },
  }

  const response = await fetch(endpoint,init);
  const content = await response.json();

  // default temperature unit returned from OpenWeatherMap is Kelvin
  const kelvinToCelsius = (temperature) => {
    let tmp = (temperature-273.15).toFixed(2);
    return tmp.toString() + "\xB0C"
  }

  // set up html content
  let html_content = `<p>You are connecting from ${request.cf.latitude}, ${request.cf.longitude}</p>`;
  html_content += `<p>Weather data from OpenWeatherMap</p>`;
  html_content += `<p>Current weather: ${content.weather[0].main}, ${content.weather[0].description}</p>`;
  html_content += `<p>The temperature is ${kelvinToCelsius(content.main.temp)}</p>`;
  html_content += `<p>It feels like ${kelvinToCelsius(content.main.feels_like)}</p>`;
  html_content += `<p>Max temp: ${kelvinToCelsius(content.main.temp_max)}</p>`;
  html_content += `<p>Min temp: ${kelvinToCelsius(content.main.temp_min)}</p>`;
  html_content += `<p>Pressure: ${content.main.pressure}hPa</p>`;
  html_content += `<p>Humidity: ${content.main.humidity}%</p>`;

  // add an emoji for the user's country
  const emoji = flag(request.cf.country);

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Geolocation Weather App</title>
  </head>
  <body>
      <h1>Connected from ${request.cf.country} ${emoji}</h1>
      <div>${html_content}</div>
  </body>
  </html>
  `

  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  })
}
