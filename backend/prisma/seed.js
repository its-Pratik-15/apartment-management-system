const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  console.log('Clearing existing data...');

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.visitorLog.deleteMany({});
  await prisma.issue.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.bill.deleteMany({});
  await prisma.lease.deleteMany({});
  await prisma.flat.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Previous data cleared successfully!');
  console.log('Creating fresh data with current dates...');

  // Get current date for realistic data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate dates for realistic scenarios
  const thisMonthStart = new Date(currentYear, currentMonth, 1);
  const thisMonthEnd = new Date(currentYear, currentMonth + 1, 0);
  const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
  const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const leaseEndDate = new Date(currentYear + 1, currentMonth, thisMonthEnd.getDate());
  
  // Recent dates for activity
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

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

  // Create active lease with current dates
  const lease1 = await prisma.lease.create({
    data: {
      startDate: thisMonthStart,
      endDate: leaseEndDate,
      monthlyRent: 25000.00,
      securityDeposit: 50000.00,
      flatId: flat1.id,
      tenantId: tenant1.id
    }
  });

  // Create current month bills with realistic due dates
  await prisma.bill.create({
    data: {
      billType: 'RENT',
      amount: 25000.00,
      dueDate: new Date(currentYear, currentMonth, 5), // Due 5th of current month
      status: 'DUE',
      description: `Monthly rent for ${thisMonthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      flatId: flat1.id,
      userId: tenant1.id,
      createdAt: thisMonthStart
    }
  });

  await prisma.bill.create({
    data: {
      billType: 'MAINTENANCE',
      amount: 1500.00,
      dueDate: new Date(currentYear, currentMonth, 10), // Due 10th of current month
      status: 'PAID',
      description: 'Monthly maintenance charges',
      flatId: flat1.id,
      userId: owner1.id,
      createdAt: thisMonthStart,
      paidDate: twoDaysAgo
    }
  });

  // Create overdue bill from last month
  await prisma.bill.create({
    data: {
      billType: 'ELECTRICITY',
      amount: 3200.00,
      dueDate: new Date(currentYear, currentMonth - 1, 15),
      status: 'OVERDUE',
      description: 'Electricity and water charges',
      flatId: flat2.id,
      userId: owner2.id,
      createdAt: lastMonthStart
    }
  });

  // Create recent notices with current dates
  await prisma.notice.create({
    data: {
      title: 'Welcome to Apartment Management System',
      content: 'This is a sample notice for all residents. Please check the notice board regularly for updates.',
      isPinned: true,
      targetRoles: ['OWNER', 'TENANT'],
      authorId: secretary.id,
      createdAt: oneWeekAgo
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Security Guidelines',
      content: 'For the safety of all residents, please ensure that you do not share the main gate access code with unauthorized persons. All visitors must be registered at the security desk. Emergency contact: +91-9876543200',
      isPinned: true,
      targetRoles: ['OWNER', 'TENANT', 'GUARD'],
      authorId: secretary.id,
      createdAt: threeDaysAgo
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Staff Holiday Schedule',
      content: 'Please note that maintenance staff will be on holiday from December 25th to January 2nd. For emergency maintenance issues during this period, please contact the secretary office.',
      isPinned: false,
      targetRoles: ['STAFF'],
      authorId: secretary.id,
      createdAt: yesterday
    }
  });

  // Create recent issues with current dates
  await prisma.issue.create({
    data: {
      title: 'Parking Light Not Working',
      description: 'The light in parking slot P-15 is not working. It\'s difficult to park in the evening.',
      category: 'Electrical',
      priority: 'MEDIUM',
      status: 'OPEN',
      reporterId: tenant1.id,
      createdAt: yesterday
    }
  });

  await prisma.issue.create({
    data: {
      title: 'Water Leakage in Common Area',
      description: 'There is water leakage near the main entrance. The floor is slippery and poses a safety risk.',
      category: 'Plumbing',
      priority: 'URGENT',
      status: 'OPEN',
      reporterId: owner1.id,
      createdAt: twoDaysAgo
    }
  });

  await prisma.issue.create({
    data: {
      title: 'Elevator Maintenance Required',
      description: 'The elevator in Block A is making unusual noises and needs maintenance.',
      category: 'Maintenance',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      reporterId: owner2.id,
      createdAt: threeDaysAgo
    }
  });

  await prisma.issue.create({
    data: {
      title: 'Gym Equipment Repair',
      description: 'Treadmill in the gym is not working properly. Display shows error code.',
      category: 'Maintenance',
      priority: 'LOW',
      status: 'RESOLVED',
      reporterId: tenant1.id,
      createdAt: oneWeekAgo,
      resolution: 'Treadmill serviced and calibrated. Working normally now.'
    }
  });

  // Create recent visitor logs with current dates
  await prisma.visitorLog.create({
    data: {
      visitorName: 'Rahul Sharma',
      visitorPhone: '+91-9876543220',
      purpose: 'Family Visit',
      inTime: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000), // 2 PM yesterday
      outTime: new Date(yesterday.getTime() + 18.5 * 60 * 60 * 1000), // 6:30 PM yesterday
      isApproved: true,
      flatId: flat1.id,
      guardId: guard.id,
      createdAt: new Date(yesterday.getTime() + 13.5 * 60 * 60 * 1000) // 1:30 PM yesterday
    }
  });

  await prisma.visitorLog.create({
    data: {
      visitorName: 'Priya Patel',
      visitorPhone: '+91-9876543221',
      purpose: 'Delivery',
      isApproved: null, // Pending approval
      flatId: flat2.id,
      guardId: guard.id,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  });

  await prisma.visitorLog.create({
    data: {
      visitorName: 'Amit Kumar',
      visitorPhone: '+91-9876543222',
      purpose: 'Maintenance Work',
      inTime: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      isApproved: true,
      flatId: flat1.id,
      guardId: guard.id,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
    }
  });

  // Create a visitor currently inside (checked in but not out)
  await prisma.visitorLog.create({
    data: {
      visitorName: 'Neha Singh',
      visitorPhone: '+91-9876543223',
      purpose: 'Business Meeting',
      inTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      isApproved: true,
      flatId: flat2.id,
      guardId: guard.id,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  });

  console.log('Database seeded successfully with current dates!');
  console.log('Data created for:', now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));
  console.log('Login credentials:');
  console.log('   Secretary: secretary@apartment.com / password123');
  console.log('   Owner 1: owner1@apartment.com / password123');
  console.log('   Owner 2: owner2@apartment.com / password123');
  console.log('   Tenant: tenant1@apartment.com / password123');
  console.log('   Staff: staff@apartment.com / password123');
  console.log('   Guard: guard@apartment.com / password123');
  console.log('');
  console.log('Perfect for interview demonstration!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });