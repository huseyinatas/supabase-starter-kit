import React, { HtmlHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type HeadingProps = HtmlHTMLAttributes<HTMLHeadingElement>;

export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>(function H1(
  { children, className, ...props },
  ref,
) {
  return (
    <h1
      {...props}
      ref={ref}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
});
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>(function H2(
  { children, className, ...props },
  ref,
) {
  return (
    <h2
      {...props}
      ref={ref}
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h2>
  );
});
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>(function H3(
  { children, className, ...props },
  ref,
) {
  return (
    <h3
      {...props}
      ref={ref}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
});
H3.displayName = "H3";

export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>(function H4(
  { children, className, ...props },
  ref,
) {
  return (
    <h4
      {...props}
      ref={ref}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
});
H4.displayName = "H4";

export type ParagraphProps = HtmlHTMLAttributes<HTMLParagraphElement> & {
  firstChildMargin?: boolean;
};

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  function Paragraph(
    { children, className, firstChildMargin = true, ...props },
    ref,
  ) {
    return (
      <p
        {...props}
        ref={ref}
        className={cn(
          {
            "&:not(:first-child)": {
              marginTop: firstChildMargin ? "1.5rem" : 0,
            },
          },
          "leading-7",
          className,
        )}
      >
        {children}
      </p>
    );
  },
);
Paragraph.displayName = "Paragraph";

export const ParagraphBold = forwardRef<HTMLParagraphElement, ParagraphProps>(
  function ParagraphBold(
    { children, className, firstChildMargin, ...props },
    ref,
  ) {
    return (
      <p
        ref={ref}
        {...props}
        className={cn(
          {
            "&:not(:first-child)": {
              marginTop: firstChildMargin ? "1.5rem" : 0,
            },
          },
          "font-semibold leading-7",
          className,
        )}
      >
        {children}
      </p>
    );
  },
);
ParagraphBold.displayName = "ParagraphBold";

export type SmallProps = HtmlHTMLAttributes<HTMLElement>;

export const Small = forwardRef<HTMLElement, SmallProps>(function Small(
  { children, className, ...props },
  ref,
) {
  return (
    <small
      {...props}
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
    >
      {children}
    </small>
  );
});
Small.displayName = "Small";
