import axios from 'axios';

// Document Service API Client
// IMPORTANT: Ensure API_BASE is correct and matches your nginx config route (no typos, no duplicate CORS headers)
// If you see CORS errors, check for duplicate headers from both backend and nginx, and use only one source for CORS.
const API_BASE = process.env.NEXT_PUBLIC_DOCUMENT_SERVICE_URL || 'http://localhost:81/document-service'

export interface Document {
  id: string;
  name: string;
  title: string;
  description?: string;
  type: 'native' | 'file' | 'contract' | 'proposal' | 'invoice';
  fileId?: string;
  filename?: string;
  mimeType?: string;
  content: string;
  isTemplate: boolean;
  templateFor: string[];
  ownerUserId?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentFolderId?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentData {
  name: string;
  title: string;
  description?: string;
  type: 'native' | 'file' | 'contract' | 'proposal' | 'invoice';
  content: string;
  metadata?: Record<string, any>;
  isTemplate?: boolean;
  templateFor?: string[];
}

export interface UpdateDocumentData extends Partial<CreateDocumentData> {
  id: string;
}

export interface SignatureRequest {
  documentId: string;
  signerEmail: string;
  signerName: string;
  message?: string;
  redirectUrl?: string;
}

class DocumentService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE;
  }

  // Document CRUD operations
  async createDocument(data: CreateDocumentData): Promise<Document> {
    const response = await axios.post(`${this.baseURL}/api/v1/files/document`, data);
    return response.data;
  }

  async getDocument(id: string): Promise<Document> {
    const response = await axios.get(`${this.baseURL}/api/v1/files/${id}/info`);
    return response.data;
  }

  async updateDocument(data: UpdateDocumentData): Promise<Document> {
    const { id, ...updateData } = data;
    const response = await axios.patch(`${this.baseURL}/api/v1/files/${id}/info`, updateData);
    return response.data;
  }

  async updateDocumentContent(id: string, content: string): Promise<Document> {
    const response = await axios.patch(`${this.baseURL}/api/v1/files/${id}/content`, { content });
    return response.data;
  }

  async getDocumentContent(id: string): Promise<string> {
    const response = await axios.get(`${this.baseURL}/api/v1/files/${id}/content`);
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/api/v1/files/${id}`);
  }

  // Folder operations
  async getFolders(): Promise<Folder[]> {
    const response = await axios.get(`${this.baseURL}/api/v1/drive/folders`);
    return response.data;
  }

  async getFolderContents(folderId: string): Promise<{ folders: Folder[]; documents: Document[] }> {
    const response = await axios.get(`${this.baseURL}/api/v1/drive/folders/${folderId}/contents`);
    return response.data;
  }

  async createFolder(data: { name: string; parentFolderId?: string; metadata?: Record<string, any> }): Promise<Folder> {
    // Backend expects parentId, not parentFolderId
    const payload: any = { name: data.name };
    if (data.parentFolderId) payload.parentId = data.parentFolderId;
    if (data.metadata) payload.metadata = data.metadata;
    const response = await axios.post(`${this.baseURL}/api/drive/folders`, payload);
    return response.data;
  }

  // Contract specific operations
  async createContract(contractData: {
    title: string;
    clientName: string;
    clientEmail: string;
    contractType: string;
    startDate: string;
    endDate?: string;
    value?: string;
    description?: string;
    terms: string;
  }): Promise<Document> {
    const content = this.generateContractContent(contractData);
    
    return this.createDocument({
      name: `${contractData.title}-${Date.now()}`,
      title: contractData.title,
      description: contractData.description,
      type: 'contract',
      content,
      metadata: {
        clientName: contractData.clientName,
        clientEmail: contractData.clientEmail,
        contractType: contractData.contractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        value: contractData.value,
        status: 'draft'
      }
    });
  }

  async createProposal(proposalData: {
    title: string;
    clientName: string;
    clientEmail: string;
    projectDescription: string;
    scope: string;
    timeline: string;
    budget: string;
    terms: string;
  }): Promise<Document> {
    const content = this.generateProposalContent(proposalData);
    
    return this.createDocument({
      name: `${proposalData.title}-${Date.now()}`,
      title: proposalData.title,
      type: 'proposal',
      content,
      metadata: {
        clientName: proposalData.clientName,
        clientEmail: proposalData.clientEmail,
        projectDescription: proposalData.projectDescription,
        timeline: proposalData.timeline,
        budget: proposalData.budget,
        status: 'draft'
      }
    });
  }

  async createInvoice(invoiceData: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    dueDate: string;
    items: Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
  }): Promise<Document> {
    const content = this.generateInvoiceContent(invoiceData);
    
    return this.createDocument({
      name: `Invoice-${invoiceData.invoiceNumber}`,
      title: `Invoice ${invoiceData.invoiceNumber}`,
      type: 'invoice',
      content,
      metadata: {
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        dueDate: invoiceData.dueDate,
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        total: invoiceData.total,
        status: 'draft'
      }
    });
  }

  // DocuSign integration
  async sendForSignature(signatureRequest: SignatureRequest): Promise<{ envelopeId: string; signingUrl: string }> {
    const response = await axios.post(`${this.baseURL}/api/v1/docusign/send`, signatureRequest);
    return response.data;
  }

  async getSignatureStatus(envelopeId: string): Promise<{ status: string; documents: any[] }> {
    const response = await axios.get(`${this.baseURL}/api/v1/docusign/status/${envelopeId}`);
    return response.data;
  }

  async downloadSignedDocument(envelopeId: string, documentId: string): Promise<Blob> {
    const response = await axios.get(
      `${this.baseURL}/api/v1/docusign/download/${envelopeId}/${documentId}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Template operations
  async getTemplates(templateFor?: string): Promise<Document[]> {
    const response = await axios.get(`${this.baseURL}/api/v1/templates`, {
      params: templateFor ? { templateFor } : {}
    });
    return response.data;
  }

  async createTemplate(templateData: CreateDocumentData & { templateFor: string[] }): Promise<Document> {
    return this.createDocument({
      ...templateData,
      isTemplate: true
    });
  }

  // Utility methods for generating document content
  private generateContractContent(data: any): string {
    return `
# ${data.title}

**Client:** ${data.clientName}
**Contract Type:** ${data.contractType}
**Start Date:** ${data.startDate}
${data.endDate ? `**End Date:** ${data.endDate}` : ''}
${data.value ? `**Value:** ${data.value}` : ''}

## Description
${data.description || 'No description provided.'}

## Terms and Conditions
${data.terms}

---
*This contract is generated automatically and requires review before signing.*
`;
  }

  private generateProposalContent(data: any): string {
    return `
# ${data.title}

**Client:** ${data.clientName}
**Project Timeline:** ${data.timeline}
**Estimated Budget:** ${data.budget}

## Project Description
${data.projectDescription}

## Scope of Work
${data.scope}

## Terms and Conditions
${data.terms}

---
*This proposal is valid for 30 days from the date of submission.*
`;
  }

  private generateInvoiceContent(data: any): string {
    const itemsHtml = data.items.map((item: any) => 
      `| ${item.description} | ${item.quantity} | $${item.rate} | $${item.amount} |`
    ).join('\n');

    return `
# Invoice ${data.invoiceNumber}

**Bill To:** ${data.clientName}
**Due Date:** ${data.dueDate}

## Items

| Description | Quantity | Rate | Amount |
|-------------|----------|------|--------|
${itemsHtml}

**Subtotal:** $${data.subtotal}
**Tax:** $${data.tax}
**Total:** $${data.total}

---
*Payment is due by the specified due date.*
`;
  }
}

export const documentService = new DocumentService();
