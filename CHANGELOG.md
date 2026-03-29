# Changelog

All notable changes to this project will be documented in this file.

## [2026-03-29]
### Fixed
- Removed all data for specific student and counselor accounts from the production database to clean up legacy/test records.
  - Accounts: `abishekhariharan76@gmail.com` and `abiat22005@gmail.com`.
  - Deleted 11 check-ins and 6 support requests.
- Seeded sample interaction data for the same accounts to demonstrate student-counselor features.
  - Accounts: `abishekhariharan76@gmail.com` (Student) and `abiat22005@gmail.com` (Counselor).
  - Added 2 sample check-ins and 2 support requests with responses.
  - Linked the student to the counselor for automatic assignment.

