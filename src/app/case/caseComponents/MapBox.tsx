"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";

interface MapViewProps {
  coordinates: [number, number];
  description: string;
}

const MapBox: React.FC<MapViewProps> = ({ coordinates, description }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  console.log(coordinates)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 15,
    });
    markerRef.current = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(description)) 
      .addTo(mapRef.current);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (markerRef.current && coordinates) {
      markerRef.current.setLngLat(coordinates);
    }
  }, [coordinates]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default MapBox;
