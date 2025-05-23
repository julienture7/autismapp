import Link from "next/link";

const WonderChatLogo = () => (
  <div className="size-6 primary-text">
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  </div>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-slate-300 py-10">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <WonderChatLogo />
            <span className="text-lg font-semibold">WonderChat</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              className="hover:primary-text text-sm font-normal leading-normal transition-colors"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="hover:primary-text text-sm font-normal leading-normal transition-colors"
              href="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="hover:primary-text text-sm font-normal leading-normal transition-colors"
              href="/contact"
            >
              Contact Us
            </Link>
            <Link
              className="hover:primary-text text-sm font-normal leading-normal transition-colors"
              href="/parent-portal"
            >
              Parent Portal
            </Link>
          </nav>
          <p className="text-sm font-normal leading-normal text-center md:text-left">
            © {currentYear} WonderChat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
