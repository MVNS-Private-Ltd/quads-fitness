-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "planId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Program" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT,
    "duration" TEXT,
    "schedule" TEXT,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "billing" TEXT NOT NULL DEFAULT 'month',
    "description" TEXT,
    "features" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "instagram" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DietPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "goalType" TEXT,
    "calories" TEXT,
    "meals" INTEGER NOT NULL DEFAULT 3,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientName" TEXT NOT NULL,
    "transformation" TEXT,
    "quote" TEXT NOT NULL,
    "imageUrl" TEXT,
    "beforeImageUrl" TEXT,
    "afterImageUrl" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'Published',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Published',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "badgeText" TEXT,
    "validUntil" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Unread',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeIn" TEXT,
    "timeOut" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Present',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "gymName" TEXT NOT NULL DEFAULT 'Quads Fitness',
    "tagline" TEXT NOT NULL DEFAULT 'Train Hard. Live Strong.',
    "email" TEXT NOT NULL DEFAULT 'hello@quadsfitness.com',
    "phone" TEXT NOT NULL DEFAULT '+1 (555) 123-4567',
    "address" TEXT NOT NULL DEFAULT '123 Iron Street, Muscle City, MC 90210',
    "instagram" TEXT NOT NULL DEFAULT '',
    "facebook" TEXT NOT NULL DEFAULT '',
    "twitter" TEXT NOT NULL DEFAULT '',
    "youtube" TEXT NOT NULL DEFAULT '',
    "mondayHours" TEXT NOT NULL DEFAULT '05:00 - 23:00',
    "tuesdayHours" TEXT NOT NULL DEFAULT '05:00 - 23:00',
    "wednesdayHours" TEXT NOT NULL DEFAULT '05:00 - 23:00',
    "thursdayHours" TEXT NOT NULL DEFAULT '05:00 - 23:00',
    "fridayHours" TEXT NOT NULL DEFAULT '05:00 - 23:00',
    "saturdayHours" TEXT NOT NULL DEFAULT '05:00 - 22:00',
    "sundayHours" TEXT NOT NULL DEFAULT '07:00 - 20:00',
    "primaryColor" TEXT NOT NULL DEFAULT '#d4af37',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT 'Quads Fitness - Train Hard. Live Strong.',
    "metaDescription" TEXT NOT NULL DEFAULT 'Premium fitness center offering elite training programs, nutrition coaching, and a supportive community.',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "entity" TEXT,
    "entityId" INTEGER,
    "user" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
