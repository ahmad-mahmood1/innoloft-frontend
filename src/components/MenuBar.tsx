import { Icons } from "@/components/icons";

function MenuBar() {
  return (
    <div className="flex space-x-4 text-white items-center">
      <Icons.messenger />
      <div className="flex items-center space-x-2">
        <span>EN</span>
        <Icons.arrowDown />
      </div>
      <Icons.notification />
      <div className="flex items-center space-x-2">
        <img src="profile.png" className="w-10 rounded-full" />
        <Icons.arrowDown />
      </div>
    </div>
  );
}

export default MenuBar;
