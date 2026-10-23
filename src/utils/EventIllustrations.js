export const eventIllustrations = {
    Culture: require("../../assets/events/culture.png"),
    Atelier: require("../../assets/events/atelier.png"),
    Solidarité: require("../../assets/events/solidarite.png"),
    Sport: require("../../assets/events/sport.png"),
    Formation: require("../../assets/events/formation.png"),
    Sortie: require("../../assets/events/sortie.png"),
    "Pop-up": require("../../assets/events/popup.png"),
    Autre: require("../../assets/events/autre.png"),
  };
  
  export function getEventIllustration(category) {
    return eventIllustrations[category] || eventIllustrations.Autre;
  }