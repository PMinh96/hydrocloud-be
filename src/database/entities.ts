import { Customer } from "src/customer/entities/customer.entity";
import { Product } from "src/product/entities/product.entity";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { User } from "src/users/entity/user.entity";

export const entities = [
	Tenant,
	User,
	Product,
	Customer
]