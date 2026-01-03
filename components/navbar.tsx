"use client";

import { motion } from "framer-motion";
import * as React from "react";
import Link from "next/link";
import {
  Book,
  Calendar,
  Mail,
  Menu,
  ShoppingCart,
  ToolCase,
  Gift,
  Receipt,
} from "lucide-react";
import { useContact } from "@/contexts/contact-context";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Marketplace",
      url: "#",
      items: [
        {
          title: "Buy",
          description: "Buy a robot for your needs",
          icon: <ShoppingCart className="size-5 shrink-0" />,
          url: "/services/buy",
        },
        {
          title: "Rent",
          description: "Rent a robot for a short period of time",
          icon: <Receipt className="size-5 shrink-0" />,
          url: "/services/rent",
        },
        {
          title: "Accessories",
          description:
            "Browse accessories and find the perfect fit for your robot",
          icon: <Gift className="size-5 shrink-0" />,
          url: "/services/accessories",
        },
        {
          title: "Repairs",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <ToolCase className="size-5 shrink-0" />,
          url: "/services/repairs",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Consultations",
          description: "Book a consultation with our experts",
          icon: <Calendar className="size-5 shrink-0" />,
          url: "/services/consultation",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Mail className="size-5 shrink-0" />,
          url: "#contact",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Services",
      url: "#services",
    },
    {
      title: "Blog",
      url: "#",
    },
  ],
  className,
}: Navbar1Props) => {
  const { openContact } = useContact();

  return (
    <section
      className={cn(
        "py-4 w-full bg-transparent absolute top-0 left-0 right-0 z-50",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/logo.png" className="max-h-8 dark:invert" alt="logo" />
              <span className="text-lg font-semibold tracking-tighter text-black dark:text-white zalando-sans-expanded">
                Universal AI Services
              </span>
            </motion.a>
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <NavigationMenu>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                >
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </motion.div>
              </NavigationMenu>
            </motion.div>
          </div>
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={openContact}
              className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-black/90 transition-colors text-sm"
            >
              Contact
            </button>
          </motion.div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" className="max-h-8 dark:invert" alt="logo" />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <img
                        src="/logo.png"
                        className="max-h-8 dark:invert"
                        alt="logo"
                      />
                    </Link>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation menu
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={openContact}
                      className="bg-black text-white hover:bg-black/90"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <motion.div
        key={item.title}
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black/80 dark:text-white data-[state=open]:text-black data-[state=open]:bg-white/10">
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover/95 backdrop-blur-sm text-popover-foreground">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title} className="w-80">
                <SubMenuLink item={subItem} />
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={item.title}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <NavigationMenuItem>
        <NavigationMenuLink
          href={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-black dark:text-white transition-colors hover:bg-white/10 hover:text-black"
        >
          {item.title}
        </NavigationMenuLink>
      </NavigationMenuItem>
    </motion.div>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  const { openContact } = useContact();

  const handleClick = (e: React.MouseEvent) => {
    if (item.url === "#contact") {
      e.preventDefault();
      openContact();
    }
  };

  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
      onClick={handleClick}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
