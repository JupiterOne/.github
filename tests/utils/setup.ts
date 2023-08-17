import { join, resolve } from 'node:path';
import { cwd } from 'node:process';
import { Act } from '@kie/act-js';

export const getCompositeActionConfig = ({
  directory,
  repoName,
  actionTriggeringComposite = 'action_test.yml',
  additionalFiles,
}: {
  directory: string;
  repoName: string;
  actionTriggeringComposite?: string;
  additionalFiles?: { src: string; dest: string; }[];
}) => {
  return {
    repo: {
      [repoName]: {
        files: [
          {
            src: join(directory, actionTriggeringComposite),
            dest: `.github/workflows/${actionTriggeringComposite}`,
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
  act: Act;
  repoName: string;
  mockSteps?: boolean;
}) => {
  // If true, will skip all steps in the composite action that contain "if: ${{ !env.TEST }}"
  act.setEnv('TEST', String(mockSteps));

  const result = await act.runEventAndJob('push', repoName, { logFile: process.env.ACT_LOG ? `${repoName}.log` : undefined });
  
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
  act: Act;
  repoName: string;
  config?: object;
  mockSteps?: boolean;
}) => {
  // If true, will skip all steps in the workflow that contain "if: ${{ !env.TEST }}"
  act.setEnv('TEST', String(mockSteps));

  // Need to leverage ubuntu-latest for tests to operate
  act.setInput('fallback_runner', 'true');

  // Ensures we're not attempting to checkout the global repository in our tests as we're already in it
  act.setInput('use_global_actions', 'false');
  
  const result = await act.runEvent('workflow_call', { logFile: process.env.ACT_LOG ? `${repoName}.log` : undefined, ...config });

  return result;
};
