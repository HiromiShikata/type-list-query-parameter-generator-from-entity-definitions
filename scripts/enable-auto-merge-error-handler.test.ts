import { spawn } from 'child_process';
import path from 'path';

const SCRIPT = path.resolve(__dirname, 'enable-auto-merge-error-handler.sh');

const runScript = (input: string): Promise<{ stdout: string; code: number }> =>
  new Promise((resolve) => {
    const child = spawn('bash', [SCRIPT]);
    let stdout = '';
    child.stdout.on('data', (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d: Buffer) => {
      stdout += d.toString();
    });
    child.on('close', (code: number | null) =>
      resolve({ stdout, code: code ?? 1 }),
    );
    child.stdin.write(input);
    child.stdin.end();
  });

describe('enable-auto-merge-error-handler.sh', () => {
  test('exits 0 and reports success when response has no errors key', async () => {
    const { stdout, code } = await runScript(
      JSON.stringify({ data: { enablePullRequestAutoMerge: {} } }),
    );
    expect(code).toBe(0);
    expect(stdout).toContain('Auto merge enabled successfully');
  });

  test('exits 0 with warning when errors[0].type is RATE_LIMIT', async () => {
    const { stdout, code } = await runScript(
      JSON.stringify({
        errors: [{ type: 'RATE_LIMIT', message: 'rate limit exceeded' }],
      }),
    );
    expect(code).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 0 with warning when error message contains "unstable"', async () => {
    const { stdout, code } = await runScript(
      JSON.stringify({
        errors: [
          { type: 'UNPROCESSABLE', message: 'Pull Request is unstable' },
        ],
      }),
    );
    expect(code).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 0 with warning when error message matches already.*auto.merge pattern', async () => {
    const { stdout, code } = await runScript(
      JSON.stringify({
        errors: [
          {
            type: 'UNPROCESSABLE',
            message: 'Pull request already has auto merge enabled',
          },
        ],
      }),
    );
    expect(code).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 0 with warning when error message contains "rate_limit"', async () => {
    const { stdout, code } = await runScript(
      JSON.stringify({
        errors: [
          { type: 'UNPROCESSABLE', message: 'rate_limit threshold reached' },
        ],
      }),
    );
    expect(code).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 1 with error message for unknown errors', async () => {
    const { stdout, code } = await runScript(
      JSON.stringify({
        errors: [{ type: 'INTERNAL', message: 'some unexpected error' }],
      }),
    );
    expect(code).toBe(1);
    expect(stdout).toContain(
      'Failed to enable auto merge: some unexpected error',
    );
  });
});
