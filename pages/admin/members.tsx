import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/router";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MembersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Always call hooks before any return
  useEffect(() => {
    if (user?.role === "ghl_admin") {
      router.replace("/ghl");
    } else if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchMembers();
  }, []);

  if (user?.role === "ghl_admin") {
    // Prevent rendering if redirecting
    return null;
  }

  const fetchMembers = () => {
    setLoading(true);
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return ( 
    <DashboardLayout meta={{ title: "Members Management" }} role="admin">
      <DashboardHeader title="Members Management" />
      <div className="flex-1 p-4 py-2">
        <div className="mb-4 flex justify-end">
          <Button variant="default" onClick={() => setShowCreate(true)}>
            Create Member
          </Button>
        </div>
      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <h3 className="text-lg font-bold mb-2">Create Member</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateLoading(true);
              const formData = new FormData(e.currentTarget);
              const name = formData.get("name") as string;
              const email = formData.get("email") as string;
              const role = formData.get("role") as string;
              const password = formData.get("password") as string;
              await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, role, password }),
              });
              setCreateLoading(false);
              setShowCreate(false);
              fetchMembers();
            }}
          >
            <div className="mb-2">
              <label>Name</label>
              <Input name="name" required />
            </div>
            <div className="mb-2">
              <label>Email</label>
              <Input name="email" type="email" required />
            </div>
            <div className="mb-2">
              <label>Role</label>
              <Input name="role" required />
            </div>
            <div className="mb-2">
              <label>Password</label>
              <Input name="password" type="password" required />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="submit" disabled={createLoading}>
                {createLoading ? "Creating..." : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
        <Card className="border-none bg-transparent">
          <CardHeader>
            <h2 className="text-lg font-medium">Team Members</h2>
            <p className="text-sm text-muted-foreground">
              Manage your team members (admins, designers, videographers, ghl admins).
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border rounded text-white">
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{member.name}</td>
                      <td className="px-4 py-2">{member.email}</td>
                      <td className="px-4 py-2">{member.role}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedMember(member); setShowView(true); }}>View</Button>
                        <Button size="sm" variant="default" onClick={() => { setEditMember(member); setShowEdit(true); }}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => { setSelectedMember(member); setShowDelete(true); }}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent>
          <h3 className="text-lg font-bold mb-2">Member Details</h3>
          {selectedMember && (
            <div>
              <div><strong>Name:</strong> {selectedMember.name}</div>
              <div><strong>Email:</strong> {selectedMember.email}</div>
              <div><strong>Role:</strong> {selectedMember.role}</div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowView(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <h3 className="text-lg font-bold mb-2">Edit Member</h3>
          {editMember && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                // Simple edit: only name and email
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const role = formData.get("role") as string;
                await fetch(`/api/members/${editMember.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, role }),
                });
                setShowEdit(false);
                setEditMember(null);
                fetchMembers();
              }}
            >
              <div className="mb-2">
                <label>Name</label>
                <Input name="name" defaultValue={editMember.name} required />
              </div>
              <div className="mb-2">
                <label>Email</label>
                <Input name="email" defaultValue={editMember.email} required />
              </div>
              <div className="mb-2">
                <label>Role</label>
                <Input name="role" defaultValue={editMember.role} required />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button type="submit">Save</Button>
                <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <h3 className="text-lg font-bold mb-2">Delete Member</h3>
          {selectedMember && (
            <div>
              <p>Are you sure you want to delete <strong>{selectedMember.name}</strong>?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="destructive"
                  disabled={deleteLoading}
                  onClick={async () => {
                    setDeleteLoading(true);
                    await fetch(`/api/members/${selectedMember.id}`, {
                      method: "DELETE",
                    });
                    setDeleteLoading(false);
                    setShowDelete(false);
                    setSelectedMember(null);
                    fetchMembers();
                  }}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
                <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MembersPage;
