export const RSVP_LIMITS = {
  name: { min: 1, max: 20 },
  phone: { min: 6, max: 15 },
  message: { max: 200 },
};

export function clampRsvpField(key, value) {
  if (typeof value !== "string") {
    return value;
  }

  switch (key) {
    case "name":
      return value.slice(0, RSVP_LIMITS.name.max);
    case "phone":
      return value.slice(0, RSVP_LIMITS.phone.max);
    case "message":
      return value.slice(0, RSVP_LIMITS.message.max);
    default:
      return value;
  }
}
