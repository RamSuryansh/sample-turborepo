import { formatCurrencyFromInr, formatDateInTimeZone } from "@local/utils";

const publishedAt = new Date("2026-05-28T09:00:00+05:30");
const publishedDate = formatDateInTimeZone(publishedAt, "Asia/Kolkata");

const metalTypes = [
  {
    name: "Gold types",
    accent: "bg-amber-400",
    items: [
      {
        label: "24K gold",
        copy: "Nearly pure gold, prized for coins and bars, but softer for everyday jewellery.",
      },
      {
        label: "22K gold",
        copy: "A durable jewellery choice with a high gold share and a warm yellow finish.",
      },
      {
        label: "18K gold",
        copy: "Gold blended with other metals for stronger rings, watches, and modern designs.",
      },
    ],
  },
  {
    name: "Silver types",
    accent: "bg-cyan-300",
    items: [
      {
        label: "Fine silver",
        copy: "Very high purity silver, often used in bars, coins, and collectible pieces.",
      },
      {
        label: "Sterling silver",
        copy: "A practical 92.5 percent silver alloy used for jewellery and tableware.",
      },
      {
        label: "Oxidised silver",
        copy: "Sterling silver with a darker finish that highlights carved or antique detail.",
      },
    ],
  },
];

const products = [
  {
    name: "24K Gold Coin",
    metal: "Gold",
    detail: "5 gram minted coin",
    priceInr: 38450,
  },
  {
    name: "22K Gold Chain",
    metal: "Gold",
    detail: "Classic daily wear",
    priceInr: 74200,
  },
  {
    name: "Sterling Silver Kada",
    metal: "Silver",
    detail: "925 silver bracelet",
    priceInr: 6200,
  },
  {
    name: "Silver Puja Bowl",
    metal: "Silver",
    detail: "Small hammered bowl",
    priceInr: 3450,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-zinc-950">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <article className="rounded-lg border border-zinc-200 bg-white px-5 py-7 shadow-sm sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase text-teal-700">
            Precious metals
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            Gold and Silver: a short guide to popular types
          </h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
            <span>Published {publishedDate}</span>
            <span className="text-zinc-300">/</span>
            <span>4 minute read</span>
          </div>

          <p className="mt-8 text-lg leading-8 text-zinc-700">
            Gold and silver both work as jewellery, gifts, heirlooms, and
            investment-linked purchases. The main difference for a buyer is
            purity: higher purity usually means richer metal content, while
            alloys can improve strength, finish, and daily wear.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {metalTypes.map((section) => (
              <section
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-5"
                key={section.name}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`h-3 w-3 rounded-full ${section.accent}`}
                  />
                  <h2 className="text-xl font-semibold text-zinc-950">
                    {section.name}
                  </h2>
                </div>
                <div className="mt-5 space-y-5">
                  {section.items.map((item) => (
                    <div key={item.label}>
                      <h3 className="font-semibold text-zinc-900">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        {item.copy}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg border border-teal-100 bg-teal-50 p-5">
            <h2 className="text-xl font-semibold text-zinc-950">
              Simple buying note
            </h2>
            <p className="mt-3 leading-7 text-zinc-700">
              For gold, choose 24K when the goal is purity and 22K or 18K when
              the piece needs more strength. For silver, sterling silver is the
              familiar everyday option, while fine silver is usually better for
              coins, bars, and display pieces.
            </p>
          </section>
        </article>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Dummy products
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
                Gold and silver picks
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              {products.map((product) => (
                <div
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                  key={product.name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-zinc-950">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {product.detail}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2.5 py-1 text-xs font-semibold ${
                        product.metal === "Gold"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {product.metal}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-2xl font-semibold text-zinc-950">
                      {formatCurrencyFromInr(product.priceInr, "INR")}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {formatCurrencyFromInr(product.priceInr, "USD")} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
