-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConnectionToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConnectionToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "tag_user_id_idx" ON "tag"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_user_id_name_key" ON "tag"("user_id", "name");

-- CreateIndex
CREATE INDEX "_ConnectionToTag_B_index" ON "_ConnectionToTag"("B");

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectionToTag" ADD CONSTRAINT "_ConnectionToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectionToTag" ADD CONSTRAINT "_ConnectionToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
