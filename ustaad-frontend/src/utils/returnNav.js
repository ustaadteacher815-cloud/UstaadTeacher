export function getReturnNav(location, fallback = { to: "/dashboard", label: "Back to Home" }) {
  const returnTo = location.state?.returnTo || fallback.to;
  const returnLabel = location.state?.returnLabel || fallback.label;
  const navState = location.state?.returnTo
    ? { returnTo: location.state.returnTo, returnLabel: location.state.returnLabel }
    : undefined;

  return { returnTo, returnLabel, navState };
}
