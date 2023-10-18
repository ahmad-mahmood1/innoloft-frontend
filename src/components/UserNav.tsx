import { Icons } from "@/components/icons";
import { Company, User } from "@/type";
import { Link } from "react-router-dom";


type UserNavProps = {
  user: User;
  company: Company;
};

const navItems = [
  { name: "Home", icon: <Icons.home />, children: null, to: "/" },
  { name: "Members", icon: <Icons.members />, children: null, to: "/" },
  {
    name: "Organizations",
    icon: <Icons.organizations />,
    children: [],
    to: "/",
  },
];

function UserNav({ user, company }: UserNavProps) {
  return (
    <div className="flex flex-col">
      <div className="flex space-x-5 items-center">
        <img src={user.profilePicture} className="rounded-full w-14" />
        <div>
          <div className="font-semibold text-base text-lg">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-base text-lg">{company.name}</div>
        </div>
      </div>

      <nav className="mt-8 px-6 space-y-6">
        {navItems.map((item) => (
          <ul key={item.name}>
            <li>
              <Link className="flex items-center" to={item.to}>
                <div className="mr-6">{item.icon}</div>
                <div className="text-base flex-1">{item.name}</div>
                {!!item.children && (
                  <Icons.arrowDown stroke="#374151" strokeWidth={"0.5"} />
                )}
              </Link>
            </li>
          </ul>
        ))}
      </nav>
    </div>
  );
}

export default UserNav;
