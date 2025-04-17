import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = "h1", children, ...props }, ref) => {
    const Component = as;
    
    // Apply appropriate styles based on heading level
    const styles = {
      h1: "text-3xl font-bold leading-tight",
      h2: "text-2xl font-bold leading-tight",
      h3: "text-xl font-semibold leading-tight",
      h4: "text-lg font-semibold leading-tight",
      h5: "text-base font-medium leading-tight",
      h6: "text-sm font-medium leading-tight",
    };
    
    return (
      <Component
        ref={ref}
        className={cn(styles[as], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export { Heading };
