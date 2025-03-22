function NavBar() {
  return (
    <nav className=" shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold">MySite</div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-500">
              Home
            </a>
            <a href="#" className="hover:text-blue-500">
              About
            </a>
            <a href="#" className="hover:text-blue-500">
              Projects
            </a>
            <a href="#" className="hover:text-blue-500">
              Contact
            </a>
          </div>
          <div className="md:hidden">
            <button id="menu-btn" className="focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div id="mobile-menu" className="md:hidden hidden px-4 pb-4">
        <a href="#" className="block py-2 hover:text-blue-500">
          Home
        </a>
        <a href="#" className="block py-2 hover:text-blue-500">
          About
        </a>
        <a href="#" className="block py-2 hover:text-blue-500">
          Projects
        </a>
        <a href="#" className="block py-2 hover:text-blue-500">
          Contact
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
