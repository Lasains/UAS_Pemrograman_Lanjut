# Auth Form Validation & Requests

> 26 nodes · cohesion 0.10

## Key Concepts

- **LoginRequest** (9 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **LoginRequest.php** (8 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **Illuminate\Support\Str** (6 connections)
- **ProfileUpdateRequest.php** (5 connections) — `app/Http/Requests/ProfileUpdateRequest.php`
- **ProfileUpdateRequest** (5 connections) — `app/Http/Requests/ProfileUpdateRequest.php`
- **UserFactory.php** (5 connections) — `database/factories/UserFactory.php`
- **UserFactory** (4 connections) — `database/factories/UserFactory.php`
- **Illuminate\Foundation\Http\FormRequest** (4 connections)
- **.authenticate()** (3 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **.ensureIsNotRateLimited()** (3 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **.throttleKey()** (3 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **.definition()** (2 connections) — `database/factories/UserFactory.php`
- **.unverified()** (2 connections) — `database/factories/UserFactory.php`
- **Illuminate\Contracts\Validation\ValidationRule** (2 connections)
- **Illuminate\Database\Eloquent\Factories\Factory** (2 connections)
- **static** (2 connections)
- **.authorize()** (1 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **.rules()** (1 connections) — `app/Http/Requests/Auth/LoginRequest.php`
- **.rules()** (1 connections) — `app/Http/Requests/ProfileUpdateRequest.php`
- **cache.php** (1 connections) — `config/cache.php`
- **database.php** (1 connections) — `config/database.php`
- **session.php** (1 connections) — `config/session.php`
- **{closure#1}()** (1 connections) — `database/factories/UserFactory.php`
- **Illuminate\Auth\Events\Lockout** (1 connections)
- **Illuminate\Support\Facades\RateLimiter** (1 connections)
- *... and 1 more nodes in this community*

## Relationships

- [Auth & Session Controllers](Auth_&_Session_Controllers.md) (8 shared connections)
- [User Models & Seeder Orchestration](User_Models_&_Seeder_Orchestration.md) (1 shared connections)

## Source Files

- `app/Http/Requests/Auth/LoginRequest.php`
- `app/Http/Requests/ProfileUpdateRequest.php`
- `config/cache.php`
- `config/database.php`
- `config/session.php`
- `database/factories/UserFactory.php`

## Audit Trail

- EXTRACTED: 42 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*