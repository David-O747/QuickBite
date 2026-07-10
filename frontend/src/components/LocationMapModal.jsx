import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { mapCentre } from '../api/fetchOsmRestaurants'
import 'leaflet/dist/leaflet.css'

function LocationMapModal({ isOpen, onClose, restaurantList }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg">Restaurants near you</h3>
            <p className="text-sm text-gray-500">Powered by OpenStreetMap</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="h-[420px]">
          <MapContainer
            center={[mapCentre.latitude, mapCentre.longitude]}
            zoom={6}
            className="h-full w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {restaurantList.map((restaurant) => (
              <CircleMarker
                key={restaurant.osmPlaceId || restaurant.restaurantName}
                center={[restaurant.mapLatitude, restaurant.mapLongitude]}
                radius={7}
                pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.9 }}
              >
                <Popup>
                  <strong>{restaurant.restaurantName}</strong>
                  <br />
                  {restaurant.cuisineLabel}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-100">
          Map data from{' '}
          <a href="https://www.openstreetmap.org/#map=6/54.91/-3.43" className="text-red-600 underline">
            OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  )
}

export default LocationMapModal
