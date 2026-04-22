# SquadSync — Stack Decision

## Status: PARTIAL

## Decided
| Layer    | Technology | Status   |
|----------|------------|----------|
| Frontend | React      | ✅ Locked |
| Backend  | TBD        | ⏳ Pending |
| Database | TBD        | ⏳ Pending |
| Auth     | TBD        | ⏳ Pending |

## Backend Options
| Option | Language | Best For |
|--------|----------|----------|
| Express.js | JavaScript | Same lang as React, fast setup |
| FastAPI | Python | If team knows Python |
| Spring Boot | Java | Enterprise-level structure |

## Database Options
| Option | Type | Best For |
|--------|------|----------|
| PostgreSQL | SQL | Complex queries, relations |
| MySQL | SQL | Simple, widely known |
| MongoDB | NoSQL | Flexible/unstructured data |

## Decision Checklist
- [x] Frontend → React
- [ ] Backend framework
- [ ] Database
- [ ] Auth strategy
