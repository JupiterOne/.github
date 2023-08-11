import { resolve } from 'node:path';
import { writeFileSync, readFileSync } from "node:fs";
import yaml from 'js-yaml';

/*
Mimics matching logic shown here
node_modules/@kie/act-js/build/src/step-mocker/step-mocker.js
*/
const locateStep = ({ step, mockStep }) => {
  if (mockStep?.id && mockStep?.id === step?.id) return true;
  if (mockStep?.name && mockStep?.name === step?.name) return true;
  if (mockStep?.uses && mockStep?.uses === step?.uses) return true;
  if (mockStep?.run && mockStep?.run === step?.run) return true;

  return false;
};

export const mockCompositeStep = ({
  originDirectory,
  repoPath,
  mockSteps,
}) => {
  const originalActionPath = resolve(originDirectory, '..', 'action.yml');
  const originalAction = yaml.load(readFileSync(originalActionPath, 'utf8')); 
  const newRepoActionPath = resolve(repoPath, 'action.yml');
  const newRepoAction = yaml.load(readFileSync(newRepoActionPath, 'utf8'));

  newRepoAction?.runs?.steps.map((step, index) => {
    // Resets the step run back to the original
    const originalStep = originalAction?.runs?.steps[index];
    step.run = originalStep?.run;
    step.uses = originalStep?.uses;
    
    mockSteps?.forEach((mockStep) => {
      const stepLocated = locateStep({ step, mockStep })

      if (stepLocated) {
        step.run = mockStep?.mockWith || `echo ""`;

        if (step.uses) {
          delete step['uses'];
        }
      }
    });
  });
  
  // console.log(newRepoAction?.runs?.steps);

  writeFileSync(newRepoActionPath, yaml.dump(newRepoAction));
};
