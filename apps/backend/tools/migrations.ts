import { spawn } from "child_process";

import dotenv from "dotenv";
import findConfig from "find-config";

dotenv.config({ path: findConfig(".env") });

function bootstrap(): Promise<any> {
  return new Promise((resolve, reject) => {
    const spawnOptions = {
      shell: true,
      env: {
        ...process.env,
        TYPEORM_ENTITIES: "dist/src/entities/*.js",
        TYPEORM_MIGRATIONS: "dist/src/migrations/*.js",
      },
    };

    const migrationProcess = spawn("npx", ["typeorm", "migration:run"], spawnOptions);

    migrationProcess.on("error", (err) => {
      throw err;
    });

    migrationProcess.stdout.on("data", (data) => console.log(data.toString()));
    migrationProcess.stderr.on("data", (data) => console.error(data.toString()));

    migrationProcess.on("close", (code) => resolve(code));
  });
}

bootstrap();
