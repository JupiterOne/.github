/*
Helpers methods for finding and extracting a test result
from the act-js output.
*/
interface Result { name: string; output: string; };

export const getTestResult = ({
  results,
  name,
}: {
  results: Result[];
  name: string;
}) => {
  const resultFound = results.filter((result) => result?.name?.includes(name));

  return resultFound?.[0];
};

export const getTestResults = ({
  results,
  names,
}: {
  results: Result[];
  names: string[]
}) => {
  const resultsFound = results.filter((result) =>
    names.includes(result?.name?.replace('Main ', ''))
  );

  return resultsFound;
}
