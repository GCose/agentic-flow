import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientActivities } from "@/mock/activities";

const ClientActivity = () => {
  return (
    <Card className="border-none bg-slate-800/50">
      <CardHeader>
        <CardTitle>Recent Client Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {clientActivities.map((clientActivity) => (
            <div key={clientActivity.id} className="flex items-start">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className={clientActivity.color}>
                  {clientActivity.client.charAt(0)}
                </AvatarFallback>
              </Avatar> 
              <div className="ml-4 flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {clientActivity.client}
                </p>
                <p className="text-sm text-muted-foreground pr-4 truncate">
                  {clientActivity.action}
                </p>
              </div>
              <div className="ml-4 shrink-0 text-sm text-muted-foreground text-right whitespace-nowrap">
                {clientActivity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientActivity;
