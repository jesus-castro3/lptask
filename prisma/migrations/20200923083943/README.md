# Migration `20200923083943`

This migration has been generated at 9/23/2020, 8:39:44 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."operations" AS ENUM ('add', 'divide', 'random', 'root', 'subtract', 'times')

CREATE TABLE "public"."Balance" (
"id" SERIAL,
"balance" Decimal(65,30)   ,
"userId" SERIAL,
"createdAt" timestamp(3)   DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Rate" (
"id" SERIAL,
"rate" Decimal(65,30)   NOT NULL ,
"type" "operations"  NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Users" (
"id" SERIAL,
"user" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "Balance.userId_unique" ON "public"."Balance"("userId")

CREATE UNIQUE INDEX "Rate.type_unique" ON "public"."Rate"("type")

ALTER TABLE "public"."Balance" ADD FOREIGN KEY ("userId")REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200923083943
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,40 @@
+generator client {
+  provider = "prisma-client-js"
+  binaryTargets = ["darwin", "debian-openssl-1.1.x"]
+}
+
+datasource db {
+  provider = "postgresql"
+  // url = "***"
+  url = "***"
+}
+
+model Balance {
+  id        Int       @default(autoincrement()) @id
+  balance   Float?
+  userId    Int       @default(autoincrement()) @unique
+  createdAt DateTime? @default(now())
+  author    Users     @relation(fields: [userId], references: [id])
+}
+
+model Rate {
+  id   Int        @default(autoincrement()) @id
+  rate Float
+  type operations @unique
+}
+
+model Users {
+  id        Int      @default(autoincrement()) @id
+  user      String
+  createdAt DateTime @default(now())
+  balance   Balance?
+}
+
+enum operations {
+  add
+  divide
+  random
+  root
+  subtract
+  times
+}
```


