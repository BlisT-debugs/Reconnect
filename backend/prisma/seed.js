require('dotenv').config(); // Load the .env variables
const prisma = require('../config/prisma'); // Use our custom adapter setup

async function main() {
    console.log('Seeding database...');
// ... keep the rest of the file exactly the same

    // 1. Create the default "admin" Tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'admin' },
        update: {}, // If it exists, do nothing
        create: {
            id: 'admin',
            name: 'Main Alumni Association',
            status: 1
        },
    });

    // 2. Create the default local Domain (Replaces your Tenancy Tinker command!)
    await prisma.domain.upsert({
        where: { domain: '127.0.0.1' },
        update: {},
        create: {
            domain: '127.0.0.1',
            tenantId: 'admin',
        },
    });

    console.log('✅ Admin Tenant and 127.0.0.1 Domain created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });