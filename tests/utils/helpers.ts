export const getTestResult = ({
  results,
  name,
  id,
}: {
  results: { name: string; id: string; output: string; }[];
  name?: string;
  id?: string;
}) => {
  const result = results.filter((result) => {
    if (result?.name?.includes(name)) return true;
    if (result?.id?.includes(id)) return true;

    return false;
  });

  return result?.[0];
};
