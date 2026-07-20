import type { Customer } from "@/fixtures";

/**
 * VAT treatment — derived live from a customer's country + VAT id.
 * ---------------------------------------------------------------------------
 * The tiny rule (not hardcoded per customer):
 *   - Italy                         -> domestic IVA 22% applicata
 *   - foreign WITH a VAT id (EU B2B) -> reverse charge (art. 41), IVA non applicata
 *   - foreign WITHOUT a VAT id       -> generic operazione estera (verify regime)
 *
 * In a real system EU membership would be validated (VIES); for this demo the
 * only foreign customer is an EU distributore with a VAT id, so "has VAT id"
 * stands in for "EU B2B". `applied` drives the badge colour.
 */
export interface VatTreatment {
  title: string;
  detail: string;
  applied: boolean; // true when Italian VAT is charged
}

export function vatTreatment(customer: Customer): VatTreatment {
  const isItaly = customer.country.trim().toLowerCase() === "italia";

  if (isItaly) {
    return {
      title: "IVA 22% applicata",
      detail: "Operazione nazionale (Italia).",
      applied: true,
    };
  }

  if (customer.vatId) {
    return {
      title: "Inversione contabile (reverse charge) — art. 41",
      detail: `IVA non applicata. Cessione intracomunitaria B2B verso ${customer.country}, partita IVA ${customer.vatId}.`,
      applied: false,
    };
  }

  // Foreign customer without a VAT id — handled gracefully.
  return {
    title: "Operazione estera — IVA non applicata",
    detail: `Cliente estero (${customer.country}) senza partita IVA: verificare il regime applicabile.`,
    applied: false,
  };
}
