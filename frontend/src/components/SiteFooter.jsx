import { Link } from 'react-router-dom'

const footerLinks = {
  Categories: [
    { label: 'Pizza Delivery', path: '/browse?category=Pizza' },
    { label: 'Burgers & Fast Food', path: '/browse?category=Burgers' },
    { label: 'Healthy & Salads', path: '/browse?category=Salads' },
    { label: 'Desserts & Bakery', path: '/browse?category=Desserts' },
  ],
  QuickBite: [
    { label: 'About Us', path: '/info/about-us' },
    { label: 'Delivery Areas', path: '/info/delivery-areas' },
    { label: 'Help Centre', path: '/info/help-centre' },
    { label: 'Careers', path: '/info/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/info/privacy-policy' },
    { label: 'Terms of Service', path: '/info/terms-of-service' },
    { label: 'Contact', path: '/info/contact' },
    { label: 'Cookie Policy', path: '/info/cookie-policy' },
  ],
}

function SiteFooter() {
  return (
    <footer className="bg-gray-50 mt-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-bold text-red-600 text-lg">QuickBite</p>
          <p className="mt-2 text-gray-500">
            Bringing the best local flavours straight to your door.
          </p>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <p className="font-semibold mb-2">{heading}</p>
            <ul className="space-y-1 text-gray-500">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 pb-6">
        © 2024 QuickBite Delivery. All rights reserved.
      </p>
    </footer>
  )
}

export default SiteFooter
