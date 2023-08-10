import { join, resolve } from 'node:path';
import { cwd } from 'node:process';

export const getCompositeActionConfig = ({
  directory,
  repoName,
  additionalFiles,
}: {
  directory: string;
  repoName: string;
  additionalFiles?: { src: string; dest: string; }[];
}) => {
  return {
    repo: {
      [repoName]: {
        files: [
          {
            src: join(directory, 'action_test.yml'),
            dest: '.github/workflows/test.yml',
          },
          {
            src: resolve(directory, '..', 'action.yml'),
            dest: '/action.yml',
          },
          // Copy over package.json from root, needed for migration_number
          {
            src: resolve(cwd(), 'tests', 'package.json'),
            dest: 'package.json',
          },
          ...(additionalFiles ? additionalFiles : [])
        ],
      },
    },
  };
};

export const getWorkflowConfig = ({
  repoName,
  additionalFiles,
}: {
  repoName: string;
  additionalFiles?: { src: string; dest: string; }[];
}) => {
  return {
    repo: {
      [repoName]: {
        files: [
          {
            src: resolve(cwd(), '.github', 'workflows', `${repoName}.yml`),
            dest: `.github/workflows/${repoName}.yml`,
          },
          // Copy over package.json from root, needed for migration_number
          {
            src: resolve(cwd(), 'tests', 'package.json'),
            dest: 'package.json',
          },
          // Copy over composite actions
          {
            src: resolve(cwd(), '.github/actions'),
            dest: `.github/actions`,
          },
          ...(additionalFiles ? additionalFiles : [])
        ],
      },
    },
  };
};

export const runCompositeAction = async ({
  act,
  repoName,
  mockSteps = true,
}: {
  act: any;
  repoName: string;
  mockSteps?: boolean;
}) => {
  // If true, will skip all steps in the composite action that contain "if: ${{ !env.TEST }}"
  if (mockSteps) act.setEnv('TEST', 'true');

  const result = await act.runEventAndJob('push', repoName, { logFile: process.env.ACT_LOG ? `repo/${repoName}.log` : undefined });
  
  /*
  The first two and last item in the returned results are the same for every composite action test.
  Therefore we want to remove those to make our test results cleaner.
  */
  const cleanedResult = result.slice(2).slice(0, -1);

  return cleanedResult;
};

export const runWorkflow = async ({
  act,
  repoName,
  config = {},
  mockSteps = true,
}: {
  act: any;
  repoName: string;
  config?: {};
  mockSteps?: boolean;
}) => {
  // If true, will skip all steps in the workflow that contain "if: ${{ !env.TEST }}"
  if (mockSteps) act.setEnv('TEST', 'true');
  
  const result = await act.runEvent('workflow_call', { logFile: process.env.ACT_LOG ? `repo/${repoName}.log` : undefined, ...config });

  return result;
};
