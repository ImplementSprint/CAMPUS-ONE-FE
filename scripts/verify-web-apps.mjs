import { spawnSync } from 'node:child_process';

const useShell = process.platform === 'win32';
const npmCommand = 'npm';

const commands = [
  [npmCommand, ['run', 'contracts:check']],
  [npmCommand, ['run', 'supabase:check']],
  [npmCommand, ['run', 'supabase:allowlist:check']],
  [npmCommand, ['run', 'test:node']],
  [npmCommand, ['--workspace', 'apps/web-school', 'run', 'build']],
  [npmCommand, ['--workspace', 'apps/web-lms', 'run', 'build']],
];

for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(' ')}`);

  const result = useShell
    ? spawnSync([command, ...args].join(' '), {
      stdio: 'inherit',
      shell: true,
    })
    : spawnSync(command, args, {
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
