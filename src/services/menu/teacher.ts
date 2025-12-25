import { GridIcon, ListIcon, UserCircleIcon } from "@/icons";

export const teacherMenu = [
  {
    title: "Teacher Pages",
    items: [
      { name: "Dashboard", path: "/teacher/dashboard", icon: GridIcon },
      { name: "Ratings", path: "/teacher/ratings", icon: ListIcon },
      { name: "Rewards", path: "/teacher/rewards", icon: ListIcon },
      { name: "Withdrawals", path: "/teacher/withdrawals", icon: ListIcon },
    ],
  },
];
