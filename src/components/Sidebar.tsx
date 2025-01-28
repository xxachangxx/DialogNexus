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

const SideBar = () => {
  return (
    <Sidebar >
      <SidebarHeader className="text-center">
        Sessions
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem key="seesion-1">
              <SidebarMenuButton>
                <span>Session 1</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>

      <SidebarFooter />
    </Sidebar>
  )

}

export default SideBar 