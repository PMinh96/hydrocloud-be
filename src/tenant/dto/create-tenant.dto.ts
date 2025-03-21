export class CreateTenantDto {
    name: string;
    address: string;
    picture: string;
    phone_number: string;
    rented_from: Date;
    rented_until: Date;
    admin_password: string;
}
