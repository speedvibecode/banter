-- Prevent the same user from reporting the same poll more than once.
CREATE UNIQUE INDEX "Report_pollId_reporterId_key" ON "Report"("pollId", "reporterId");
