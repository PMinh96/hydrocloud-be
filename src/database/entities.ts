import { Customer } from "src/customer/entities/customer.entity";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Project } from "src/projects/entities/project.entity";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { User } from "src/users/entity/user.entity";

export const entities = [
	Tenant,
	User,
	Product,
	Customer,
	Order,
	Project,
	Order,
	OrderProduct
	
]