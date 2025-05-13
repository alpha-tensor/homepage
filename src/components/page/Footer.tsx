import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-6 bg-background text-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 Alpha Tensor, Inc. All Rights Reserved
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
