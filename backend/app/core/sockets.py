from fastapi import WebSocket
from typing import Dict, Set
import json
from loguru import logger


class ConnectionManager:
    def __init__(self):
        # project_id -> set of active websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # project_id -> {user_id: is_typing}
        self.typing_users: Dict[str, Dict[str, bool]] = {}

    async def connect(self, websocket: WebSocket, project_id: str):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = set()
        self.active_connections[project_id].add(websocket)
        logger.info(
            f"New WebSocket connection for project {project_id}. "
            f"Total: {len(self.active_connections[project_id])}"
        )

    def disconnect(self, websocket: WebSocket, project_id: str):
        if project_id in self.active_connections:
            self.active_connections[project_id].discard(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]
        logger.info(f"WebSocket disconnected for project {project_id}")

    async def broadcast_to_project(self, project_id: str, message: dict):
        if project_id not in self.active_connections:
            return
        stale: Set[WebSocket] = set()
        for connection in self.active_connections[project_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to socket: {e}")
                stale.add(connection)
        for ws in stale:
            self.active_connections[project_id].discard(ws)

    async def update_typing_status(
        self, project_id: str, user_id: str, user_name: str, is_typing: bool
    ):
        if project_id not in self.typing_users:
            self.typing_users[project_id] = {}
        self.typing_users[project_id][user_id] = is_typing

        await self.broadcast_to_project(
            project_id,
            {
                "type": "typing_update",
                "user_id": user_id,
                "user_name": user_name,
                "is_typing": is_typing,
            },
        )


manager = ConnectionManager()
