import Link from "next/link";
import Image from "next/image";
import { products } from "@fosl/mocks";
import { Button } from "@fosl/ui";
import {
  creatorHighlights,
  externalLinks,
  featuredBlogPosts,
  fosloneImages,
  homeAudienceCards,
  teamMembers,
} from "@/lib/foslone";
import { ProductCatalogCard } from "@/components/product-catalog-card";
import { Sparkles, ArrowRight, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero — full-bleed background */}
      <section className="relative isolate min-h-[min(88vh,720px)] overflow-hidden">
        <Image
          src={fosloneImages.heroMain}
          alt="Woman shopping online at home with laptop and credit card"
          fill
          priority
          className="object-cover object-[65%_center] sm:object-[72%_center] lg:object-right lg:object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-surface from-35% via-surface/90 via-50% to-surface/10 lg:from-30% lg:via-45%"
          aria-hidden
        />
        <div className="ecom-container relative z-10 flex min-h-[min(88vh,720px)] items-center py-14 lg:py-20">
          <div className="max-w-xl">
            <span className="ecom-pill">Incubated by AIOne</span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Our business is to support communities with a social eCommerce solution
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              By incubating startup companies — shop, sell, or promote as a Creator and earn on
              every sale across the FOSLOne network.
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
        </div>
      </section>

      {/* Audience cards — site section art */}
      <section className="ecom-container py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {homeAudienceCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
            >
              <div className="relative h-40 bg-primary-muted">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-contain p-4 transition group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-ink">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-primary-dark">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
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
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="ecom-section-title">More sales, employment &amp; prosperity</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We provide opportunities for people to sell products and services in the many
              eCommerce communities we continue to build. Anyone can become a Creator to earn sales
              commissions on seller products they promote.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              As Creators help Sellers with new sales, more Sellers join the network — a flywheel
              of growth for Sellers and Creators alike.
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image
              src={fosloneImages.sectionSales}
              alt="Sales growth illustration"
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>
        </div>
      </section>

      {/* Creator program */}
      <section className="border-y border-slate-100 bg-surface px-4 py-14">
        <div className="ecom-container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="ecom-section-title">Creator program</h2>
            <p className="mt-2 text-slate-600">
              Welcome the largest workforce in the making. Creators use social media content to
              naturally influence sales.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-1">
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
            <p className="mt-4 text-sm italic text-slate-500">
              &ldquo;Power to All&rdquo; — industry leaders on the Creator economy
            </p>
            <Button asChild className="mt-6">
              <a href={externalLinks.signupCreator} target="_blank" rel="noopener noreferrer">
                Sign up as a Creator
              </a>
            </Button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <Image
              src={fosloneImages.sectionCreator}
              alt="Creator network illustration"
              fill
              className="object-contain"
              sizes="500px"
            />
          </div>
        </div>
      </section>

      {/* Team — 2/3 AIOne + 1/3 FOSLOne, equal card sizes */}
      <section className="ecom-container py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <h2 className="ecom-section-title text-center lg:col-span-2 lg:text-left">
            Our AIOne Team
          </h2>
          <h2 className="ecom-section-title text-center lg:text-left">The FOSLOne Team</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...teamMembers.aione, ...teamMembers.foslone].map((person) => (
            <article key={person.name} className="ecom-card flex h-full flex-col overflow-hidden">
              <div className="relative aspect-square bg-slate-50">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-5 text-center">
                <h3 className="text-lg font-bold text-ink">{person.name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{person.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="bg-surface px-4 py-14">
        <div className="ecom-container">
          <h2 className="ecom-section-title">Featured product blog</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBlogPosts.map((post) => (
              <article key={post.title} className="ecom-card overflow-hidden">
                <div className="relative aspect-square bg-slate-50">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-ink">{post.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{post.date} · Blog</p>
                  <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                  <Link
                    href="/marketplace"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary-dark"
                  >
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
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
