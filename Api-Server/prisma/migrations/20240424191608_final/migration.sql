/*
  Warnings:

  - A unique constraint covering the columns `[subdomain]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[custom_domain]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_subdomain_key" ON "Project"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Project_custom_domain_key" ON "Project"("custom_domain");
