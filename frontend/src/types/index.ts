export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  domain: string;
  picture?: string;
}

export interface Attachment {
  url: string;
  fileType: string;
  originalName: string;
}

export interface CheckIn {
  _id: string;
  userId: string | User;
  moodLevel: number;
  message?: string;
  anonymous: boolean;
  status: 'open' | 'reviewed';
  counselorNote?: string;
  domain: string;
  reviewedBy?: string | User;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportRequest {
  _id: string;
  studentId: string | User;
  subject: string;
  message: string;
  anonymous: boolean;
  status: 'pending' | 'responded';
  counselorId?: string | User;
  counselorReply?: string;
  respondedAt?: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
}
