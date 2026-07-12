// utils/campuses.js
const CAMPUSES = {
  UPM: {
    name: "University of the Philippines Manila",
    lat: 14.5759437,
    lng: 120.9864733
  },
  DLSU: {
    name: "De La Salle University",
    lat: 14.5644408,
    lng: 120.993459
  },
  ADMU: {
    name: "Ateneo de Manila",
    lat: 14.6398984,
    lng: 121.0781952
  },
  UST: {
    name: "University of Santo Thomas",
    lat: 14.6098426,
    lng: 120.9894646
  },
  UPD: {
    name: "University of the Philippines Diliman",
    lat: 14.6547213,
    lng: 121.0663102, // fixed: this was "long" instead of "lng" in the original — would've broken the map the same way as before
  }
};

export default CAMPUSES;
