'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, GeoJSON, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface City {
  name: string;
  lat: number;
  lng: number;
}

interface ZonesMapProps {
  departmentCode: '60' | '95';
  cities: City[];
  center: [number, number];
  zoom: number;
}

function FitToBounds({ geoJsonData }: { geoJsonData: GeoJSON.Feature | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (geoJsonData) {
      const layer = L.geoJSON(geoJsonData);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  }, [geoJsonData, map]);
  
  return null;
}

export default function ZonesMap({ departmentCode, cities, center, zoom }: ZonesMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.Feature | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Charger le GeoJSON des départements
    fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson')
      .then(r => r.json())
      .then(data => {
        const department = data.features.find((f: { properties: { code: string } }) => 
          f.properties.code === departmentCode
        );
        if (department) {
          setGeoJsonData(department);
        }
      })
      .catch(console.error);
  }, [departmentCode]);

  if (!isClient) {
    return (
      <div className="h-[350px] w-full bg-secondary-100 flex items-center justify-center">
        <p className="text-secondary-500">Chargement de la carte...</p>
      </div>
    );
  }

  const geoJsonStyle = {
    fillColor: '#f97316',
    fillOpacity: 0.4,
    color: '#ea580c',
    weight: 2,
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-[350px] w-full"
    >
      <TileLayer
        attribution='© OpenStreetMap, © CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {geoJsonData && (
        <>
          <GeoJSON data={geoJsonData} style={geoJsonStyle} />
          <FitToBounds geoJsonData={geoJsonData} />
        </>
      )}
      
      {cities.map((city) => (
        <CircleMarker
          key={city.name}
          center={[city.lat, city.lng]}
          radius={6}
          fillColor="#1e293b"
          fillOpacity={1}
          color="#fff"
          weight={2}
        >
          <Tooltip direction="top">{city.name}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
