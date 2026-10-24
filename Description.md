## The five tests
1. Register a new customer: a unique new account is created and the user ends
   up signed in or on the login page.
2. Log in: valid credentials reach the account page; invalid ones show the
   error and do not reach it.
3. Buy a product: add to cart, the cart shows the right item and quantity,
   checkout completes.
4. Compare two products: open two products, capture name and price, and
   assert the comparison I state. The Toolshop has no compare feature, so the
   test performs the comparison itself. Choose a clear, explicit comparison
   (for example, which product is cheaper, or that the two prices differ)
   and document the choice in the README.
5. Reset a password: the forgot-password flow shows the expected confirmation
   for a known email and an error for an invalid one. The hosted site cannot
   show a reset email, so assert only the observable UI outcome.