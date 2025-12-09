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
      </div>
    </header>
  );
}

export default Header;
