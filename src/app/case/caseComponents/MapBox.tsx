"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import dotenv from "dotenv";
dotenv.config();

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
mapboxgl.accessToken = "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";


interface MapViewProps {
  coordinates: [number, number];
}

const MapBox: React.FC<MapViewProps> = ({ coordinates }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || isMapLoaded) return;

    const timeout = setTimeout(() => {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 15,
      });

      mapRef.current.on("load", () => setIsMapLoaded(true));

      const popup = new mapboxgl.Popup();
      markerRef.current = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(mapRef.current!);
    }, 500);

    return () => {
      clearTimeout(timeout);
      markerRef.current?.remove();
      mapRef.current?.remove();
    };
  }, [coordinates]);

  useEffect(() => {
    if (isMapLoaded && markerRef.current) {
      markerRef.current.setLngLat(coordinates);
      markerRef.current.getPopup();
    }
  }, [coordinates, isMapLoaded]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} 
    className="border rounded-lg"/>
  );
};

export default MapBox;
