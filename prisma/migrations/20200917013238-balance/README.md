# Migration `20200917013238-balance`

This migration has been generated at 9/16/2020, 6:32:38 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Balance" (
"id" SERIAL,
"balance" Decimal(65,30)   NOT NULL DEFAULT 0.00,
"updatedAt" timestamp(3)   NOT NULL ,
"createAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200917013238-balance
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,19 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+
+model Balance {
+  id        Int @id @default(autoincrement())
+  balance   Float @default(0.00)
+  updatedAt DateTime @updatedAt()
+  createAt  DateTime @default(now())
+}
```


