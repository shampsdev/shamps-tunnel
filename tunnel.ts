import { exec } from 'node:child_process';
import figlet from 'figlet';

const remoteHost = 'linuxserver.io@tunnel.shamps.dev';
const remotePort = 2222;
const localPort = 3000;
const tunnelPort = 8080;

const run = () => {
  const command = `ssh ${remoteHost} -p ${remotePort} -N -R 0.0.0.0:${tunnelPort}:localhost:${localPort}`;

  figlet('ShampsTunnel', function (err, data) {
    // if (err) {
    //   console.log('Something went wrong...');
    //   console.dir(err);
    //   return;
    // }
    console.log(data);
  });

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
  });
};

run();
