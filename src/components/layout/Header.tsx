import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type HeaderProps = HTMLAttributes<HTMLElement>;

export default function Header(props: HeaderProps) {
  return (
    <header
      {...props}
      className={cn(
        "sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm",
        props.className,
      )}
    >
      <div className="flex h-16 flex-row items-center justify-end gap-x-4 px-8"></div>
    </header>
  );
}
