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
      <div className="flex-1 p-8 pt-6 min-h-screen ">
        <Card className="border-none shadow-lg rounded-xl">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-800 pb-4">
            <h2 className="font-bold text-2xl text-white">Systems</h2>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full md:w-auto text-white font-semibold shadow hover:bg-blue-800">+ Add System</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-blue-900 text-white border-blue-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New System</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name" className="text-white">System Name</Label>
                    <Input
                      id="system-name"
                      placeholder="Enter system name"
                      value={newSystem}
                      onChange={(e) => setNewSystem(e.target.value)}
                      className="bg-blue-900 text-white border-blue-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-blue-700 text-white" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSystem} disabled={loading} className="bg-blue-700 text-white font-semibold shadow hover:bg-blue-800">
                    Add System
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {feedback && (
              <div className={`mb-4 font-medium ${feedback.includes('deleted') ? 'text-green-400' : 'text-red-400'}`}>{feedback}</div>
            )}
            <Table className="rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-blue-800">
                  <TableHead className="font-bold text-white py-3">System Name</TableHead>
                  <TableHead className="font-bold text-white py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-white">Loading...</TableCell>
                  </TableRow>
                ) : systems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-white">No systems found.</TableCell>
                  </TableRow>
                ) : (
                  systems.map((system) => (
                    <TableRow key={system} className="hover:bg-blue-900/40 transition-all">
                      <TableCell className="font-medium text-blue-100 py-3">{system}</TableCell>
                      <TableCell className="text-right py-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 text-white font-semibold shadow hover:bg-red-700"
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
              <DialogContent className="sm:max-w-[400px] bg-blue-950 text-white border-blue-700">
                <DialogHeader>
                  <DialogTitle className="text-red-400">Delete System</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  Are you sure you want to delete <span className="font-bold text-red-400">{deleteSystemName}</span>? This action cannot be undone.
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-blue-700 text-white" onClick={() => setDeleteSystemName(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 text-white font-semibold shadow hover:bg-red-700"
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
