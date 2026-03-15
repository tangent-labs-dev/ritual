import { getQuoteForDate } from "@/constants/quotes";

export function DailyQuote() {
  const quote = getQuoteForDate(new Date());

  return (
    <section className="quote-card">
      <span className="quote-card__eyebrow">Quote</span>
      <p className="quote-card__text">{quote.text}</p>
      <span className="quote-card__author">{quote.author}</span>
    </section>
  );
}
