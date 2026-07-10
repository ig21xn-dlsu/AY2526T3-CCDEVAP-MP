import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ListingMap({
  latitude,
  longitude,
  campus
}) {
  return (
    <MapContainer
      key={`${latitude}-${longitude}`}
      center={[latitude, longitude]}
      zoom={16}
      style={{
        height: "400px",
        width: "100%"
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]}>
        <Popup>Listing Location</Popup>
      </Marker>

      <Marker position={[campus.lat, campus.lng]}>
        <Popup>{campus.name}</Popup>
      </Marker>
    </MapContainer>
  );
}
