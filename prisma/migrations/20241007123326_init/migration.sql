-- AlterTable
ALTER TABLE "ForgotPassword" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '1 day';
