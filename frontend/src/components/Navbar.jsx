import UserMenu from "./NavbarComponents/Usermenu.jsx";
import Logo from "./NavbarComponents/Logo.jsx";

const Navbar = () => {
  return (
    <nav className="bg-[var(--custom-background)] mb-40 p-4 shadow-lg h-24 max-h-24 fixed top-0 left-0 w-full min-w-[350px] ">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
