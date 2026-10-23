
const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";


function daysUntil(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  const eventDay = Date.UTC(year, month - 1, day);
  const now = new Date();

  const today = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return Math.round((eventDay - today) / 86400000);
}

// interprétation simplifiée des codes météo WMO.
export function getWeatherDescription(code) {
  if (code === 0) {
    return { label: "Ciel dégagé", icon: "sunny-outline" };
  }

  if ([1, 2].includes(code)) {
    return { label: "Partiellement nuageux", icon: "partly-sunny-outline" };
  }

  if (code === 3) {
    return { label: "Nuageux", icon: "cloud-outline" };
  }

  if ([45, 48].includes(code)) {
    return { label: "Brouillard", icon: "cloud-outline" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { label: "Bruine", icon: "rainy-outline" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: "Pluie", icon: "rainy-outline" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { label: "Neige", icon: "snow-outline" };
  }

  if ([95, 96, 99].includes(code)) {
    return { label: "Orage", icon: "thunderstorm-outline" };
  }

  return { label: "Conditions variables", icon: "cloud-outline" };
}


// recherche la ville
async function findEventCoordinates(location) {
  const locationText = String(location || "").trim();

  if (!locationText) return null;

  const city = locationText.split(",")[0].trim();

  if (!city) return null;

  const url =
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}` +
    "&count=5&language=fr&countryCode=GA";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Impossible de rechercher le lieu.");
  }

  const data = await response.json();

  const results = data.results || [];

  
  const match = results.find(
    (item) => item.name.toLowerCase() === city.toLowerCase()
  );

  if (!match) return null;

  return {
    latitude: match.latitude,
    longitude: match.longitude,
    name: match.name,
  };
}

export async function getEventWeather(event) {
  if (!event?.date) {
    return {
      status: "unavailable",
      message: "Date de l'événement indisponible.",
    };
  }

  const days = daysUntil(event.date);

  if (days === null) {
    return {
      status: "unavailable",
      message: "Date de l'événement invalide.",
    };
  }

  if (days < 0) {
    return {
      status: "unavailable",
      message: "Cet événement est déjà passé.",
    };
  }

  if (days > 15) {
    return {
      status: "unavailable",
      message:
        "Les prévisions ne sont pas encore disponibles pour cette date. Revenez à l'approche de l'événement.",
    };
  }

  let latitude = Number(event.latitude);
  let longitude = Number(event.longitude);
  let locationName = event.location;

  
  // rechercher la ville dans Open-Meteo.
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    event.latitude == null ||
    event.longitude == null
  ) {
    const place = await findEventCoordinates(
        event.city || event.location
      );

    if (!place) {
      return {
        status: "unavailable",
        message:
          "Lieu non reconnu. La météo sera disponible après avoir précisé la ville ou la position de l'événement.",
      };
    }

    latitude = place.latitude;
    longitude = place.longitude;
    locationName = place.name;
  }

  const dailyVariables = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max",
    "wind_speed_10m_max",
  ].join(",");

  const url =
    `${FORECAST_URL}?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&daily=${dailyVariables}` +
    `&timezone=auto&forecast_days=16`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les prévisions.");
  }

  const data = await response.json();
  const index = data.daily?.time?.indexOf(event.date) ?? -1;

  if (index === -1) {
    return {
      status: "unavailable",
      message: "Aucune prévision disponible pour cette date.",
    };
  }

  return {
    status: "success",
    locationName,
    date: event.date,
    description: getWeatherDescription(
      data.daily.weather_code[index]
    ),
    maxTemperature: data.daily.temperature_2m_max[index],
    minTemperature: data.daily.temperature_2m_min[index],
    rainProbability:
      data.daily.precipitation_probability_max[index],
    windSpeed: data.daily.wind_speed_10m_max[index],
  };
}
