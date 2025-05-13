import Link from "next/link";
import AlphaTensorLogo from "@/components/AlphaTensorLogo";
import AlphaMark from "@/components/AlphaMark";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Alpha Tensor Logo */}
        <div className="flex items-center gap-3">
          <AlphaTensorLogo className="w-[140px] hidden md:flex" />
          <AlphaMark className="w-8 h-8 md:hidden" />
        </div>

        {/* Right side links and menu */}
        <div className="flex items-center space-x-6">
          {/* Hamburger Icon - Show on small, hide on medium+ */}
          <button className="flex flex-col space-y-1 md:hidden">
            <span className="h-0.5 w-6 bg-foreground"></span>
            <span className="h-0.5 w-6 bg-foreground"></span>
          </button>
          {/* Navigation links for larger screens */}
          <nav className="hidden md:flex items-center gap-6 mr-4">
            {" "}
            {/* Added mr-4 */}
            <Link
              href="#products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
