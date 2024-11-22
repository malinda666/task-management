import React from "react";
import { Provider } from "react-redux";
import { store } from "@/ctx/store";
import { LayoutProps } from "@/types";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Input } from "../ui/input";
import { HambergerMenu, SearchNormal } from "iconsax-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Layout = ({ children }: LayoutProps) => {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-neutral-100">
          <div className="header sticky top-0 w-full flex items-center justify-between border-b bg-background p-2">
            <div className="relative">
              <Input type="text" placeholder="Search tasks" className="pl-8" />
              <span className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50">
                <SearchNormal size="16" color="#555555" />
              </span>
            </div>
            <div className="p-1 rounded-full shadow-sm border flex items-center">
              <span className="">
                <HambergerMenu size="24" color="#000" />
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/300" alt="@user" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="p-2">{children}</div>
        </main>
      </SidebarProvider>
    </Provider>
  );
};

export default Layout;
