export interface Autocomplete {
  id: string;
  name: string;
  category: string;
  value: number | string;
  inputs?: string;
}

export interface GetAutocompleteProps {
  search?: string;
}

export type GetAutocompleteResponse = Autocomplete[];