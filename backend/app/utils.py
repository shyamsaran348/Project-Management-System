"""
Shared utility helpers used across multiple route modules.
Extracted to avoid duplication between projects.py and rag.py.
"""
from app.models.project import Project
from app.models.user import User


def get_link_id(link_obj):
    """
    Resolve the ID from a Beanie Link or raw dict reference.
    Returns the raw PydanticObjectId (or None).
    """
    if link_obj is None:
        return None
    if hasattr(link_obj, "id"):
        return link_obj.id
    if hasattr(link_obj, "ref") and hasattr(link_obj.ref, "id"):
        return link_obj.ref.id
    if isinstance(link_obj, dict):
        return link_obj.get("$id") or link_obj.get("_id") or link_obj.get("id")
    return None


def is_project_participant(project: Project, current_user: User) -> bool:
    """Return True if the user is the owning faculty OR a team member/leader."""
    if get_link_id(project.faculty) == current_user.id:
        return True
    if not project.team:
        return False
    if get_link_id(project.team.leader) == current_user.id:
        return True
    for member in project.team.members or []:
        if get_link_id(member) == current_user.id:
            return True
    return False
