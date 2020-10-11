# Migration `20201011185436-lp1`

This migration has been generated at 10/11/2020, 6:54:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."operations" AS ENUM ('add', 'divide', 'random', 'root', 'subtract', 'times', 'equation')

CREATE TABLE "public"."accounts" (
"id" SERIAL,
"compound_id" text   NOT NULL ,
"user_id" integer   NOT NULL ,
"provider_type" text   NOT NULL ,
"provider_id" text   NOT NULL ,
"provider_account_id" text   NOT NULL ,
"refresh_token" text   ,
"access_token" text   ,
"access_token_expires" timestamp(3)   ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."sessions" (
"id" SERIAL,
"user_id" integer   NOT NULL ,
"expires" timestamp(3)   NOT NULL ,
"session_token" text   NOT NULL ,
"access_token" text   NOT NULL ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."users" (
"id" SERIAL,
"name" text   ,
"email" text   ,
"email_verified" timestamp(3)   ,
"image" text   ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."verification_requests" (
"id" SERIAL,
"identifier" text   NOT NULL ,
"token" text   NOT NULL ,
"expires" timestamp(3)   NOT NULL ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."balance" (
"id" SERIAL,
"balance" Decimal(65,30)   DEFAULT 0,
"created_at" timestamp(3)   DEFAULT CURRENT_TIMESTAMP,
"user_id" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."rate" (
"id" SERIAL,
"rate" Decimal(65,30)   NOT NULL ,
"type" "operations"  NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "accounts.compound_id_unique" ON "public"."accounts"("compound_id")

CREATE INDEX "providerAccountId" ON "public"."accounts"("provider_account_id")

CREATE INDEX "providerId" ON "public"."accounts"("provider_id")

CREATE INDEX "userId" ON "public"."accounts"("user_id")

CREATE UNIQUE INDEX "sessions.session_token_unique" ON "public"."sessions"("session_token")

CREATE UNIQUE INDEX "sessions.access_token_unique" ON "public"."sessions"("access_token")

CREATE UNIQUE INDEX "users.email_unique" ON "public"."users"("email")

CREATE UNIQUE INDEX "verification_requests.token_unique" ON "public"."verification_requests"("token")

CREATE UNIQUE INDEX "balance.user_id_unique" ON "public"."balance"("user_id")

CREATE UNIQUE INDEX "rate.type_unique" ON "public"."rate"("type")

ALTER TABLE "public"."balance" ADD FOREIGN KEY ("user_id")REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201011185436-lp1
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,93 @@
+generator client {
+  provider      = "prisma-client-js"
+  binaryTargets = ["darwin", "debian-openssl-1.1.x"]
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model Account {
+  id                 Int       @default(autoincrement()) @id
+  compoundId         String    @unique @map(name: "compound_id")
+  userId             Int       @map(name: "user_id")
+  providerType       String    @map(name: "provider_type")
+  providerId         String    @map(name: "provider_id")
+  providerAccountId  String    @map(name: "provider_account_id")
+  refreshToken       String?   @map(name: "refresh_token")
+  accessToken        String?   @map(name: "access_token")
+  accessTokenExpires DateTime? @map(name: "access_token_expires")
+  createdAt          DateTime  @default(now()) @map(name: "created_at")
+  updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+
+  @@index([providerAccountId], name: "providerAccountId")
+  @@index([providerId], name: "providerId")
+  @@index([userId], name: "userId")
+
+  @@map(name: "accounts")
+}
+
+model Session {
+  id           Int      @default(autoincrement()) @id
+  userId       Int      @map(name: "user_id")
+  expires      DateTime
+  sessionToken String   @unique @map(name: "session_token")
+  accessToken  String   @unique @map(name: "access_token")
+  createdAt    DateTime @default(now()) @map(name: "created_at")
+  updatedAt    DateTime @default(now()) @map(name: "updated_at")
+
+  @@map(name: "sessions")
+}
+
+model User {
+  id            Int       @default(autoincrement()) @id
+  name          String?
+  email         String?   @unique
+  emailVerified DateTime? @map(name: "email_verified")
+  image         String?
+  createdAt     DateTime  @default(now()) @map(name: "created_at")
+  updatedAt     DateTime  @default(now()) @map(name: "updated_at")
+
+  @@map(name: "users")
+}
+
+model VerificationRequest {
+  id         Int      @default(autoincrement()) @id
+  identifier String
+  token      String   @unique
+  expires    DateTime
+  createdAt  DateTime  @default(now()) @map(name: "created_at")
+  updatedAt  DateTime  @default(now()) @map(name: "updated_at")
+
+  @@map(name: "verification_requests")
+}
+
+model Balance {
+  id        Int       @default(autoincrement()) @id
+  balance   Float?    @default(0)
+  createdAt DateTime? @default(now()) @map(name: "created_at")
+  author    User     @relation(fields: [userId], references: [id])
+  userId    Int     @default(dbgenerated()) @map(name: "user_id") @unique
+
+  @@map(name: "balance")
+}
+
+model Rate {
+  id   Int        @default(autoincrement()) @id
+  rate Float
+  type operations @unique
+
+  @@map(name: "rate")
+
+}
+
+enum operations {
+  add
+  divide
+  random
+  root
+  subtract
+  times
+  equation
+}
```


