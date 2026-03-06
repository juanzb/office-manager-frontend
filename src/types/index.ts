import { Role, Permission } from './enums';

export interface Area {
  id: number;
  name: string;
  code: string;
}

export interface Contract {
  id: number;
  name: string;
  code: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
  areaId?: number;
  contractId?: number;
  area?: Area;
  contract?: Contract;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  image?: string;
  isAvailable: boolean;
  reference: string;
  serial: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: number;
  user: User;
  tool: Tool;
  loanDate: string;
  returnDate?: string;
  status: 'active' | 'returned';
}

export interface LoanHistory {
  id: number;
  loanId: number;
  action: string;
  comment?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}
