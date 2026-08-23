"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const driverIcon = L.divIcon({
  html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));animation:smoak-pulse 1.6s ease-in-out infinite">🛵</div>',
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

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    map.fitBounds(points, { padding: [32, 32] });
  }, [map, points]);

  return null;
}

export default function TrackingMap({
  driver,
  delivery,
  route,
}: {
  driver: Point | null;
  delivery: Point | null;
  route?: [number, number][] | null;
}) {
  const center = driver ?? delivery ?? { lat: 48.8566, lng: 2.3522 };
  const boundsPoints: [number, number][] = [
    ...(driver ? [[driver.lat, driver.lng] as [number, number]] : []),
    ...(delivery ? [[delivery.lat, delivery.lng] as [number, number]] : []),
  ];

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-72 w-full rounded-xl"
    >
      <style>{`@keyframes smoak-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }`}</style>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route && route.length > 1 && (
        <Polyline positions={route} pathOptions={{ color: "#2b1810", weight: 4, opacity: 0.6 }} />
      )}
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
      <FitBounds points={boundsPoints} />
    </MapContainer>
  );
}
