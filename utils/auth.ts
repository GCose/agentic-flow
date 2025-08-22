export const loggedInUser = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  const user = localStorage.getItem("agentic_flow_user");
  if (!user) return null;
  return JSON.parse(user);
};
