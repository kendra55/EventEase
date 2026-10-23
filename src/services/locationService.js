
import * as Location from "expo-location";

// position actuelle autorisation
export async function getCurrentPosition() {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error(
      "Autorisation de localisation refusée. Active-la dans les paramètres du téléphone."
    );
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

// calcule de la distance 
export function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const toRadians = (degrees) =>
    (degrees * Math.PI) / 180;

  const earthRadius = 6371;

  const differenceLatitude = toRadians(
    latitude2 - latitude1
  );

  const differenceLongitude = toRadians(
    longitude2 - longitude1
  );

  const a =
    Math.sin(differenceLatitude / 2) ** 2 +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(differenceLongitude / 2) ** 2;

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return earthRadius * c;
}

// Vérifier que les coordonnées existent et sont valides
export function hasCoordinates(event) {
  if (
    event?.latitude == null ||
    event?.longitude == null
  ) {
    return false;
  }

  const latitude = Number(event.latitude);
  const longitude = Number(event.longitude);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}
