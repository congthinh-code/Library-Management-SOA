import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCatalog1794586665466 implements MigrationInterface {
    name = 'InitialCatalog1794586665466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "catalog"."categories" ("category_id" bigint NOT NULL IDENTITY(1,1), "name" nvarchar(100) NOT NULL, "description" nvarchar(500), "created_at" datetime2 NOT NULL CONSTRAINT "DF_a7b2c155b5bad01eb952cf2e562" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_55daad89e067f87627f9f9d8586" DEFAULT getdate(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_51615bef2cea22812d0dcab6e18" PRIMARY KEY ("category_id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."authors" ("author_id" bigint NOT NULL IDENTITY(1,1), "name" nvarchar(150) NOT NULL, "biography" nvarchar(MAX), "created_at" datetime2 NOT NULL CONSTRAINT "DF_ffd1cb2729f2a1a181d12972609" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_563791eed353b387eef4fb44037" DEFAULT getdate(), CONSTRAINT "PK_6842400a659f5909e03305b6ff0" PRIMARY KEY ("author_id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."books" ("book_id" bigint NOT NULL IDENTITY(1,1), "isbn" nvarchar(20), "title" nvarchar(255) NOT NULL, "description" nvarchar(MAX), "publisher" nvarchar(150), "published_year" int, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f64a0961fd3fce334c3f7724628" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_7b4ecfc02a2b3dc095a094960c9" DEFAULT getdate(), "category_id" bigint NOT NULL, CONSTRAINT "PK_552bd343dabd693159e284fe517" PRIMARY KEY ("book_id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."book_authors" ("book_id" bigint NOT NULL, "author_id" bigint NOT NULL, CONSTRAINT "PK_75172094a131109db714f4f2bc7" PRIMARY KEY ("book_id", "author_id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."book_copies" ("copy_id" bigint NOT NULL IDENTITY(1,1), "copy_code" nvarchar(50) NOT NULL, "status" nvarchar(30) NOT NULL CONSTRAINT "DF_040b1ae378f2683ba2fb6d61d03" DEFAULT 'AVAILABLE', "created_at" datetime2 NOT NULL CONSTRAINT "DF_1fac593291b196c00276a5a69d0" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_227137ccbb785b1ee49c6254456" DEFAULT getdate(), "book_id" bigint NOT NULL, CONSTRAINT "UQ_3a244a3e89385c604bf9f60f6f4" UNIQUE ("copy_code"), CONSTRAINT "PK_3253142901507c297a74e263362" PRIMARY KEY ("copy_id"))`);
        await queryRunner.query(`ALTER TABLE "catalog"."books" ADD CONSTRAINT "FK_46f5b35b90175a660f99810bc97" FOREIGN KEY ("category_id") REFERENCES "catalog"."categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."book_authors" ADD CONSTRAINT "FK_1d68802baf370cd6818cad7a503" FOREIGN KEY ("book_id") REFERENCES "catalog"."books"("book_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."book_authors" ADD CONSTRAINT "FK_6fb8ac32a0a0bbca076b2cf7c5a" FOREIGN KEY ("author_id") REFERENCES "catalog"."authors"("author_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."book_copies" ADD CONSTRAINT "FK_d8c3c9e0b8d41aa149ac58f23fe" FOREIGN KEY ("book_id") REFERENCES "catalog"."books"("book_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog"."book_copies" DROP CONSTRAINT "FK_d8c3c9e0b8d41aa149ac58f23fe"`);
        await queryRunner.query(`ALTER TABLE "catalog"."book_authors" DROP CONSTRAINT "FK_6fb8ac32a0a0bbca076b2cf7c5a"`);
        await queryRunner.query(`ALTER TABLE "catalog"."book_authors" DROP CONSTRAINT "FK_1d68802baf370cd6818cad7a503"`);
        await queryRunner.query(`ALTER TABLE "catalog"."books" DROP CONSTRAINT "FK_46f5b35b90175a660f99810bc97"`);
        await queryRunner.query(`DROP TABLE "catalog"."book_copies"`);
        await queryRunner.query(`DROP TABLE "catalog"."book_authors"`);
        await queryRunner.query(`DROP TABLE "catalog"."books"`);
        await queryRunner.query(`DROP TABLE "catalog"."authors"`);
        await queryRunner.query(`DROP TABLE "catalog"."categories"`);
    }

}
