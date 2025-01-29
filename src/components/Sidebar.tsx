import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { SessionMap } from "@/types/session";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SideBarProps {
  sessions: SessionMap;
  handleAddSession: () => void;
}


const SideBar = ({ sessions, handleAddSession }: SideBarProps) => {
  return (
    <Sidebar >
      <SidebarHeader>
        <CustomHeader handleAddSession={handleAddSession}>Sessions</CustomHeader>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
            {Object.entries(sessions).map(([id, session]) => (
              <SessionItem key={id} id={id} name={session.name} />
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>

      <SidebarFooter />
    </Sidebar>
  )

}

const CustomHeader = ({ children, className, handleAddSession }: { children: string; className?: string, handleAddSession: () => void }) => {
  return (

    <div className="flex items-center gap-2">
      <span className={className}>{children}</span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto h-8 w-8"
        onClick={handleAddSession}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

const SessionItem = ({ id, name }: { id: string, name: string }) => {
  return (
    <SidebarMenuItem key={id}>
      <SidebarMenuButton className="h-12">
        <span>{name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}


export default SideBar 