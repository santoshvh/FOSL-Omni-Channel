import Link from "next/link";
import { products } from "@fosl/mocks";
import { Button } from "@fosl/ui";
import { creatorHighlights, externalLinks, featuredBlogPosts } from "@/lib/foslone";
import { ProductCatalogCard } from "@/components/product-catalog-card";
import { Users, Store, ShoppingBag, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero — foslone.com */}
      <section className="bg-gradient-to-br from-[#2E75B6] to-blue-900 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-200">
            Incubated by AIOne
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Our business is to support communities with a social eCommerce solution
            by incubating startup companies
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Incubated by AIOne — social eCommerce for vendors, Creators, and operators
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/marketplace">Marketplace</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-[#2E75B6] hover:bg-blue-50">
              <a href={externalLinks.signupCreator} target="_blank" rel="noopener noreferrer">
                Sign up as a Creator
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Creator / Seller / Buyers */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/creator-support"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#2E75B6] hover:shadow-md"
          >
            <Users className="h-10 w-10 text-[#2E75B6]" />
            <h2 className="mt-4 text-xl font-bold">Creator</h2>
            <p className="mt-2 text-sm text-slate-600">
              Earn commissions promoting seller products across our eCommerce communities.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-[#2E75B6] group-hover:underline">
              Read more →
            </span>
          </Link>
          <Link
            href="/incubations"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#2E75B6] hover:shadow-md"
          >
            <Store className="h-10 w-10 text-[#2E75B6]" />
            <h2 className="mt-4 text-xl font-bold">Seller focused</h2>
            <p className="mt-2 text-sm text-slate-600">
              Incubated startups list products and grow sales through the Creator network.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-[#2E75B6] group-hover:underline">
              Read more →
            </span>
          </Link>
          <Link
            href="/products"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#2E75B6] hover:shadow-md"
          >
            <ShoppingBag className="h-10 w-10 text-[#2E75B6]" />
            <h2 className="mt-4 text-xl font-bold">Buyers</h2>
            <p className="mt-2 text-sm text-slate-600">
              Shop physical, digital, and lead-gen products from trusted vendors.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-[#2E75B6] group-hover:underline">
              Read more →
            </span>
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-slate-700 leading-relaxed">
            Our company supports the idea that revenues, sponsorship dollars, and subscriptions
            are shared more equitably among content creators, influencers, and others — within a
            decentralized internet economy where all engaged participants benefit.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/contact">Let&apos;s Connect</Link>
          </Button>
        </div>
      </section>

      {/* Prosperity */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">More sales, employment &amp; prosperity</h2>
        <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
          We provide opportunities for people to sell products and services in the many eCommerce
          communities we continue to build. Anyone can become a Creator to earn sales commissions
          on seller products they promote. As Creators drive sales, more Sellers join — creating
          a flywheel of growth for Sellers and Creators alike.
        </p>
      </section>

      {/* Creator program */}
      <section className="border-y border-slate-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-[#2E75B6]" />
            <div>
              <h2 className="text-2xl font-bold">Creator program</h2>
              <p className="text-slate-600">Promote products. Earn commissions. Grow communities.</p>
            </div>
          </div>
          <p className="mt-4 text-slate-600">
            Welcome the largest workforce in the making. Creators use social media content to
            naturally influence sales.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {creatorHighlights.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                <span className="text-[#2E75B6]">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 italic text-slate-500">
            &ldquo;Power to All&rdquo; — industry leaders on the Creator economy
          </p>
          <Button asChild className="mt-6">
            <a href={externalLinks.signupCreator} target="_blank" rel="noopener noreferrer">
              Sign up as a Creator
            </a>
          </Button>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Our AIOne Team</h2>
            <ul className="mt-4 space-y-3">
              <li className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold">Shiva Balivada</p>
                <p className="text-sm text-slate-500">CEO</p>
              </li>
              <li className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold">Dave Sackett</p>
                <p className="text-sm text-slate-500">CFO</p>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">The FOSLOne Team</h2>
            <ul className="mt-4 space-y-3">
              <li className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold">Scott Livingston</p>
                <p className="text-sm text-slate-500">Principal Advisor</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured product blog */}
      <section className="bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold">Featured product blog</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBlogPosts.map((post) => (
              <article
                key={post.title}
                className="rounded-lg border border-slate-200 bg-white p-5 transition hover:shadow-md"
              >
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{post.date} · Blog</p>
                <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                <Link
                  href="/marketplace"
                  className="mt-3 inline-block text-sm font-medium text-[#2E75B6] hover:underline"
                >
                  Read more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live catalog */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shop now</h2>
          <Link href="/products" className="text-sm text-[#2E75B6] hover:underline">
            View all products
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCatalogCard key={p.id} product={p} layout="grid" />
          ))}
        </div>
      </section>
    </div>
  );
}
