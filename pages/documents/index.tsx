"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FolderPlus,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  File,
  Folder,
  Download,
  Share,
  Trash2,
  Edit,
  FileSignature,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import {
  useDocuments,
  useDocumentCreation,
  useFolderCreation,
} from "@/hooks/use-documents";
import { loggedInUser } from "@/utils/auth";

function DocumentDriveContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("My Documents");

  const {
    folders,
    folderContents,
    currentFolderId,
    setCurrentFolderId,
    isLoading,
    error,
    refreshFolders,
    refreshContents,
  } = useDocuments();

  const {
    createDocument,
    isCreating,
    error: creationError,
    createdDocument,
    resetCreatedDocument,
  } = useDocumentCreation();

  const {
    createFolder,
    isCreating: isCreatingFolder,
    error: folderError,
    createdFolder,
    resetCreatedFolder,
  } = useFolderCreation();

  const user = loggedInUser();

  // New Folder logic
  const handleNewFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;
    try {
      await createFolder({ name: folderName, ownerUserId: user?.id });
    } catch {
      /* handled by hook */
    }
  };

  // New Document logic
  const handleNewDocument = async () => {
    const docName = prompt("Enter document title:");
    if (!docName) return;
    try {
      await createDocument({
        name: docName,
        title: docName,
        type: "native",
        content: "",
        metadata: {},
        ownerUserId: user?.id,
        folderId: currentFolderId || folders[0]?.id,
      });
    } catch {
      /* handled by hook */
    }
  };

  // Combine folders and documents
  const displayItems = [
    ...(folders || []).map((folder) => ({
      id: folder.id,
      name: folder.name,
      type: "folder" as const,
      modified: new Date(folder.updatedAt).toLocaleDateString(),
    })),
    ...(folderContents?.documents || []).map((doc) => ({
      id: doc.id,
      name: doc.title || doc.name,
      type: doc.type,
      size: doc.metadata?.size || "N/A",
      modified: new Date(doc.updatedAt).toLocaleDateString(),
      status: doc.metadata?.status || undefined,
    })),
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-8 w-8 text-blue-500" />;
      case "contract":
        return <FileSignature className="h-8 w-8 text-green-500" />;
      case "proposal":
        return <FileText className="h-8 w-8 text-purple-500" />;
      case "invoice":
        return <File className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      signed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return (
      <Badge
        className={
          colors[status as keyof typeof colors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentPath(folderName);
    refreshContents();
  };

  const filteredItems = displayItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick Stats
  const allDocs = folderContents?.documents || [];
  const totalDocs = allDocs.length;
  const pendingSignatures = allDocs.filter(
    (d) => d.metadata?.status === "pending"
  ).length;
  const completedThisMonth = allDocs.filter((d) => {
    const updated = new Date(d.updatedAt);
    const now = new Date();
    return (
      d.metadata?.status === "completed" &&
      updated.getMonth() === now.getMonth() &&
      updated.getFullYear() === now.getFullYear()
    );
  }).length;
  const totalStorage =
    allDocs.reduce(
      (sum, d) => sum + (parseFloat(d.metadata?.size) || 0),
      0
    ) / 1024 ** 2; // assuming size in bytes → MB

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">
            Error loading documents: {error.message}
          </p>
          <Button
            onClick={refreshFolders}
            className="mt-2"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">
              Document Drive
            </h1>
            <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
              / {currentPath}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-input border-border focus:bg-background transition-colors text-foreground"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-accent hover:text-accent-foreground"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-4 flex-shrink-0">
          <div className="space-y-2 mb-6">
            <Button
              className="w-full justify-start bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 text-white"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload Files
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={handleNewFolder}
              disabled={isCreatingFolder}
            >
              <FolderPlus className="h-4 w-4 mr-2" /> New Folder
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={handleNewDocument}
              disabled={isCreating}
            >
              <File className="h-4 w-4 mr-2" /> New Document
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-1">
                <Link href="/documents/contract/new">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <FileSignature className="h-4 w-4 mr-2" /> New Contract
                  </Button>
                </Link>
                <Link href="/documents/proposal/new">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <FileText className="h-4 w-4 mr-2" /> New Proposal
                  </Button>
                </Link>
                <Link href="/documents/invoice/new">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <File className="h-4 w-4 mr-2" /> New Invoice
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent (dynamic) */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Recent</h3>
              <div className="space-y-1">
                {allDocs
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .slice(0, 3)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="text-xs text-muted-foreground p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      {doc.title || doc.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-background/50">
          {/* File Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg cursor-pointer"
                onClick={() =>
                  item.type === "folder"
                    ? handleFolderClick(item.id, item.name)
                    : null
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    {getFileIcon(item.type)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        {item.type === "contract" && (
                          <DropdownMenuItem>
                            <FileSignature className="h-4 w-4 mr-2" /> Send for
                            Signature
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.modified}</span>
                      {item.type !== "folder" && item.size && (
                        <span>{item.size}</span>
                      )}
                    </div>
                    {item.type !== "folder" && item.status && (
                      <div>{getStatusBadge(item.status)}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first document"}
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDocs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Signatures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingSignatures}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedThisMonth}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Storage Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalStorage.toFixed(2)} MB
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DocumentDrive() {
  return (
    <RoleBasedRoute
      allowedRoles={[
        "Administrator",
        "Organization",
        "Videographer",
        "Designer",
        "HR",
      ]}
    >
      <DashboardLayout
        meta={{
          title: "Document Drive",
          description:
            "Manage and organize your documents, contracts, and proposals",
        }}
        allowedRoles={[
          "Administrator",
          "Organization",
          "Videographer",
          "Designer",
          "HR",
        ]}
      >
        <DocumentDriveContent />
      </DashboardLayout>
    </RoleBasedRoute>
  );
}
import Head from "next/head";