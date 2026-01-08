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
      phone: '+91-9876543210',
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
      phone: '+91-9876543211',
      role: 'OWNER'
    }
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@apartment.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+91-9876543212',
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
      phone: '+91-9876543213',
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
      phone: '+91-9876543214',
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
      phone: '+91-9876543215',
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
      monthlyRent: 25000.00,
      securityDeposit: 50000.00,
      flatId: flat1.id,
      tenantId: tenant1.id
    }
  });

  // Create sample bills
  await prisma.bill.create({
    data: {
      billType: 'RENT',
      amount: 25000.00,
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
      amount: 1500.00,
      dueDate: new Date('2024-02-01'),
      status: 'DUE',
      description: 'Monthly maintenance charges',
      flatId: flat1.id,
      userId: owner1.id
    }
  });

  // Create sample notices
  await prisma.notice.create({
    data: {
      title: 'Welcome to Apartment Management System',
      content: 'This is a sample notice for all residents. Please check the notice board regularly for updates.',
      isPinned: true,
      targetRoles: 'OWNER,TENANT',
      authorId: secretary.id
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Monthly Maintenance Schedule',
      content: 'Dear Residents, The monthly maintenance work will be carried out on the 15th of every month from 9 AM to 5 PM. This includes elevator servicing, water tank cleaning, and common area maintenance. Please plan accordingly.',
      isPinned: false,
      targetRoles: 'OWNER,TENANT',
      authorId: secretary.id
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Security Guidelines',
      content: 'For the safety of all residents, please ensure that you do not share the main gate access code with unauthorized persons. All visitors must be registered at the security desk. Emergency contact: +91-9876543200',
      isPinned: true,
      targetRoles: 'OWNER,TENANT,GUARD',
      authorId: secretary.id
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Parking Rules Update',
      content: 'New parking rules are now in effect. Each flat is allocated one parking space. Visitor parking is available on a first-come, first-served basis. Unauthorized vehicles will be towed at owner\'s expense.',
      isPinned: false,
      targetRoles: 'OWNER,TENANT',
      authorId: secretary.id
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Staff Holiday Schedule',
      content: 'Please note that maintenance staff will be on holiday from December 25th to January 2nd. For emergency maintenance issues during this period, please contact the secretary office.',
      isPinned: false,
      targetRoles: 'STAFF',
      authorId: secretary.id
    }
  });

  // Create sample issues
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

  await prisma.issue.create({
    data: {
      title: 'Water Leakage in Common Area',
      description: 'There is water leakage near the main entrance. The floor is slippery and poses a safety risk.',
      category: 'Plumbing',
      priority: 'URGENT',
      status: 'OPEN',
      reporterId: owner1.id
    }
  });

  await prisma.issue.create({
    data: {
      title: 'Parking Light Not Working',
      description: 'The light in parking slot P-15 is not working. It\'s difficult to park in the evening.',
      category: 'Electrical',
      priority: 'MEDIUM',
      status: 'OPEN',
      reporterId: owner2.id,
      resolution: 'Light bulb replaced and tested'
    }
  });

  await prisma.issue.create({
    data: {
      title: 'Noise Complaint',
      description: 'Loud music from flat A102 during night hours. Please address this issue.',
      category: 'Noise',
      priority: 'LOW',
      status: 'OPEN',
      reporterId: tenant1.id
    }
  });

  // Create sample visitor logs
  await prisma.visitorLog.create({
    data: {
      visitorName: 'Rahul Sharma',
      visitorPhone: '+91-9876543220',
      purpose: 'Family Visit',
      inTime: new Date('2024-02-01T14:15:00'),
      outTime: new Date('2024-02-01T18:30:00'),
      isApproved: true,
      flatId: flat1.id,
      guardId: guard.id
    }
  });

  await prisma.visitorLog.create({
    data: {
      visitorName: 'Priya Patel',
      visitorPhone: '+91-9876543221',
      purpose: 'Delivery',
      isApproved: null,
      flatId: flat2.id,
      guardId: guard.id
    }
  });

  await prisma.visitorLog.create({
    data: {
      visitorName: 'Amit Kumar',
      visitorPhone: '+91-9876543222',
      purpose: 'Maintenance Work',
      inTime: new Date('2024-02-02T09:10:00'),
      isApproved: true,
      flatId: flat1.id,
      guardId: guard.id
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