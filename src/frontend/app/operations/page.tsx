import FunctionList from './fucntions';
import { apiGetFunctionsAsync } from '@/components/ApiHandler';

export default async function Operations() {
  const response = await apiGetFunctionsAsync();

  return (
    <FunctionList functions={response.functions} readable={response.readable_names} />
  );
}
