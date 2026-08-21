"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const driverIcon = L.divIcon({
  html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))">🛵</div>',
  className: "",
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const destinationIcon = L.divIcon({
  html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))">📍</div>',
  className: "",
  iconSize: [26, 32],
  iconAnchor: [13, 30],
});

interface Point {
  lat: number;
  lng: number;
}

export default function TrackingMap({
  driver,
  delivery,
}: {
  driver: Point | null;
  delivery: Point | null;
}) {
  const center = driver ?? delivery ?? { lat: 48.8566, lng: 2.3522 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-72 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {driver && (
        <Marker position={[driver.lat, driver.lng]} icon={driverIcon}>
          <Popup>Livreur</Popup>
        </Marker>
      )}
      {delivery && (
        <Marker position={[delivery.lat, delivery.lng]} icon={destinationIcon}>
          <Popup>Adresse de livraison</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
