import { join, resolve } from 'node:path';
import { cwd } from 'node:process';
import { Act } from '@kie/act-js';
import { MockGithub } from '@kie/mock-github';
import {
  updateCompositeWithMocks,
  updateWorkflowWithMocks,
  MockSteps,
  MockCompositeSteps,
} from './mocking';

export const getCompositeActionConfig = ({
  directory,
  repoName,
  actionTriggeringComposite = 'action_test.yml',
  additionalFiles,
}: {
  directory: string;
  repoName: string;
  actionTriggeringComposite?: string;
  additionalFiles?: { src: string; dest: string }[];
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
          ...(additionalFiles ? additionalFiles : []),
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
  additionalFiles?: { src: string; dest: string }[];
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
            filter: ['**/test'], // Don't copy over the tests in composite actions
          },
          ...(additionalFiles ? additionalFiles : []),
        ],
      },
    },
  };
};

export const runCompositeAction = async ({
  act,
  repoName,
  originDirectory,
  mockSteps,
}: {
  act: Act;
  repoName: string;
  originDirectory: string;
  mockSteps?: MockCompositeSteps;
}) => {
  await updateCompositeWithMocks({
    repoName,
    originDirectory,
    mockSteps,
  });

  const result = await act.runEventAndJob('push', repoName, {
    logFile: process.env.ACT_LOG ? `log-${repoName}.log` : undefined,
  });

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
  mockGithub,
  mockSteps,
  config = {},
}: {
  act: Act;
  repoName: string;
  mockGithub: MockGithub;
  mockSteps?: MockSteps;
  config?: object;
}) => {
  await updateWorkflowWithMocks({
    repoPath: mockGithub?.repo?.getPath(repoName),
    repoName,
    mockSteps,
  });

  // Need to leverage ubuntu-latest for tests to operate
  act.setInput('fallback_runner', 'true');

  const result = await act.runEvent('workflow_call', {
    ...config,
    logFile: process.env.ACT_LOG ? `log-${repoName}.log` : undefined,
  });

  return result;
};
