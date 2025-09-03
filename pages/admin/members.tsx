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
      <div className="flex-1 p-8 pt-6 min-h-screen">
        <div className="mb-6 flex justify-end">
          <Button variant="default" className="text-white font-semibold shadow" onClick={() => setShowCreate(true)}>
            + Create Member
          </Button>
        </div>
        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="bg-blue-800 text-white border-blue-700">
            <h3 className="text-xl font-bold mb-4 text-white">Create Member</h3>
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
              <div className="mb-4">
                <label className="block text-white mb-1">Name</label>
                <Input name="name" required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-1">Email</label>
                <Input name="email" type="email" required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-1">Role</label>
                <Input name="role" required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-1">Password</label>
                <Input name="password" type="password" required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="submit" disabled={createLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  {createLoading ? "Creating..." : "Create"}
                </Button>
                <Button variant="outline" className="border-blue-700 text-white" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Card className="border-none shadow-lg rounded-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white">Team Members</h2>
            <p className="text-sm text-white">
              Manage your team members (admins, designers, videographers, ghl admins).
            </p>
          </CardHeader>
          <CardContent> 
            {loading ? (
                <div className="flex items-center justify-center py-12 ">
                <svg className="animate-spin h-6 w-6 text-blue-400 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-white text-lg font-medium">Loading members...</span>
                </div>
            ) : (
              <table className="min-w-full rounded overflow-hidden  text-white">
                <thead>
                  <tr className="bg-blue-800">
                    <th className="px-4 py-3 text-left font-semibold text-white">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-white">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-white">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-blue-800 hover:bg-blue-900 bg-gradient transition">
                      <td className="px-4 py-3 font-medium">{member.name}</td>
                      <td className="px-4 py-3">{member.email}</td>
                      <td className="px-4 py-3">{member.role}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button size="sm" variant="outline" className="border-blue-700 text-white" onClick={() => { setSelectedMember(member); setShowView(true); }}>View</Button>
                        <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={() => { setEditMember(member); setShowEdit(true); }}>Edit</Button>
                        <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-semibold" onClick={() => { setSelectedMember(member); setShowDelete(true); }}>Delete</Button>
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
        <DialogContent className="bg-blue-950 text-white border-blue-700">
          <h3 className="text-xl font-bold mb-4 text-blue-300">Member Details</h3>
          {selectedMember && (
            <div className="space-y-2">
              <div><span className="font-semibold text-blue-200">Name:</span> {selectedMember.name}</div>
              <div><span className="font-semibold text-blue-200">Email:</span> {selectedMember.email}</div>
              <div><span className="font-semibold text-blue-200">Role:</span> {selectedMember.role}</div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button className="border-blue-700 text-blue-300" onClick={() => setShowView(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-blue-950 text-white border-blue-700">
          <h3 className="text-xl font-bold mb-4 text-blue-300">Edit Member</h3>
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
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Name</label>
                <Input name="name" defaultValue={editMember.name} required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Email</label>
                <Input name="email" defaultValue={editMember.email} required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Role</label>
                <Input name="role" defaultValue={editMember.role} required className="bg-blue-900 text-white border-blue-700" />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Save</Button>
                <Button variant="outline" className="border-blue-700 text-blue-300" onClick={() => setShowEdit(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="bg-blue-950 text-white border-blue-700">
          <h3 className="text-xl font-bold mb-4 text-blue-300">Delete Member</h3>
          {selectedMember && (
            <div>
              <p className="mb-4">Are you sure you want to delete <span className="font-semibold text-blue-200">{selectedMember.name}</span>?</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
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
                <Button variant="outline" className="border-blue-700 text-blue-300" onClick={() => setShowDelete(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MembersPage;
