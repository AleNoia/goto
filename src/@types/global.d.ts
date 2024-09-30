export {};

declare global {
  type Route = { path: string; component: React.FC };
  type AdminRoute = { path: string; component: React.FC; name: string };

  type GenericObject = {
    [key: string]: string;
  };
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}
