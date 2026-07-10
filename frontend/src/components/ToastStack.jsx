import { useApp } from '../context/AppContext'

function ToastStack() {
  const { toastList } = useApp()

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toastList.map((toast) => (
        <div
          key={toast.toastId}
          className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg fade-in"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastStack
