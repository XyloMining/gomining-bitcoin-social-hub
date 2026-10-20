/**
 * Base rates for the GoMining calculator, derived from the owner's own income export
 * (2026-01-01 to 2026-10-19, 330 rows). Checked against the data:
 *  - C2 (service) = $0.0089 per TH per day x (1 - total discount), matched on every row.
 *  - C1 (electricity) = TH x W/TH x 24 / 1000 x $0.05 per kWh x (1 - total discount).
 *    The export implies a $0.05 per kWh rate at 15 W/TH (main fleet) and 20 W/TH (older miners).
 * Total discount in the export is the sum of four parts: paying in GOMINING, a daily
 * maintenance discount, the VIP level discount and the reward distribution discount.
 * The calculator takes one combined discount, and the real value varies per account.
 */
export const GOMINING_RATES = {
  placeholder: false,
  electricityPerKwh: 0.05,
  servicePerThDay: 0.0089,
  source: "Derived from the owner's GoMining income export, Jan to Oct 2026",
};

/** Discount parts seen in the export, for the helper text. Ranges are what the data showed. */
export const DISCOUNT_PARTS = [
  { label: "Paying maintenance in GOMINING", range: "0% to 20%" },
  { label: "Daily maintenance discount", range: "about 3%" },
  { label: "VIP level discount", range: "about 1% to 1.5%" },
  { label: "Reward distribution discount", range: "0% to 1.5%" },
];
