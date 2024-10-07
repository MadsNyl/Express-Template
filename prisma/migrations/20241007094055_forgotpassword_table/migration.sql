/*
  Warnings:

  - You are about to drop the column `forgotPasswordToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "forgotPasswordToken";

-- CreateTable
CREATE TABLE "ForgotPassword" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '1 day',
    "userId" TEXT NOT NULL,

    CONSTRAINT "ForgotPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_token_key" ON "ForgotPassword"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_userId_key" ON "ForgotPassword"("userId");

-- AddForeignKey
ALTER TABLE "ForgotPassword" ADD CONSTRAINT "ForgotPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
