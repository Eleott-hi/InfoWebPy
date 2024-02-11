import FunctionList from './fucntions';
import { apiGetFunctions } from '@/components/ApiHandler';

export default async function Operations() {
  const response = await apiGetFunctions();

  return (
    <FunctionList functions={response.functions} />
  );
}
