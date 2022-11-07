-- CreateTable
CREATE TABLE "messages" (
    "message_id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" VARCHAR(1000) NOT NULL,
    "sender" BIGINT NOT NULL,
    "recipient" BIGINT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255),
    "first_name" VARCHAR(20),
    "last_name" VARCHAR(20),
    "avatar_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "open_id_sub" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messages_message_id_key" ON "messages"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_open_id_key" ON "users"("open_id_sub");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_fkey" FOREIGN KEY ("recipient") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
