const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Secretary user
  const secretary = await prisma.user.create({
    data: {
      email: 'secretary@apartment.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Secretary',
      phone: '+1234567890',
      role: 'SECRETARY'
    }
  });

  // Create Owner users
  const owner1 = await prisma.user.create({
    data: {
      email: 'owner1@apartment.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1234567891',
      role: 'OWNER'
    }
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@apartment.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567892',
      role: 'OWNER'
    }
  });

  // Create Tenant users
  const tenant1 = await prisma.user.create({
    data: {
      email: 'tenant1@apartment.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Davis',
      phone: '+1234567893',
      role: 'TENANT'
    }
  });

  // Create Staff user
  const staff = await prisma.user.create({
    data: {
      email: 'staff@apartment.com',
      password: hashedPassword,
      firstName: 'Tom',
      lastName: 'Wilson',
      phone: '+1234567894',
      role: 'STAFF'
    }
  });

  // Create Guard user
  const guard = await prisma.user.create({
    data: {
      email: 'guard@apartment.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Brown',
      phone: '+1234567895',
      role: 'GUARD'
    }
  });

  // Create Flats
  const flat1 = await prisma.flat.create({
    data: {
      flatNumber: 'A101',
      floor: 1,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200.5,
      occupancyStatus: 'TENANT_OCCUPIED',
      ownerId: owner1.id
    }
  });

  const flat2 = await prisma.flat.create({
    data: {
      flatNumber: 'A102',
      floor: 1,
      bedrooms: 3,
      bathrooms: 2,
      area: 1500.0,
      occupancyStatus: 'OWNER_OCCUPIED',
      ownerId: owner2.id
    }
  });

  // Create Lease for flat1
  const lease1 = await prisma.lease.create({
    data: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      monthlyRent: 2500.00,
      securityDeposit: 5000.00,
      flatId: flat1.id,
      tenantId: tenant1.id
    }
  });

  // Create sample bills
  await prisma.bill.create({
    data: {
      billType: 'RENT',
      amount: 2500.00,
      dueDate: new Date('2024-02-01'),
      status: 'DUE',
      description: 'Monthly rent for January 2024',
      flatId: flat1.id,
      userId: tenant1.id
    }
  });

  await prisma.bill.create({
    data: {
      billType: 'MAINTENANCE',
      amount: 150.00,
      dueDate: new Date('2024-02-01'),
      status: 'DUE',
      description: 'Monthly maintenance charges',
      flatId: flat1.id,
      userId: owner1.id
    }
  });

  // Create sample notice
  await prisma.notice.create({
    data: {
      title: 'Welcome to Apartment Management System',
      content: 'This is a sample notice for all residents. Please check the notice board regularly for updates.',
      isPinned: true,
      targetRoles: 'OWNER,TENANT',
      authorId: secretary.id
    }
  });

  // Create sample issue
  await prisma.issue.create({
    data: {
      title: 'Elevator Maintenance Required',
      description: 'The elevator in Block A is making unusual noises and needs maintenance.',
      category: 'Maintenance',
      priority: 'HIGH',
      status: 'OPEN',
      reporterId: tenant1.id
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Login credentials:');
  console.log('   Secretary: secretary@apartment.com / password123');
  console.log('   Owner 1: owner1@apartment.com / password123');
  console.log('   Owner 2: owner2@apartment.com / password123');
  console.log('   Tenant: tenant1@apartment.com / password123');
  console.log('   Staff: staff@apartment.com / password123');
  console.log('   Guard: guard@apartment.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });