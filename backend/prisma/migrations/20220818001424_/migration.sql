/*
  Warnings:

  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT E'OFFLINE';
