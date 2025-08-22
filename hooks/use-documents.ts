import useSWR, { mutate } from "swr";
import { useState } from "react";
import { documentService } from "@/lib/documentService";
// -----------------------------
// Types
// -----------------------------
export interface Document {
  id: string;
  name: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  ownerUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentData {
  name: string;
  folderId?: string;
}

export interface CreateFolderData {
  name: string;
  ownerUserId?: string;
}

export interface UpdateDocumentData {
  name?: string;
  folderId?: string;
}

export interface UpdateFolderData {
  name?: string;
}

// -----------------------------
// Fetch single document
// -----------------------------
export function useDocument(documentId: string | null) {
  const { data, error } = useSWR<Document>(
    documentId ? `/api/documents/${documentId}` : null,
    () => documentId && documentService.getDocument(documentId)
  );

  return {
    document: data,
    isLoading: !error && !data,
    error,
    refresh: () => documentId && mutate(`/api/documents/${documentId}`),
  };
}

// -----------------------------
// Fetch folder contents
// -----------------------------
export function useFolderContents(folderId: string | null) {
  const { data, error } = useSWR<Document[]>(
    folderId ? `/api/folders/${folderId}/documents` : null,
    () => folderId && documentService.getFolderDocuments(folderId)
  );

  return {
    documents: data || [],
    isLoading: !error && !data,
    error,
    refresh: () => folderId && mutate(`/api/folders/${folderId}/documents`),
  };
}

// -----------------------------
// Document Creation
// -----------------------------
export function useDocumentCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdDocument, setCreatedDocument] = useState<Document | null>(
    null
  );

  const createDocument = async (data: CreateDocumentData) => {
    setIsCreating(true);
    setError(null);
    try {
      const doc = await documentService.createDocument(data);
      setCreatedDocument(doc);

      if (data.folderId) {
        mutate(
          `/api/folders/${data.folderId}/documents`,
          (prev: Document[] = []) => [...prev, doc],
          false
        );
      }

      return doc;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const resetCreatedDocument = () => setCreatedDocument(null);

  return { createDocument, isCreating, error, createdDocument, resetCreatedDocument };
}

// -----------------------------
// Document Update
// -----------------------------
export function useDocumentUpdate(documentId: string | null) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateDocument = async (data: UpdateDocumentData) => {
    if (!documentId) return;
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await documentService.updateDocument(documentId, data);
      mutate(`/api/documents/${documentId}`);
      if (data.folderId) {
        mutate(`/api/folders/${data.folderId}/documents`);
      }
      return updated;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateDocument, isUpdating, error };
}

// -----------------------------
// Document Delete
// -----------------------------
export function useDocumentDelete(documentId: string | null) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteDocument = async (folderId?: string) => {
    if (!documentId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await documentService.deleteDocument(documentId);
      mutate(`/api/documents/${documentId}`);
      if (folderId) {
        mutate(`/api/folders/${folderId}/documents`);
      }
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteDocument, isDeleting, error };
}

// -----------------------------
// Folder Creation
// -----------------------------
export function useFolderCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdFolder, setCreatedFolder] = useState<Folder | null>(null);

  const createFolder = async (data: CreateFolderData) => {
    setIsCreating(true);
    setError(null);
    try {
      const folder = await documentService.createFolder(data);
      setCreatedFolder(folder);

      mutate("folders", (prev: Folder[] = []) => [...prev, folder], false);
      return folder;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const resetCreatedFolder = () => setCreatedFolder(null);

  return { createFolder, isCreating, error, createdFolder, resetCreatedFolder };
}

// -----------------------------
// Folder Update
// -----------------------------
export function useFolderUpdate(folderId: string | null) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateFolder = async (data: UpdateFolderData) => {
    if (!folderId) return;
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await documentService.updateFolder(folderId, data);
      mutate(`folders`);
      return updated;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateFolder, isUpdating, error };
}

// -----------------------------
// Folder Delete
// -----------------------------
export function useFolderDelete(folderId: string | null) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteFolder = async () => {
    if (!folderId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await documentService.deleteFolder(folderId);
      mutate("folders");
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFolder, isDeleting, error };
}
