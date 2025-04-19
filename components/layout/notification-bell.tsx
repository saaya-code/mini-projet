"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Notification {
  _id: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (!response.ok) throw new Error("Failed to fetch notifications")

      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification._id}/read`, {
          method: "PUT",
        })

        // Update local state
        setNotifications(notifications.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error("Error marking notification as read:", error)
      }
    }

    // Navigate if there's a link
    if (notification.link) {
      setIsOpen(false)
      router.push(notification.link)
    }
  }

  const markAllAsRead = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/notifications/read-all", {
        method: "PUT",
      })

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success("Toutes les notifications ont été marquées comme lues")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Erreur lors de la mise à jour des notifications")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={isLoading} className="text-xs">
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Aucune notification</div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <h5 className="font-medium">{notification.title}</h5>
                    {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
