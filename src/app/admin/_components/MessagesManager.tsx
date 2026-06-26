"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { ContactMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const messagesService = new FirebaseService<ContactMessage>("contact_messages");

export default function MessagesManager() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await messagesService.getAll();
      setItems(data.sort((a, b) => {
        const timeA = (a.createdAt as { seconds?: number })?.seconds || 0;
        const timeB = (b.createdAt as { seconds?: number })?.seconds || 0;
        return timeB - timeA;
      }));
    } catch {
      toast.error("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleMarkRead = async (id: string, currentStatus: boolean) => {
    try {
      toast.loading(currentStatus ? "Marking as unread..." : "Marking as read...", { id: "mark-msg" });
      await messagesService.update(id, { read: !currentStatus });
      toast.success("Updated successfully", { id: "mark-msg" });
      fetchItems();
    } catch {
      toast.error("Error updating", { id: "mark-msg" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      toast.loading("Deleting...", { id: "del-msg" });
      await messagesService.delete(id);
      toast.success("Deleted successfully", { id: "del-msg" });
      fetchItems();
    } catch {
      toast.error("Error deleting", { id: "del-msg" });
    }
  };

  if (loading && items.length === 0) return <div className="p-8 text-center text-foreground/50">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Contact Messages</h2>
        <div className="text-sm text-foreground/60">
          Total: {items.length} | Unread: {items.filter(m => !m.read).length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => {
          const createdAtSeconds = (item.createdAt as { seconds?: number })?.seconds;
          const date = createdAtSeconds 
            ? formatDistanceToNow(new Date(createdAtSeconds * 1000), { addSuffix: true }) 
            : "Unknown date";

          return (
            <Card key={item.id} className={`transition-all ${item.read ? 'bg-secondary/10' : 'bg-primary/5 border-primary/20 shadow-sm'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg ${item.read ? 'font-medium' : 'font-bold'}`}>{item.name}</h3>
                      <a href={`mailto:${item.email}`} className="text-sm text-primary hover:underline">{item.email}</a>
                      {!item.read && <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">New</span>}
                    </div>
                    <p className="text-xs text-foreground/50 mb-4">{date}</p>
                    <div className="text-sm whitespace-pre-wrap bg-background p-4 rounded-lg border border-border">
                      {item.message}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMarkRead(item.id as string, item.read || false)}
                      className="gap-2"
                    >
                      {item.read ? <Mail size={14} /> : <MailOpen size={14} />}
                      {item.read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id as string)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {items.length === 0 && !loading && (
          <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
            No messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
