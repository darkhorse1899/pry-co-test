import { api } from '@/lib/api';
import {
  type GetAutocompleteResponse,
  type GetAutocompleteProps,
} from '@/types/autocomplete';

export const getAutocompletes = async (
  params: GetAutocompleteProps
): Promise<GetAutocompleteResponse> => {
  const { search } = params;
  const { data } = await api.get<GetAutocompleteResponse>('', { params: { search } });
  return data;
};
