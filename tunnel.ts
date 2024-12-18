#!/usr/bin/env node

import { spawn } from 'node:child_process';
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
    .option('-l, --local-port <port>', 'Local port to forward', '5173')
    .addHelpText(
        'after',
        `
Examples:

  # Basic usage
  $ ./shamps-tunnel.js -u root -h example.com -r 2222 -t 9090 -l 3000

  # Use default options
  $ ./shamps-tunnel.js
`
    );


program.parse(process.argv);

const options = program.opts();

const { user, host, remotePort, tunnelPort, localPort } = options;

const run = () => {
    const command = `ssh -v ${user}@${host} -p ${remotePort} -R 0.0.0.0:${tunnelPort}:127.0.0.1:${localPort}`;

    const args = ['-v', `${user}@${host}`, '-p', remotePort, '-R', `0.0.0.0:${tunnelPort}:127.0.0.1:${localPort}`];

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

    console.log(command);
    const sshProcess = spawn('ssh', args);

    sshProcess.stdout.on('data', (data) => {
        console.log(`STDOUT: ${data}`);
    });

    sshProcess.stderr.on('data', (data) => {
        console.error(`STDERR: ${data}`);
    });

    sshProcess.on('close', (code) => {
        console.log(`SSH process exited with code ${code}`);
    });

    sshProcess.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });
};

run();

