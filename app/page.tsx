import Link from 'next/link';

export default function Home() {
  return (
    <main className="text-sky-500">
      <p>Welcome to the home page</p>
      <Link href="/catalogue">Catalogue</Link>
    </main>
  );
}
