import fs from 'fs';
import { resolve } from 'node:path';
import { writeFileSync, readFileSync } from "node:fs";
import yaml from 'js-yaml';
import { cwd } from 'node:process';

type Step = {
  run: string;
  uses: string;
  name: string;
  with: string;
}

type MockCompositeStep = {
  mockWith?: string;
  name: string;
}

export type MockCompositeSteps = MockCompositeStep[];

type MockStep = {
  mockWith?: string;
  name: string;
  mockCompositeSteps?: MockCompositeSteps;
}

export type MockSteps = {
  [key: string]: MockStep[];
};

const localizePath = (path: string) => path
  .replace(/jupiterone\/.github\//g, '')
  .replace(/@main/g, '');

const getCompositeMockSteps = async ({
  mockSteps,
  pathToCompositeFolder
}: {
  mockSteps?:MockCompositeSteps;
  pathToCompositeFolder: string;
}) => {
  // Look for mocks being passed in
  let mockCompositeSteps:MockCompositeSteps = mockSteps;

  // Otherwise dynamically load in mocks from composite action
  if (!mockCompositeSteps) {
    const pathToCompositeMocks = resolve(cwd(), `${pathToCompositeFolder}/mocks.ts`);

    if (fs.existsSync(pathToCompositeMocks)) {
      const compositeMocks = await import(pathToCompositeMocks);
      mockCompositeSteps = Object.values(compositeMocks).flat() as unknown as MockCompositeSteps;
    }
  }

  return mockCompositeSteps;
};

/*
Based on the mockCompositeSteps passed in, dynamically update the steps in the
composite action within the temp repo (i.e. ./repo/name_of_repo/...).
*/
const updateCompositeSteps = ({
  mockCompositeSteps,
  actionPath
}: {
  mockCompositeSteps: MockCompositeSteps,
  actionPath?: string;
}) => {
  const actionYaml = yaml.load(readFileSync(actionPath, 'utf8'));

  mockCompositeSteps?.forEach((mockStep) => {
    const step = actionYaml?.runs?.steps.filter((step) => step?.name === mockStep?.name).shift();

    if (step) updateStepAsMock({ step, mockStep });
  });

  writeFileSync(actionPath, yaml.dump(actionYaml));
};

export const updateCompositeWithMocks = async ({
  repoName,
  originDirectory,
  mockSteps
}: {
  repoName: string,
  originDirectory: string;
  mockSteps?: MockCompositeSteps;
}) => {
  const actionPath = resolve(`repo`, repoName, 'action.yml');
  const pathToCompositeFolder = originDirectory.replace('/test', '');
  const mockCompositeSteps = await getCompositeMockSteps({ pathToCompositeFolder, mockSteps });

  updateCompositeSteps({
    actionPath,
    mockCompositeSteps,
  });
};

/*
Updates the paths in the workflow matching "jupiterone/.github/actions/some-action@main"
to point at the local composite action "./.github/actions/some-action"
*/
export const updateWorkflowWithMocks = async ({
  repoPath,
  repoName,
  mockSteps = {},
}: {
  repoPath:string,
  repoName: string,
  mockSteps?: MockSteps;
}) => {
  const workflowPath = resolve(repoPath, '.github', 'workflows', `${repoName}.yml`);
  const workflowYaml = yaml.load(readFileSync(workflowPath, 'utf8'));
  const jobs:{
    [key: string]: {
      steps: [Step]
    }
  } = workflowYaml?.jobs;

  // Loop through each job and the corresponding steps in the workflow
  for await (const entry of Object.entries(jobs)) {
    const [ key, value ] = entry;
    for await (const step of value.steps) {
      // Only update steps that leverage a jupiterone composite action
      if (step?.uses?.includes('jupiterone')) {
        await updateStepInJob({
          repoName,
          mockSteps,
          key,
          step
        });
      }
    }
  }

  writeFileSync(workflowPath, yaml.dump(workflowYaml));
};

/*
Mock a step by updating the `run` property and removing
the uses/with property as they become obsolete.
*/
const updateStepAsMock = ({
  step,
  mockStep
}: {
  step: Step;
  mockStep?: MockStep | MockCompositeStep;
}) => {
  step.run = mockStep?.mockWith || `echo ''`;
      
  if (step && step?.uses) delete step.uses;
  if (step && step?.with) delete step.with;
}

/*
For each individual step, we want to:
1. Update the path to point to the local composite action (./.github/actions/...)
2. Update the actual steps in the composite actions file and mock them as necessary
*/
const updateStepInJob = async ({
  repoName,
  mockSteps = {},
  key,
  step
}: {
  repoName: string,
  mockSteps?: MockSteps;
  key: string;
  step: Step;
}) => {
  const mockJobStep:MockStep = mockSteps[key]?.filter(({ name }) => name === step.name)?.shift();
  const mockCompositeSteps = await getCompositeMockSteps({
    mockSteps: mockJobStep?.mockCompositeSteps,
    pathToCompositeFolder: localizePath(step.uses)
  });

  // Update job step in workflow to point at local composite action
  step.uses = `./${localizePath(step.uses)}`;

  // Mock out the steps in the composite action based on the mockSteps passed in
  // or dynamically use the mocks.ts file in the composite action directory
  if (mockCompositeSteps) {
    const trimmedPath = step?.uses.replace('./', '');
    const actionPath = `./repo/${repoName}/${trimmedPath}/action.yml`;

    updateCompositeSteps({ actionPath, mockCompositeSteps });
  }

  // Will mock the entire workflow job step if mocked externally
  if (mockJobStep && !mockJobStep?.mockCompositeSteps) {
    updateStepAsMock({ step, mockStep:mockJobStep });
  }

  return step;
};
