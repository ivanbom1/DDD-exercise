/*  USER REGISTRATION   */
type Brand<K, T> = K & { __brand: T }
type Name = Brand<string, "Name">
type Email = Brand<string, "Email">
type Phone = Brand<string, "Phone">
type Password = Brand<string, "Password">

const makeName = (name: string): Name => {
    if (!name || name.trim().length < 2 || name.trim().length > 50)
        throw new Error("Name must be 2-50 characters")
    if (/[^a-zA-Z\s\-]/.test(name))
        throw new Error("Name contains invalid characters")
    return name.trim() as Name
}

const makeEmail = (email: string): Email => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error(`Invalid email: ${email}`)
    return email.toLowerCase() as Email
}

const makePhone = (phone: string): Phone => {
    if (!phone || !/^(06|07)\d{8}$/.test(phone))
        throw new Error(`Invalid French phone: ${phone}`)
    return phone as Phone
}

const makePassword = (password: string): Password => {
    if (!password || password.length < 8)
        throw new Error("Password must be at least 8 characters")
    return password as Password
}

type User = {
    name: Name
    email: Email
    phone: Phone
    password: Password
}

type createUserInput = {
    name: string
    email: string
    phone: string
    password: string
}

const createUser = ({
    name,
    email,
    phone,
    password,
}: createUserInput): User => ({
    name: makeName(name),
    email: makeEmail(email),
    phone: makePhone(phone),
    password: makePassword(password),
})

// CAREFUL ! This function is very flexible but also very error-prone. It accepts any strings !

const testCases = [
    { name: "Alice Dupont", email: "alice@example.com", phone: "0612345678", password: "secret123" },
    { name: "B",            email: "alice@example.com", phone: "0612345678", password: "secret123" }, // name too short
    { name: "Bob",          email: "not-an-email",      phone: "0612345678", password: "secret123" }, // bad email
    { name: "Charlie",      email: "c@c.com",           phone: "123",        password: "secret123" }, // bad phone
    { name: "Diana",        email: "d@d.com",           phone: "0698765432", password: "123"       }, // weak password
]

for (const t of testCases) {
    try {
        const user = createUser(t)
        console.table(user)
    } catch (error) {
        console.log("Rejected:", (error as Error).message)
    }
}

// TODO: 1. Type checks
// TODO: 2. Validation checks (Factory Functions) return Phone Type with a simple string (weak validation)
// TODO: 3. try-catch blocks around the calls to createPhone to handle potential validation errors gracefully, ensuring that the application can respond appropriately to invalid inputs without crashing.
// TODO: 4. Branded Types to prevent accidental misuse of the createUser function with raw strings, enhancing type safety in the restaurant domain.
/*
-----   Factory Functions  -----
const makeName()
const makeEmail()
const makePhone()
const makePassword()
*/
// Validation Rules for createUser:
// - name: Must be a non-empty string, typically 2-50 characters, no special characters except spaces/hyphens
// - email: Must follow valid email format (local@domain.tld), cannot be empty
// - phone: Already validated by createPhone factory (French format: 10 digits, valid prefix)
// - socialSecurityNumber: Must follow a specific format (depends on country - length, structure, checksum)
//   * Could be validated as a Value Object similar to Phone
//   * Should not be stored as plain string in production (PII/security concern)
// - All fields: Should check for null/undefined
// - Business rule: User must have unique email (typically checked against database)
// Branded Types:
// - Name: string & { readonly __brand: unique symbol }
// - Email: string & { readonly __brand: unique symbol }
// - Phone: string & { readonly __brand: unique symbol }
// - Password: string & { readonly __brand: unique symbol }
// - SocialSecurityNumber: string & { readonly __brand: unique symbol }