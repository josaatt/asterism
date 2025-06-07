import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  BookMarked,
  ChevronsUpDown,
  FolderOpen,
  Gavel,
  Home,
  KanbanSquare,
  LogOut,
  Map,
  Settings,
  Clock,
  UserCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { currentUser } from "~/data/mock-data";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};


export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r fixed",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b p-2">
              <div className="mt-[1.5px] flex w-full">
                <Link to="/" className="flex w-full items-center gap-2 px-2">
                  <div className="text-primary text-lg" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
                    ⁂
                  </div>
                  <motion.div
                    variants={variants}
                    className="flex w-fit items-center gap-2"
                  >
                    {!isCollapsed && (
                      <p className="text-sm font-medium" style={{ fontFamily: '"La Belle Aurore", cursive' }}>
                        asterism
                      </p>
                    )}
                  </motion.div>
                </Link>
              </div>
            </div>

            <div className=" flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    <Link
                      to="/"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname === "/" && "bg-muted text-primary",
                      )}
                    >
                      <Home className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Hem</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      to="/projects"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("/projects") && "bg-muted text-primary",
                      )}
                    >
                      <FolderOpen className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Projekt</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      to="/rättspraxis"
                      className={cn(
                        "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("/rättspraxis") && "bg-muted text-primary",
                      )}
                    >
                      <Gavel className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Rättspraxis</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      to="/bookmarks"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("/bookmarks") && "bg-muted text-primary",
                      )}
                    >
                      <BookMarked className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Bokmärken</p>
                        )}
                      </motion.li>
                    </Link>
                    <Separator className="w-full" />
                    <Link
                      to="/timeline"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("/timeline") && "bg-muted text-primary",
                      )}
                    >
                      <Clock className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Tidslinje</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      to="/entities"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("/entities") && "bg-muted text-primary",
                      )}
                    >
                      <Map className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Relationskarta</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      to="/drafts"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("/drafts") && "bg-muted text-primary",
                      )}
                    >
                      <KanbanSquare className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Utredningar</p>
                        )}
                      </motion.li>
                    </Link>
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col p-2">
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Avatar className="size-4">
                          <AvatarFallback>
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium">{currentUser.name.split(' ')[0]}</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5}>
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarFallback>
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">
                            {currentUser.name}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {currentUser.email}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" /> Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Inställningar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Logga ut
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
