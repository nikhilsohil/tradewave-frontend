"use client";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { createLink, type LinkComponent } from "@tanstack/react-router";

type TopNavProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;
const TopNav = ({ className, ...props }: TopNavProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 text-sm text-unfocused h-14 items-center",
        className
      )}
      {...props}
    />
  );
};

TopNav.displayName = "TopNav";

const MotionLink = motion.create(Link);
type TopNavLinkProps = {
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof MotionLink>;

const TopNavLink = ({ className, children, ...props }: TopNavLinkProps) => {
  const pathname = useLocation().pathname;

  const isActive = pathname === props.to;

  return (
    <MotionLink
      layout="position"
      className={cn(
        "h-full flex items-center relative font-medium",
        isActive && "text-active",
        className
      )}
      {...props}
    >
      <span> {children}</span>
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="underline"
            className="h-1 bg-primary w-full absolute bottom-0 left-0"
          />
        )}
      </AnimatePresence>
    </MotionLink>
  );
};

TopNavLink.displayName = "TopNavLink";

export { TopNav, TopNavLink };

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;

  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = ({ children,className, ...props }: BasicLinkProps) => {
  const pathname = useLocation().pathname;

  const isActive = pathname === props.href;

  return (
    <a
      {...props}
      className={cn(
        "h-full flex items-center relative font-medium",
        isActive && "text-active",
        className
      )}
    >
      <span> {children}</span>
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="underline"
            className="h-1 bg-primary w-full absolute bottom-0 left-0"
          />
        )}
      </AnimatePresence>
    </a>
  );
};

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
