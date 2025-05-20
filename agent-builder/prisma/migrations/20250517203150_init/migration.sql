-- CreateTable
CREATE TABLE "Agent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AgentRouteDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "agentId" INTEGER NOT NULL,
    CONSTRAINT "AgentRouteDetail_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
