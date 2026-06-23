import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold">Get in touch</h1>
      <p className="mt-2 text-slate-600">
        Connect with the FOSLOne team — Creators, Sellers, and partners welcome
      </p>
      <ContactForm />
    </div>
  );
}
