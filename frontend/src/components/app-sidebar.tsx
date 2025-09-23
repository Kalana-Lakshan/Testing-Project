import {
  Hospital,
  Receipt,
  ClipboardClock,
  Stethoscope,
  User,
  Users,
  HeartPulse,
  HandCoins,
  type LucideIcon,
  FileClock,
  FileStack,
  IdCardLanyard,
  BookOpen,
  FileUser,
  BookUser,
  UserSearch,
  ClipboardPlus,
  ClipboardList,
  CalendarSync,
  CalendarX2,
  CreditCard,
  ReceiptText,
  ClockPlus,
  BanknoteX,
  ClipboardPenLine,
  ChevronRight,
  LogOut,
  PanelRightOpen
} from "lucide-react"
// billing and paments - Receipt
// patient - Users
// doctor - Stethoscope
// insurance - HandCoins
// appointments - ClipboardClock
// home - Hospital
// user - user

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const ROLE_SUPER_ADMIN = "SUPER_ADMIN";
export const ROLE_BRANCH_MANAGER = "BRANCH_MANAGER";
export const ROLE_DOCTOR = "DOCTOR";
export const ROLE_ADMIN_STAFF = "ADMIN_STAFF";
export const ROLE_NURSE = "NURSE";
export const ROLE_RECEPTIONIST = "RECEPTIONIST";
export const ROLE_BILLING_STAFF = "BILLING_STAFF";
export const ROLE_INSURANCE_AGENT = "INSURANCE_AGENT";
export const ROLE_PATIENT = "PATIENT";
export const ROLE_USER = "USER";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

interface SidebarItemLink {
  type: "child";
  title: string;
  url: string;
  icon: LucideIcon;
  hideIf?: (role: string) => boolean;
}

interface SidebarItemGroup {
  type: "parent";
  title: string;
  icon: LucideIcon;
  children: Array<SidebarItemLink>;
  hideIf?: (role: string) => boolean;
}

const items: Array<SidebarItemLink | SidebarItemGroup> = [
  {
    type: "child",
    title: "Dashboard",
    url: "/",
    icon: Hospital,
    hideIf: (role) => typeof role !== "string" || role == ROLE_PATIENT,
  },
  {
    type: "parent",
    title: "Patient Dashboard",
    icon: HeartPulse,
    hideIf: (role) => typeof role !== "string" || role != ROLE_PATIENT,
    children: [
      {
        type: "child",
        title: "Medical History",
        url: "",
        icon: BookOpen,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_PATIENT, ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Outstanding bills",
        url: "",
        icon: FileStack,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_PATIENT, ROLE_BILLING_STAFF, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Insurances info",
        url: "",
        icon: IdCardLanyard,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_PATIENT, ROLE_INSURANCE_AGENT, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Payment history",
        url: "",
        icon: FileClock,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_PATIENT, ROLE_BILLING_STAFF, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      }
    ],
  },
  {
    type: "parent",
    title: "Doctors' Dashboard",
    icon: Stethoscope,
    //hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "Doctors' details",
        url: "",
        icon: HeartPulse,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Appointment details",
        url: "",
        icon: FileUser,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Patients history",
        url: "",
        icon: BookUser,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
  {
    type: "parent",
    title: "Staff Dashboard",
    icon: Users,
    // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "Staffs details",
        url: "",
        icon: UserSearch,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Reports",
        url: "",
        icon: ClipboardPenLine,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
  {
    type: "parent",
    title: "Appointments",
    icon: ClipboardClock,
    // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "All Appointments",
        url: "",
        icon: ClipboardList,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Doctors' avilable time",
        url: "",
        icon: ClockPlus,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Add Appointment",
        url: "",
        icon: ClipboardPlus,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Schedule/Reschedule",
        url: "",
        icon: CalendarSync,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Cancelled",
        url: "",
        icon: CalendarX2,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
  {
    type: "parent",
    title: "Billing & Payment",
    icon: Receipt,
    // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "Invoice details",
        url: "",
        icon: ReceiptText,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Outstanding balances",
        url: "",
        icon: BanknoteX,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Make payment",
        url: "",
        icon: CreditCard,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
  {
    type: "parent",
    title: "Insurance info",
    icon: HandCoins,
    // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "",
        url: "",
        icon: HandCoins,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "",
        url: "",
        icon: HandCoins,
        hideIf: (role) => typeof role !== "string" ||
          ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
]

export function AppSidebar() {
  const [loading, setLoading] = useState<boolean>(false);
  const { toggleSidebar, open } = useSidebar();
  const navigate = useNavigate();
  const user = {
    role: "User",
    username: "K Rakeshan",
  };
  const role = "";
  const logout = () => {
    navigate("/sign-in");
  };

  return loading ? (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  ) : (
    <Sidebar
      collapsible="icon"
      onClick={!open ? toggleSidebar : undefined}
    >
      <SidebarHeader>
        <SidebarMenu>
          {open ?
            <SidebarMenuItem className="flex flex-row">
              <div>
                <img src="/logo.svg" />
              </div>
              <div>
                <PanelRightOpen size={20} className="cursor-pointer" onClick={toggleSidebar} />
              </div>
            </SidebarMenuItem>
            :
            <SidebarMenuItem>
              <img src="/favicon.svg" />
            </SidebarMenuItem>
          }
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) =>
              item.type !== "child" || item.hideIf?.(role) ? null : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon size={25} className="size-40" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
        {items.map((item) =>
          item.type !== "parent" || item.hideIf?.(role) ? null : (
            <SidebarGroup>
              <SidebarMenu>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon size={25} className="size-40" />
                        {item.title}
                        <ChevronRight className="ml-auto duration-200 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink to={child.url}>
                                <child.icon size={25} className="size-40" />
                                <span>{child.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroup>
          )
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-15">
                  {user ? (
                    <>
                      <User />
                      <div className="flex flex-col pl-1">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs">
                          {user.role}
                        </span>
                      </div>
                    </>
                  ) : null}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                // className="w-[--radix-popper-anchor-width]"
                className="w-full w-(--sidebar-width)"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive"
                  onClick={logout}>
                  <LogOut />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}