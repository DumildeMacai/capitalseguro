import { useState } from "react";
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

// Mock notifications until table is created
const mockNotifications: Notification[] = [
  {
    id: "1",
    titulo: "Bem-vindo à plataforma",
    mensagem: "Obrigado por se registrar. Explore as oportunidades de investimento disponíveis.",
    tipo: "sistema",
    lido: false,
    data_criacao: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Novo investimento disponível",
    mensagem: "Uma nova oportunidade de investimento em imóveis está disponível com retorno de 100%.",
    tipo: "investimento",
    lido: false,
    data_criacao: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    titulo: "Atualização de rendimento",
    mensagem: "Seus investimentos acumularam Kz 5.000 em rendimentos este mês.",
    tipo: "rendimento",
    lido: false,
    data_criacao: new Date(Date.now() - 172800000).toISOString(),
  }
];

interface NotificationsSectionProps {
  userId: string;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationsSection = ({ userId, onUnreadCountChange }: NotificationsSectionProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter((n) => !n.lido).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(count);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === notificationId ? { ...n, lido: true } : n));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notificationId);
      updateUnreadCount(updated);
      return updated;
    });
  };

  const unreadCount = notifications.filter((n) => !n.lido).length;

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
