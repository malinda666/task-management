import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Diagram,
  Home,
  LampCharge,
  NotificationBing,
  Setting2,
  TaskSquare,
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "/dashboard/task-management",
    icon: TaskSquare,
  },
  {
    title: "Report",
    url: "#",
    icon: Diagram,
  },
  {
    title: "Insights",
    url: "#",
    icon: LampCharge,
  },
  {
    title: "Inbox",
    url: "#",
    icon: NotificationBing,
  },
  {
    title: "Settings",
    url: "#",
    icon: Setting2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-0">
        <div className="relative flex items-center justify-start header px-2">
          <div className="relative aspect-square h-8">
            <Image src="/assets/logo.png" alt="Code94Labs" fill></Image>
          </div>
          <span className="font-semibold">Code94Labs</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarLink item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const SidebarLink = ({
  item,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: { title: string; url: string; icon: any };
}) => {
  const { pathname } = useRouter();

  const isPathMatches = pathname === item.url;

  return (
    <SidebarMenuButton size="lg" asChild>
      <Link
        href={item.url}
        className={cn(
          isPathMatches
            ? "bg-primary text-background hover:bg-black hover:text-background"
            : ""
        )}
      >
        <span>
          <item.icon size="24" color={isPathMatches ? "#fff" : "#555555"} />
        </span>
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
};
