/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'VENDEDOR', 'TALLER', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('RECIBIDO', 'EN_PROCESO', 'LISTO_PARA_ENTREGA', 'ENTREGADO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CLIENTE',
    "telefono" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "productos" JSONB NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'RECIBIDO',
    "total" DOUBLE PRECISION NOT NULL,
    "senia" DOUBLE PRECISION,
    "fechaEntrega" TIMESTAMP(3),
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
