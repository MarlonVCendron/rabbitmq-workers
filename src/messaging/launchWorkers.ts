import { execSync } from "child_process";

const numberOfWorkers = Number(process.argv[2]) || 1;

for (let i = 1; i <= numberOfWorkers; i++) {
  execSync(
    `WORKER_INDEX=${i} pm2 start src/messaging/workerService.ts --name worker-${i} --watch --interpreter /home/marlon/.nvm/versions/node/v21.2.0/bin/ts-node`,
    { stdio: "inherit" }
  );
}

console.log(`${numberOfWorkers} workers started.`);
