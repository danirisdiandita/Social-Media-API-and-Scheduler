-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_key" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "key_index" TEXT NOT NULL,
    "name" TEXT,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connection" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "connection_slug" TEXT NOT NULL,
    "display_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT,
    "state" TEXT,
    "scopes" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_in" INTEGER NOT NULL,
    "refresh_expires_in" INTEGER NOT NULL,
    "social_media" TEXT,
    "open_id" TEXT,
    "union_id" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "connection_id" INTEGER NOT NULL,
    "publish_id" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "media_type" TEXT,
    "privacy" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_key_key_index_key" ON "api_key"("key_index");

-- CreateIndex
CREATE INDEX "api_key_user_id_idx" ON "api_key"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "connection_connection_slug_key" ON "connection"("connection_slug");

-- CreateIndex
CREATE UNIQUE INDEX "connection_open_id_key" ON "connection"("open_id");

-- CreateIndex
CREATE INDEX "connection_user_id_idx" ON "connection"("user_id");

-- CreateIndex
CREATE INDEX "post_history_user_id_idx" ON "post_history"("user_id");

-- AddForeignKey
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_history" ADD CONSTRAINT "post_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_history" ADD CONSTRAINT "post_history_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
