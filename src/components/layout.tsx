import Header from "./header/header";
import DefinTheWord from "./definTheWord/definTheWord";
import { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
  };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-[#e3e1e1] h-full w-full min-h-[1500px]">
      <Header />
      <DefinTheWord />
      {children}
    </div>
  );
}
