import {useMap} from 'react-leaflet'

function ChangeMap({center, zoom}) {
     const map = useMap();
     map.setView(center, zoom);
     return null;
}

export default ChangeMap
