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

  interface ClientLocation {
    id: number;
    client: string;
    lat: number;
    lng: number;
    phone: number;
    email: string;
    street: string;
    distance: number;
  }

  interface Location {
    lat: number;
    lng: number;
  }

  interface Adress {
    lat: number;
    lng: number;
    formatted_address?: string;
  }

  type MapType = 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
}
