import Link from "next/link";
import Image from "next/image";
import { products } from "@fosl/mocks";
import { Button } from "@fosl/ui";
import { creatorHighlights, externalLinks, featuredBlogPosts } from "@/lib/foslone";
import { ProductCatalogCard } from "@/components/product-catalog-card";
import { Users, Store, ShoppingBag, Sparkles, ArrowRight, Truck } from "lucide-react";

export default function HomePage() {
  const heroProduct = products[0];

  return (
    <div>
      {/* Hero — ecommerce kit style */}
      <section className="relative overflow-hidden bg-surface">
        <div className="ecom-container grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="ecom-pill">Incubated by AIOne</span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Social eCommerce for communities that{" "}
              <span className="relative">
                <span className="relative z-10">grow together</span>
                <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-primary/60" />
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Shop physical, digital, and lead-gen products from incubated sellers — or promote
              as a Creator and earn on every sale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Shop collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/marketplace">Browse marketplace</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary-dark" />
                Fast shipping
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-dark" />
                Creator commissions
              </span>
            </div>
          </div>
          {heroProduct && (
            <div className="relative">
              <div className="absolute -right-6 -top-6 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
              <div className="ecom-card relative overflow-hidden">
                <div className="relative aspect-[4/5] bg-slate-100">
                  <Image
                    src={heroProduct.imageUrl}
                    alt={heroProduct.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Featured
                  </p>
                  <p className="mt-1 text-lg font-bold">{heroProduct.title}</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link href={`/products/${heroProduct.id}`}>View product</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category cards */}
      <section className="ecom-container py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              href: "/creator-support",
              icon: Users,
              title: "Creator",
              desc: "Earn commissions promoting seller products across our eCommerce communities.",
            },
            {
              href: "/incubations",
              icon: Store,
              title: "Seller focused",
              desc: "Incubated startups list products and grow sales through the Creator network.",
            },
            {
              href: "/products",
              icon: ShoppingBag,
              title: "Buyers",
              desc: "Shop physical, digital, and lead-gen products from trusted vendors.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-muted">
                <card.icon className="h-6 w-6 text-ink" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-ink">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-primary-dark">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-ink px-4 py-16 text-white">
        <div className="ecom-container max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-white/80">
            Our company supports the idea that revenues, sponsorship dollars, and subscriptions
            are shared more equitably among content creators, influencers, and others — within a
            decentralized internet economy where all engaged participants benefit.
          </p>
          <Button asChild className="mt-8" variant="secondary">
            <Link href="/contact">Let&apos;s Connect</Link>
          </Button>
        </div>
      </section>

      {/* Prosperity */}
      <section className="ecom-container py-14">
        <h2 className="ecom-section-title">More sales, employment &amp; prosperity</h2>
        <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
          We provide opportunities for people to sell products and services in the many eCommerce
          communities we continue to build. Anyone can become a Creator to earn sales commissions
          on seller products they promote.
        </p>
      </section>

      {/* Creator program */}
      <section className="border-y border-slate-100 bg-surface px-4 py-14">
        <div className="ecom-container">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="ecom-section-title">Creator program</h2>
              <p className="text-slate-600">Promote products. Earn commissions. Grow communities.</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {creatorHighlights.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-card"
              >
                <span className="font-bold text-primary-dark">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6">
            <a href={externalLinks.signupCreator} target="_blank" rel="noopener noreferrer">
              Sign up as a Creator
            </a>
          </Button>
        </div>
      </section>

      {/* Team */}
      <section className="ecom-container py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-ink">Our AIOne Team</h2>
            <ul className="mt-4 space-y-3">
              {[
                { name: "Shiva Balivada", role: "CEO" },
                { name: "Dave Sackett", role: "CFO" },
              ].map((person) => (
                <li key={person.name} className="rounded-xl border border-slate-100 bg-white p-4 shadow-card">
                  <p className="font-semibold text-ink">{person.name}</p>
                  <p className="text-sm text-slate-500">{person.role}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">The FOSLOne Team</h2>
            <ul className="mt-4 space-y-3">
              <li className="rounded-xl border border-slate-100 bg-white p-4 shadow-card">
                <p className="font-semibold text-ink">Scott Livingston</p>
                <p className="text-sm text-slate-500">Principal Advisor</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="bg-surface px-4 py-14">
        <div className="ecom-container">
          <h2 className="ecom-section-title">From the blog</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBlogPosts.map((post) => (
              <article key={post.title} className="ecom-card p-5">
                <h3 className="font-semibold text-ink">{post.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{post.date} · Blog</p>
                <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                <Link
                  href="/marketplace"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary-dark"
                >
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live catalog */}
      <section className="ecom-container py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">New arrivals</p>
            <h2 className="ecom-section-title mt-1">Shop now</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary-dark"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCatalogCard key={p.id} product={p} layout="grid" />
          ))}
        </div>
      </section>
    </div>
  );
}
