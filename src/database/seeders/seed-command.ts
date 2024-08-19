import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { SeederService } from "./seeder.service";

async function boostrap() {
    const app = await NestFactory.create(AppModule);
    const seederService = app.get(SeederService);

    try {
        await seederService.seedDatabase();
    } catch (error){
        console.error('Seeding failed:', error);
    } finally {
        await app.close();
    }
}

boostrap();