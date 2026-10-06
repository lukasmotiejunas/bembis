// Vieši standartiniai tarifai; individualiam objektui suderinamas galutinis pasiūlymas.
export const pricing = {
  /** Montavimas IR nuėmimas po sezono su mūsų lemputėmis, €/m. */
  installPerMeter: 3.99,
  /** Montavimas IR nuėmimas po sezono su kliento lemputėmis, €/m. */
  clientLightsPerMeter: 5.99,
  rentalPerMeter: { xp: 2.99, llinks: 4.49 },
  /** Vartotojo patvirtintas nemokamas prekių pristatymas. null būtų dar nesuderintas tarifas. */
  deliveryFee: 0 as number | null,
  deliveryArea: "Vilnius ir Vilniaus apskritis",
};
