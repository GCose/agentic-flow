import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function AdminImpersonatePage() {
  const { impersonateUser, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const s = search.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.role.toLowerCase().includes(s)
    );
  }, [users, search]);

  return (
    <DashboardLayout meta={{ title: "Impersonate User" }} role="admin">
      <DashboardHeader title="Impersonate Any User" />
      <div className="p-8">
        <div className="mb-6 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        {loading ? (
          <div>Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(u => (
              <Card key={u.id} className="shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{u.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-900 text-white ml-2">{u.role}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    onClick={() => impersonateUser(u)}
                    disabled={user?.id === u.id}
                  >
                    {user?.id === u.id ? "You" : `Impersonate`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
