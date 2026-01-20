'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  ChevronDown,
  Facebook,
  Filter,
  History,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  MessageCircle,
  MessageSquareText,
  Search,
  Send,
  Settings,
  Share2,
  Users,
} from "lucide-react";

// Mock Data
const contacts = [
  { id: 1, name: "Dr. Hussain", avatar: "https://picsum.photos/seed/hussain/40/40", message: "Free Tier Conversation S..", active: true },
  { id: 2, name: "Arvind Bajaj", avatar: "https://picsum.photos/seed/bajaj/40/40", message: "₹1,500.00 received fr..", active: true },
  { id: 3, name: "Manish", avatar: "https://picsum.photos/seed/manish/40/40", message: "Marketing Conversation..", active: true },
  { id: 4, name: "Yash Batra", avatar: "https://picsum.photos/seed/yash/40/40", message: "₹1,500.00 received from..", active: true },
  { id: 5, name: "Monika Shah", avatar: "https://picsum.photos/seed/monika/40/40", message: "₹1,500.00 received from..", active: true },
  { id: 6, name: "Paula D'Cruz", avatar: "https://picsum.photos/seed/paula/40/40", message: "Utility Conversation Star..", active: false },
  { id: 7, name: "Sam Baldwin", avatar: "https://picsum.photos/seed/sam/40/40", message: "Utility Conversation Star..", active: false },
  { id: 8, name: "Jeff", avatar: "https://picsum.photos/seed/jeff/40/40", message: "Hello there!", active: false },
];

const topNavAvatars = [
  { name: "User 1", avatar: "https://picsum.photos/seed/user1/32/32", unread: 2 },
  { name: "User 2", avatar: "https://picsum.photos/seed/user2/32/32", unread: 0 },
  { name: "User 3", avatar: "https://picsum.photos/seed/user3/32/32", unread: 1 },
  { name: "User 4", avatar: "https://picsum.photos/seed/user4/32/32", unread: 0 },
  { name: "User 5", avatar: "https://picsum.photos/seed/user5/32/32", unread: 0 },
  { name: "User 6", avatar: "https://picsum.photos/seed/user6/32/32", unread: 1 },
];

const CrmSidebar = () => {
    const icons = [
        LayoutGrid, MessageSquareText, History, Users, Send, Facebook,
        Share2, MessageCircle, Bot, Settings, LayoutDashboard, LifeBuoy
    ];

    return (
        <div className="w-[70px] bg-card flex flex-col items-center py-4 text-muted-foreground">
            <div className="mb-4">
                 <svg width="30" height="30" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 0C6.939 0 0 6.939 0 15.5C0 24.061 6.939 31 15.5 31C24.061 31 31 24.061 31 15.5C31 6.939 24.061 0 15.5 0ZM21.05 23.116L18.892 20.957C17.013 22.368 14.839 23.25 12.4 23.25C6.862 23.25 2.325 18.713 2.325 13.175C2.325 7.638 6.862 3.1 12.4 3.1C15.826 3.1 18.835 4.805 20.679 7.424L22.959 5.144C20.309 2.494 16.598 0.775 12.4 0.775C5.705 0.775 0 6.48 0 13.175C0 19.87 5.705 25.575 12.4 25.575C14.074 25.575 15.748 25.176 17.266 24.479L19.424 26.637L17.13 28.931L23.361 28.931L23.361 22.7L21.05 23.116Z" fill="hsl(var(--primary))"></path></svg>
            </div>
            <div className="flex flex-col items-center space-y-2 flex-grow">
                {icons.map((Icon, index) => (
                    <Button key={index} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                        <Icon className="h-6 w-6" />
                    </Button>
                ))}
            </div>
            <div className="mt-auto">
                 <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/admin-crm/32/32" alt="admin" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};


export default function CrmAdminPage() {
  return (
    <div className="flex h-screen bg-background text-foreground antialiased">
      <CrmSidebar />
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="bg-card flex items-center px-4 py-2 shrink-0 border-b">
            <div className="relative w-[340px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name or mobile number" className="bg-input border-transparent text-foreground rounded-lg pl-10 h-9 focus:bg-muted" />
            </div>
             <div className="flex-1 flex items-center justify-start gap-1 pl-4">
                {topNavAvatars.map((user, index) => (
                    <div key={index} className="relative cursor-pointer">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.unread > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 justify-center text-xs bg-destructive text-destructive-foreground border-2 border-card">{user.unread}</Badge>
                        )}
                    </div>
                ))}
             </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
            {/* Conversation List */}
            <aside className="w-[380px] bg-card border-r flex flex-col">
                <div className="p-2 border-b">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex gap-1">
                            <Button variant="ghost" className="px-2 py-1 h-auto text-primary font-bold border-b-2 border-primary rounded-none">ACTIVE (21)</Button>
                            <Button variant="ghost" className="px-2 py-1 h-auto font-bold">REQUESTING (24)</Button>
                            <Button variant="ghost" className="px-2 py-1 h-auto font-bold">INTERVENED (1)</Button>
                        </div>
                    </div>
                </div>
                <div className="p-3 border-b flex items-center justify-between bg-muted/50">
                     <Button variant="ghost" className="font-semibold text-sm p-0 h-auto">
                        <ChevronDown className="h-5 w-5 mr-1 text-muted-foreground" />
                        Arvind Bajaj (+91 987654321)
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                         <div key={contact.id} className={`flex items-start gap-3 p-3 cursor-pointer border-b ${contact.name === 'Arvind Bajaj' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                             <Avatar className="h-12 w-12 mt-1">
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate">{contact.name}</p>
                                    {contact.active && <div className="text-xs text-green-600 font-medium">10:49 AM</div>}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{contact.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Area & Profile Pane */}
            <main className="flex-1 grid" style={{ gridTemplateColumns: '1fr 320px' }}>
                 <div className="flex flex-col">
                     <div className="flex-1 bg-muted/30 p-4 flex items-center justify-center relative bg-[url('https://picsum.photos/seed/pattern/1000/1000')] bg-blend-soft-light bg-opacity-10">
                         <div className="text-center text-muted-foreground">
                             <p>Select a chat to start messaging</p>
                             <p className="text-xs mt-2">This is a visual clone. Chat functionality is not implemented.</p>
                         </div>
                     </div>
                 </div>

                {/* Profile Pane */}
                <div className="bg-muted p-6 border-l flex flex-col items-center text-center">
                    <Button variant="ghost" className="w-full justify-center mb-6 bg-background py-3 text-base font-semibold">Chat Profile</Button>
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-offset-2 ring-border">
                        <AvatarImage src="https://picsum.photos/seed/bajaj/96/96" alt="Arvind Bajaj" />
                        <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">Arvind Bajaj</h2>
                    <p className="text-muted-foreground">+91 987654321</p>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}
