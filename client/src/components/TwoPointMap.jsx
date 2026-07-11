import L from "leaflet";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import campusIconSVG from '../assets/topUni.svg';
import dormIconSVG from '../assets/room-details.svg';

export default function ListingMap({
  latitude,
  longitude,
  campus
}) {
  const hasBuilding = latitude != null && longitude != null;
  const center = hasBuilding ? [latitude, longitude] : [campus.lat, campus.lng];
  const campusIcon = new L.Icon({
    iconUrl: campusIconSVG,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
  const dormIcon = new L.Icon({
    iconUrl: dormIconSVG,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  return (
    <MapContainer
      key={`${latitude}-${longitude}`}
      center={center}
      zoom={16}
      style={{
        height: "400px",
        width: "100%"
      }}
    >
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hasBuilding && (
        <Marker position={[latitude, longitude]}>
          <Popup>Listing Location</Popup>
        </Marker>
      )
      }


      <Marker position={[campus.lat, campus.lng]} icon={campusIcon}>
        <Popup>{campus.name}</Popup>
      </Marker>
      <Circle center={[campus.lat, campus.lng]} radius={500} />

    </MapContainer >
  );
}
