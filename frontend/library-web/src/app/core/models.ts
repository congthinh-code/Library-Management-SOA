
export interface NguoiDung {
  userId: string;
  username: string;
  email?: string | null;
  roles: string[];
}

export interface TaiKhoan {
  userId: string;
  username: string;
  email: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocGiaData {
  readerId: number;
  readerCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  readerType: 'STUDENT' | 'LECTURER';
  cardStatus: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  userId?: number | null;
}
