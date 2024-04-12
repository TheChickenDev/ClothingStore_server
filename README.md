# ClothingStore_server

- **Base URL**: _host/api/_
- **Authorization**: _headers.authorization = Bearer ...jwt_
1. User:
2. Product:
   ```
   * Get products: _product/getAll_
      - Params (optional):
        + limit: number
        + page: number
        + sort_by: "price" | "view" | "sold" | "rating"
        + order: "asc" | "desc"
        + price_min: number
        + price_max: number
        + rating_filter: number (gte)
        + name: string
      - Authorization is not required
   ```
   ```
    * Get product by id: _product/get-by-id_
      - Params (required): id
      - Authorization is not required
   ```
4. Order:
