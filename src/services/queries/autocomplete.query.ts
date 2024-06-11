import { useQuery } from '@tanstack/react-query';
import {
  type GetAutocompleteResponse,
  type GetAutocompleteProps,
} from '@/types/autocomplete';
import { getAutocompletes } from '../api/autocomplete.service';

export const useAutocompletesQuery = (params: GetAutocompleteProps) =>
  useQuery<GetAutocompleteResponse>(['getAutocompletes', { params }], async () => {
    const res = await getAutocompletes(params);
    return res;
  });
