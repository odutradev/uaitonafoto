import type { ReactElement, ReactNode } from "react";

export interface PageProviderProps {
  children: ReactNode;
}

export interface PageContext<Value> {
  PageProvider: (props: PageProviderProps) => ReactElement;
  usePage: () => Value;
}
