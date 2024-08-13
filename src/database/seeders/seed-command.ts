import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { SeederService } from "./seeder.service";

async function boostrap() {
    const app = await NestFactory.create(AppModule);
    const seederService = app.get(SeederService);

    try {
        await seederService.seedUsers();
        console.log('Seeding completed successfully');
    } catch (error){
        console.error('Seeding failed:', error);
    } finally {
        await app.close();
    }
}

boostrap();