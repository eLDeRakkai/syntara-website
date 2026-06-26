import { User } from '@/shared/types/user';

export class UserModel implements User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.createdAt;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  maskEmail(): string {
    const [local, domain] = this.email.split('@');
    if (!local || !domain) return this.email;
    if (local.length <= 2) {
      return `***@${domain}`;
    }
    return `${local.substring(0, 2)}***@${domain}`;
  }
}
