const Button = ({ children, ...props }) => {

  return (
    <button className="px-2 py-1 rounded-sm border text-white hover:text-black border-green-500 hover:bg-green-500 focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 focus:outline-none transition-colors duration-200"
      {...props}
    >
      {children}
    </button>
  )

}

export default Button;