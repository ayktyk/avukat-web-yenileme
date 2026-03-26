import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

const isInternalHref = (href: string) => href.startsWith("/") && !href.startsWith("//");

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

const extractStandaloneLink = (node?: {
  children?: Array<{
    type?: string;
    url?: string;
    children?: Array<{ type?: string; value?: string }>;
  }>;
}) => {
  if (!node?.children || node.children.length !== 1) {
    return null;
  }

  const child = node.children[0];
  if (child?.type !== "link" || !child.url) {
    return null;
  }

  const label = (child.children ?? [])
    .map((nestedChild) => (nestedChild.type === "text" ? nestedChild.value ?? "" : ""))
    .join("")
    .trim();

  return label ? { href: child.url, label } : null;
};

const renderMarkdownLink = (href: string, children: ReactNode, className: string) => {
  if (isInternalHref(href)) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={isExternalHref(href) ? "_blank" : undefined}
      rel={isExternalHref(href) ? "noreferrer noopener" : undefined}
    >
      {children}
    </a>
  );
};

const MarkdownContent = ({ content, className }: MarkdownContentProps) => (
  <div className={cn("space-y-5 text-[17px] leading-[1.85] text-foreground/90", className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ node, ...props }) => <h2 className="mt-10 font-display text-3xl font-bold text-primary-deep" {...props} />,
        h3: ({ node, ...props }) => <h3 className="mt-8 font-display text-2xl font-bold text-primary-deep" {...props} />,
        p: ({ node, children, ...props }) => {
          const standaloneLink = extractStandaloneLink(node);

          if (standaloneLink) {
            return (
              <div className="mt-8 flex flex-wrap gap-3">
                {renderMarkdownLink(
                  standaloneLink.href,
                  standaloneLink.label,
                  "inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90",
                )}
              </div>
            );
          }

          return (
            <p className="mt-5" {...props}>
              {children}
            </p>
          );
        },
        ul: ({ node, ...props }) => <ul className="mt-5 list-disc space-y-2 pl-6" {...props} />,
        ol: ({ node, ...props }) => <ol className="mt-5 list-decimal space-y-2 pl-6" {...props} />,
        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
        a: ({ node, href, children, ...props }) =>
          renderMarkdownLink(
            href ?? "#",
            <span {...props}>{children}</span>,
            "font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-deep",
          ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="mt-6 border-l-4 border-accent/40 bg-card px-5 py-4 italic text-muted-foreground" {...props} />
        ),
        strong: ({ node, ...props }) => <strong className="font-semibold text-primary-deep" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-8 border-border" {...props} />,
        table: ({ node, ...props }) => <table className="mt-6 w-full border-collapse overflow-hidden rounded-xl text-left" {...props} />,
        thead: ({ node, ...props }) => <thead className="bg-muted/70" {...props} />,
        th: ({ node, ...props }) => <th className="border border-border px-4 py-3 text-sm font-semibold text-primary-deep" {...props} />,
        td: ({ node, ...props }) => <td className="border border-border px-4 py-3 align-top text-sm leading-7" {...props} />,
        code: ({ node, className: codeClassName, children, ...props }) => {
          const isBlock = Boolean(codeClassName);

          if (isBlock) {
            return (
              <code className={cn("rounded-md bg-primary-deep px-1.5 py-1 text-sm text-primary-foreground", codeClassName)} {...props}>
                {children}
              </code>
            );
          }

          return (
            <code className="rounded-md bg-muted px-1.5 py-1 text-[0.9em] text-primary-deep" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ node, ...props }) => (
          <pre className="mt-6 overflow-x-auto rounded-2xl bg-primary-deep p-5 text-sm leading-7 text-primary-foreground" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
