import {
  ClockIcon,
  HomeIcon,
  ViewListIcon,
  UsersIcon,
} from "@heroicons/react/outline";

export const navigation = [
  { name: "Home", to: "/admin", icon: HomeIcon, current: true },
  { name: "Users", to: "/admin/user", icon: UsersIcon, current: false },
  { name: "Jobs", to: "/admin/job", icon: UsersIcon, current: false },
  { name: "Recent", to: "/admin", icon: ClockIcon, current: false },
];
