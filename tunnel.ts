#!/usr/bin/env node

import { exec } from 'node:child_process';
import figlet from 'figlet';
import { Command } from 'commander';

const program = new Command();

program
  .version('1.0.0')
  .description('ShampsTunnel - A customizable SSH reverse tunnel utility')
  .option('-u, --user <user>', 'SSH user', 'linuxserver.io')
  .option('-h, --host <host>', 'Remote host IP', 'tunnel.shamps.dev')
  .option('-r, --remote-port <port>', 'Remote SSH port', '2222')
  .option('-t, --tunnel-port <port>', 'Tunnel port on the server', '8080')
  .option('-l, --local-port <port>', 'Local port to forward', '5173');

program.parse(process.argv);

const options = program.opts();

const { user, host, remotePort, tunnelPort, localPort } = options;

const run = () => {
  const command = `ssh ${user}@${host} -p ${remotePort} -N -R 0.0.0.0:${tunnelPort}:localhost:${localPort}`;

  figlet('ShampsTunnel', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
    console.log(`\nRunning tunnel from ${user}@${host}:${remotePort}`);
    console.log(`Forwarding remote port ${tunnelPort} to localhost:${localPort}`);
  });

  exec(command, (error, _stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
  });
};

run();

