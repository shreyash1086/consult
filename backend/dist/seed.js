import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from './config/db';
async function main() {
    const adminEmail = 'admin@consult.com';
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Platform Admin',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });
    console.log('Seed: Created Admin user:', admin.email);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
