import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Check } from "lucide-react";

interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lido: boolean;
  data_criacao: string;
  relacionada_a?: string;
}

const NotificationsSection = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `usuario_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
            );
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("usuario_id", userId)
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setNotifications((data || []) as Notification[]);
    } catch (error: any) {
      console.error("Erro ao buscar notificações:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar notificações.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ lido: true, data_leitura: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, lido: true } : n))
      );
    } catch (error: any) {
      console.error("Erro ao marcar como lida:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível marcar notificação como lida.",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      toast({
        title: "Sucesso",
        description: "Notificação deletada.",
      });
    } catch (error: any) {
      console.error("Erro ao deletar notificação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deletar notificação.",
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.lido).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Carregando notificações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} notificações não lidas` : "Todas as notificações lidas"}
                </CardDescription>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount} nova{unreadCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Você não tem notificações</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.lido
                      ? "bg-background border-border hover:border-border"
                      : "bg-primary/5 border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{notification.titulo}</h4>
                        {!notification.lido && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            Novo
                          </Badge>
                        )}
                      </div>
                      {notification.mensagem && (
                        <p className="text-sm text-muted-foreground mb-2">{notification.mensagem}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.data_criacao).toLocaleString("pt-PT")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.lido && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Marcar como lida"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSection;
