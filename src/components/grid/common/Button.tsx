// src/components/grid/common/Button.tsx
const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      className={`h-8 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium 
        bg-blue-600 text-white hover:bg-blue-700 
        transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-blue-600 focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50
        ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
