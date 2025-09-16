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
    PanelLeftIcon
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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


export const ROLE_SUPER_ADMIN		= "SUPER_ADMIN";
export const ROLE_BRANCH_MANAGER	= "BRANCH_MANAGER";
export const ROLE_DOCTOR			= "DOCTOR";
export const ROLE_ADMIN_STAFF		= "ADMIN_STAFF";
export const ROLE_NURSE			    = "NURSE";
export const ROLE_RECEPTIONIST	    = "RECEPTIONIST";
export const ROLE_BILLING_STAFF	    = "BILLING_STAFF";
export const ROLE_INSURANCE_AGENT	= "INSURANCE_AGENT";
export const ROLE_PATIENT			= "PATIENT";
export const ROLE_USER			    = "USER";

import { NavLink, useNavigate } from "react-router-dom";

interface SidebarItemLink {
	type: "link";
	title: string;
	url: string;
	icon: LucideIcon;
	hideIf?: (role: string) => boolean;
}

interface SidebarItemGroup {
	type: "group";
	title: string;
	icon: LucideIcon;
	links: Array<SidebarItemLink>;
	hideIf?: (role: string) => boolean;
}

const items: Array<SidebarItemLink | SidebarItemGroup> = [
    {
        type: "link",
        title: "Dashboard",
        url: "/",
        icon: Hospital,
        hideIf:(role) => typeof role !== "string" || role == ROLE_PATIENT,
    },
    {
        type: "group",
        title: "Patient Dashboard",
        icon: HeartPulse,
        hideIf:(role) => typeof role !== "string" || role != ROLE_PATIENT,
        links: [
            {
                type: "link",
                title: "Medical History",
                url: "",
                icon: BookOpen,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_PATIENT, ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Outstanding bills",
                url: "",
                icon: FileStack,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_PATIENT, ROLE_BILLING_STAFF, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Insurances info",
                url: "",
                icon: IdCardLanyard,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_PATIENT, ROLE_INSURANCE_AGENT, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Payment history",
                url: "",
                icon: FileClock,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_PATIENT, ROLE_BILLING_STAFF, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            }
        ],
    },
    {
        type: "group",
        title: "Doctors' Dashboard",
        icon: Stethoscope,
        // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
        links: [
            {
                type: "link",
                title: "Doctors' details",
                url: "",
                icon: HeartPulse,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Appointment details",
                url: "",
                icon: FileUser,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Patients history",
                url: "",
                icon: BookUser,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
        ],
    },
    {
        type: "group",
        title: "Staff Dashboard",
        icon: Users,
        // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
        links: [
            {
                type: "link",
                title: "Staffs details",
                url: "",
                icon: UserSearch,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Reports",
                url: "",
                icon: ClipboardPenLine,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
        ],
    },
    {
        type: "group",
        title: "Appointments",
        icon: ClipboardClock,
        // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
        links: [
            {
                type: "link",
                title: "All Appointments",
                url: "",
                icon: ClipboardList,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Doctors' avilable time",
                url: "",
                icon: ClockPlus,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Add Appointment",
                url: "",
                icon: ClipboardPlus,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Schedule/Reschedule",
                url: "",
                icon: CalendarSync,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Cancelled",
                url: "",
                icon: CalendarX2,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
        ],
    },
    {
        type: "group",
        title: "Billing & Payment",
        icon: Receipt,
        // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
        links: [
            {
                type: "link",
                title: "Invoice details",
                url: "",
                icon: ReceiptText,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Outstanding balances",
                url: "",
                icon: BanknoteX,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "Make payment",
                url: "",
                icon: CreditCard,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
        ],
    },
    {
        type: "group",
        title: "Insurance info",
        icon: HandCoins,
        // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
        links: [
            {
                type: "link",
                title: "",
                url: "",
                icon: HandCoins,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
            {
                type: "link",
                title: "",
                url: "",
                icon: HandCoins,
                hideIf:(role) => typeof role !== "string" || 
                ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
            },
        ],
    },
]

export function AppSidebar() {
    const { toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    const user = {
        role: "",
        username: "",
    };
    const role = "";
    const logout = () => {
		navigate("/.....");
	};

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="gap-0">
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        {user ? (
                            <>
                                <User />
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.username}</span>
                                    <span className="text-xs">
                                        {user.role}
                                    </span>
                                </div>
                            </>
                        ) : null}
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {items.map((item) => 
                    item.type !== "link" || item.hideIf?.(role) ? null : (
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
            item.type !== "group" || item.hideIf?.(role) ? null : (
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
                                        {item.links.map((link) => (
                                            <SidebarMenuSubItem key={link.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <NavLink to={link.url}>
                                                        <link.icon size={25} className="size-40" />
                                                        <span>{link.title}</span>
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
                <SidebarMenuButton
                    className="text-destructive hover:text-destructive"
                    onClick={logout}
                >
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={toggleSidebar}
                >
                    <PanelLeftIcon />
                    <span>Hide</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarFooter>
    </Sidebar>
  )
}