export const loggedInUser = () => {
  const user = localStorage.getItem("agentic_flow_user");

  if (!user) return null;

  return JSON.parse(user);
};
