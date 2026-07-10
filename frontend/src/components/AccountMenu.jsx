import { useApp } from '../context/AppContext'

function AccountMenu({ isOpen, onClose }) {
  const { isLoggedIn, mockSignIn, mockSignOut } = useApp()

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-30">
      {isLoggedIn ? (
        <>
          <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Profile</button>
          <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Orders</button>
          <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600" onClick={() => { mockSignOut(); onClose() }}>Log out</button>
        </>
      ) : (
        <>
          <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { mockSignIn(); onClose() }}>Sign in</button>
          <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { mockSignIn(); onClose() }}>Sign up</button>
        </>
      )}
    </div>
  )
}

export default AccountMenu
