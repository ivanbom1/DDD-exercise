import { logError } from "./logger.js"

// ============================================================================
// EXERCISE 2: Primitive Obsession - The Quantity Disaster
//
// ANTI-PATTERN: Using a raw `number` for quantity. Accepts zero, negatives,
// floats (2.5 pizzas?), and absurd values (50,000 coffees).
//
// DDD FIX: Create a Quantity Value Object with domain constraints.
// Business rules belong INSIDE the type, not scattered across the codebase.
//
// HINT - Smart Constructor pattern:
//   type Quantity = number & { readonly __brand: unique symbol }
//   function createQuantity(n: number): Quantity {
//       if (!Number.isInteger(n)) throw new Error("Quantity must be a whole number")
//       if (n <= 0) throw new Error("Quantity must be positive")
//       if (n > 100) throw new Error("Quantity exceeds maximum per order")
//       return n as Quantity
//   }
//
// KEY INSIGHT: The upper bound (100) is a business rule, not an arbitrary
// limit. In DDD, domain experts define these constraints. Your code should
// make them explicit and impossible to bypass.
// ============================================================================
type Brand<K, T> = K & { __brand: T }
type Quantity = Brand<number, "Quantity">

export function createQuantity(n: number): Quantity {
    if (!Number.isInteger(n)) throw new Error("Quantity must be a whole number")
	if (n <= 0) throw new Error("Quantity must be positive")
    if (n > 100) throw new Error("Quantity exceeds maximum per order")
    	return n as Quantity
   }

export function exercise2_PrimitiveQuantity() {
	type Order = {
		itemName: string
		quantity: Quantity // Could be 0, negative, or absurdly high!
		pricePerUnit: number
	}

		try {
		const order: Order = {
			itemName: "Pizza",
			quantity: createQuantity(-3),
			pricePerUnit: 15,
		}

		// TODO: Replace `number` with a Quantity branded type.
		// Both of the bugs below should become impossible:
		//   quantity: -3       // <-- negative
		//   quantity: 50000    // <-- exceeds business limit

		logError(2, "Negative quantity allowed", {
			order,
			calculatedTotal: order.quantity * order.pricePerUnit,
			issue: "Quantity should be a positive integer!",
		})
			} catch (error) {
		logError(2, "Negative quantity correctly rejected", {
			issue: (error as Error).message,
		})
	}

	// Another silent bug - absurd quantity
	try {
		const bulkOrder: Order = {
			itemName: "Coffee",
			quantity: createQuantity(50000), // Silent bug! Unrealistic quantit
			pricePerUnit: 3,
		}
		logError(2, "Absurd quantity accepted", {
			order: bulkOrder,
			calculatedTotal: bulkOrder.quantity * bulkOrder.pricePerUnit,
			issue: "Should we really accept 50,000 coffees?",
		})
			} catch (error) {
		logError(2, "Absurd quantity correctly rejected", {
			issue: (error as Error).message,
		})
	}
}
