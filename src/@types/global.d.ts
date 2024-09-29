export {};

declare global {
  type AutoCompleteValue = string | number | string[] | null;

  type TextFieldOnChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  type DatePickerOnChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  type InputFileOnChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  type Route = { path: string; component: React.FC };
  type AdminRoute = { path: string; component: React.FC; name: string };

  type GenericObject = {
    [key: string]: string;
  };

  type APIError = {
    message: string;
    errors?: { [key: string]: string[] };
  };

  type SelectOption = { value: number | string; name: string; disabled?: boolean };

  type DepositFormData = {
    valor: number | undefined;
    cupom: string | undefined;
  };

  interface Window {
    matchMedia: (query: string) => MediaQueryList;
    Tawk_API: { [key: string]: () => void };
  }
}
