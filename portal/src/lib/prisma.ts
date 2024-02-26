import { PrismaClient } from "@prisma/client";

export class PrismaClientInstance {
  private static instance: PrismaClient;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PrismaClient();
    }

    return this.instance;
  }
}
