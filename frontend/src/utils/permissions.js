export function isSuperAdmin(user) {
  return user?.role === "super_admin" || user?.role === "admin";
}

export function projectRole(project, user) {
  if (!project || !user) return null;
  if (isSuperAdmin(user)) return "super_admin";
  if (project.owner_id === user.id) return "admin";
  const membership = (project.members || []).find((member) => member.user_id === user.id);
  if (membership) return membership.role;
  if ((project.member_ids || []).includes(user.id)) return "member";
  return null;
}

export function isProjectAdmin(project, user) {
  const role = projectRole(project, user);
  return role === "super_admin" || role === "admin";
}

export function isProjectMember(project, user) {
  return Boolean(projectRole(project, user));
}

export function projectMemberIds(project) {
  return [
    ...new Set([
      ...(project?.member_ids || []),
      ...(project?.members || []).map((member) => member.user_id),
      project?.owner_id,
    ].filter(Boolean)),
  ];
}
