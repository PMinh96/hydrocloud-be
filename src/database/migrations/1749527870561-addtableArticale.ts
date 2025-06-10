import { MigrationInterface, QueryRunner } from "typeorm";

export class AddtableArticale1749527870561 implements MigrationInterface {
    name = 'AddtableArticale1749527870561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_product\` (\`id\` varchar(36) NOT NULL, \`product_id\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`product_price\` int NOT NULL, \`discount_product\` int NOT NULL, \`order_id\` varchar(255) NOT NULL, \`total_product_price\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_at\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`order_product\``);
    }

}
