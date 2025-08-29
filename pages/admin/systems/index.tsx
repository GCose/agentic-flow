import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const AdminSystemsPage = () => {
  const [systems, setSystems] = useState<string[]>([]);
  const [newSystem, setNewSystem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteSystemName, setDeleteSystemName] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchSystems = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/systems");
        const data = await res.json();
        setSystems(data.map((sys: any) => sys.name));
      } catch {
        setFeedback("Failed to fetch systems.");
      }
      setLoading(false);
    };
    fetchSystems();
  }, []);

  const handleCreateSystem = async () => {
    if (!newSystem.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSystem.trim() }),
      });
      if (res.ok) {
        setSystems((prev) => [...prev, newSystem.trim()]);
        setNewSystem("");
        setIsModalOpen(false);
        setFeedback(null);
      } else {
        setFeedback("Failed to create system.");
      }
    } catch {
      setFeedback("Failed to create system.");
    }
    setLoading(false);
  };

  const handleDeleteSystem = async (systemName: string) => {
    setDeleteLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/systems`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: systemName }),
      });
      if (res.ok) {
        // Refresh systems list from backend after deletion
        const refreshed = await fetch("/api/systems");
        const data = await refreshed.json();
        setSystems(data.map((sys: any) => sys.name));
        setFeedback(`System '${systemName}' deleted.`);
        setDeleteSystemName(null);
      } else {
        let errorMsg = "Failed to delete system.";
        try {
          const err = await res.json();
          if (err && err.error) errorMsg = err.error;
        } catch {}
        setFeedback(errorMsg);
      }
    } catch (err) {
      setFeedback("Failed to delete system.");
      console.error(err);
    }
    setDeleteLoading(false);
  };

  return (
    <DashboardLayout meta={AdminPageMeta.systemsDashboardPage}>
      <DashboardHeader title="Manage Systems" role="admin" />
      <div className="flex-1 p-4 py-2">
        <Card className="border border-blue-900/70 rounded-xl shadow-sm ">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-900/20 pb-4">
            <h2 className="font-semibold text-lg text-white">Systems</h2>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto bg-blue-900 text-white hover:bg-blue-800">Add System</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New System</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">System Name</Label>
                    <Input
                      id="system-name"
                      placeholder="Enter system name"
                      value={newSystem}
                      onChange={(e) => setNewSystem(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSystem} disabled={loading} className="bg-blue-900 text-white hover:bg-blue-800">
                    Add System
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {feedback && (
              <div className={`mb-4 font-medium ${feedback.includes('deleted') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>
            )}
            <Table className="rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-blue-900/10">
                  <TableHead className="font-semibold text-white">System Name</TableHead>
                  <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : systems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">No systems found.</TableCell>
                  </TableRow>
                ) : (
                  systems.map((system) => (
                    <TableRow key={system}>
                      <TableCell className="font-medium text-white">{system}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => setDeleteSystemName(system)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Dialog open={!!deleteSystemName} onOpenChange={(open) => !open && setDeleteSystemName(null)}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-red-700">Delete System</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  Are you sure you want to delete <span className="font-bold text-red-700">{deleteSystemName}</span>? This action cannot be undone.
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteSystemName(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDeleteSystem(deleteSystemName!)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSystemsPage;
