import { BloodGroup, Role, MemberType } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                password?: string | null;
                phone: string | null;
                village: string;
                image: string | null;
                designation: string | null;
                bloodGroup: BloodGroup | null;
                role: Role;
                memberType?: MemberType;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nid?: string | null;
                donorId?: string | null;
            };
        }
    }
}