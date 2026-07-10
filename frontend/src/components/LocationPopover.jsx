import { useApp } from '../context/AppContext'
import { localPhotos } from '../data/homeContent'

function LocationPopover({ isOpen, onClose, addressValue, onAddressChange, onSave }) {
  const { deliveryAddress } = useApp()

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-12 w-72 bg-white border border-gray-100 rounded-xl shadow-lg p-4 z-30">
      <p className="text-sm font-medium mb-2">Delivery location</p>
      <input
        type="text"
        value={addressValue}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Enter your address"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
      />
      {deliveryAddress && <p className="text-xs text-gray-500 mt-2">Current: {deliveryAddress}</p>}
      <button
        type="button"
        className="qb-btn mt-3 w-full bg-red-600 text-white py-2 rounded-lg text-sm"
        onClick={onSave}
      >
        Save location
      </button>
      <button type="button" className="mt-2 w-full text-xs text-gray-500" onClick={onClose}>Close</button>
    </div>
  )
}

export default LocationPopover
