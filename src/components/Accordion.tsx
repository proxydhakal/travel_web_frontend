import { useState } from "react";
import { cn } from "../utils/format";

export function Accordion({
  items,
  numbered = false,
}: {
  items: Array<{ title: string; content: string }>;
  numbered?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={numbered ? "relative ml-3 border-l border-sun/40 pl-6" : "space-y-3"}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.title} className={numbered ? "relative pb-3" : "overflow-hidden rounded-xl border border-line bg-white"}>
            {numbered && <span className="absolute -left-[31px] top-3 h-3 w-3 rounded-full border-2 border-sun bg-white" aria-hidden="true" />}
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 text-left",
                  numbered ? "py-3 text-sm font-semibold" : "px-4 py-4 text-sm font-semibold",
                )}
              >
                <span>{item.title}</span>
                <span className={cn("text-muted transition", isOpen && "rotate-180")} aria-hidden="true">
                  ⌄
                </span>
              </button>
            </h3>
            {isOpen && <div className={cn("text-sm leading-6 text-muted", numbered ? "pb-2 pr-2" : "px-4 pb-4")}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
