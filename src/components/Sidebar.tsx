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
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SessionMap } from "@/types/session";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SideBarProps {
  sessions: SessionMap;
  handleAddSession: () => void;
  handleRemoveSession: (id: string) => void;
}


const SideBar = ({ sessions, handleAddSession, handleRemoveSession }: SideBarProps) => {
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
              <SessionItem key={id} id={id} name={session.name} handleRemoveSession={handleRemoveSession} />
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

const SessionItem = ({ id, name, handleRemoveSession }: { id: string, name: string, handleRemoveSession: (id: string) => void }) => {
  return (
    <SidebarMenuItem key={id}>
      <SidebarMenuButton size="lg">
        <span>{name}</span>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className="">
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={() => handleRemoveSession(id)}>
            <span>Delete Session</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}


export default SideBar 