import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Props {
  loc?: string;
}

const MapWithMarker: React.FC<Props> = ({ loc }) => {
  if (!loc) return null;

  const [lat, lng] = loc.split(",").map(Number);

  const icon = L.icon({
    iconUrl: "/assets/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={6}
      style={{ height: 300, width: "100%", marginTop: 20 }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWithMarker;
