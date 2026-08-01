'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

const SMARTSUPP_KEY = '04a7cd559ae1d7a0a67514119cf55400686014a1'

export function SmartSuppChat() {
  const pathname = usePathname()

  const shouldLoad = !pathname?.startsWith('/dashboard') && !pathname?.startsWith('/admin')

  if (!shouldLoad) {
    return null
  }

  return (
    <Script id="smartsupp-loader" strategy="afterInteractive">
      {`
        (function() {
          window._smartsupp = window._smartsupp || {};
          window._smartsupp.key = '${SMARTSUPP_KEY}';
          window.smartsupp = window.smartsupp || function() {
            (window.smartsupp._ = window.smartsupp._ || []).push(arguments);
          };
          window.smartsupp._ = window.smartsupp._ || [];

          if (document.getElementById('smartsupp-script')) return;

          var s = document.getElementsByTagName('script')[0];
          var c = document.createElement('script');
          c.id = 'smartsupp-script';
          c.type = 'text/javascript';
          c.charset = 'utf-8';
          c.async = true;
          c.src = 'https://www.smartsuppchat.com/loader.js?';
          s.parentNode.insertBefore(c, s);
        })();
      `}
    </Script>
  )
}
