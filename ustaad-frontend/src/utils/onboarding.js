export const ONBOARDING_PATHS = [
  "/profile",
  "/assessment",
  "/personal-plan",
  "/meet-tutor",
];

export function getOnboardingPath(user) {
  if (user?.role === "admin" || user?.role === "parent") return null;
  if (!user?.name) return "/profile";
  if (!user?.assessment?.total) return "/assessment";
  if (!user?.onboardingComplete) {
    if (!user?.planViewed) return "/personal-plan";
    return "/meet-tutor";
  }
  return null;
}

export function isOnboardingRoute(pathname) {
  return ONBOARDING_PATHS.includes(pathname);
}
