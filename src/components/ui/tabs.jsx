import React from "react";
import { cn } from "../../lib/utils";

const Tabs = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("flex space-x-1 rounded-lg bg-muted p-1", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ className, active, children, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Tabs, TabsTrigger };
