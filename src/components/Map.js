import React from 'react'
import { MapContainer, TileLayer, useMap} from 'react-leaflet'
import '../componentCss/Map.css'
import { showDataOnMap } from '../utilityComponents/util'
import ChangeMap from './ChangeMap'


function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <MapContainer >
               <ChangeMap center={center} zoom={zoom} />
                <TileLayer 
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Loop through countries and draw circles on the screen */}
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
