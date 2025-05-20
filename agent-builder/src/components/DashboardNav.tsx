import Link from 'next/link';

export default function DasboardNav() {
    const navLinks = [
        {name: 'Home', href: '/dashboard'},
        {name: 'Agents', href: '/agents'}
    ];

    return (
        <nav className="bg-gray-100 p-4 mb-6 border-b border-gray-300">
          <ul className="flex list-none space-x-6 m-0 p-0">
            {navLinks.map((link) => {
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`
                      text-blue-600 hover:text-blue-800 font-medium no-underline
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      );
}