# SquadSync — Stack Decision

## Status: DECIDED ✅

## Final Stack
| Layer    | Technology      | Status   |
|----------|-----------------|----------|
| Frontend | React           | ✅ Locked |
| Backend  | Python (FastAPI)| ✅ Locked |
| Database | SQLite          | ✅ Locked |
| Auth     | JWT             | ✅ Locked |

## Notes
- SQLite is used for simplicity in development
- Can be migrated to PostgreSQL for production later
- Database file stored at `backend/data/squadsync.db`
- Never commit the `.db` file

## API Docs
When running locally:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
