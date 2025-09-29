using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceApi.Migrations
{
    /// <inheritdoc />
    public partial class dtoUpdateMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_payments_insurance_policies_policy_id",
                table: "payments");

            migrationBuilder.DropForeignKey(
                name: "fk_payments_insurance_policies_policy_id1",
                table: "payments");

            migrationBuilder.DropIndex(
                name: "ix_payments_policy_id1",
                table: "payments");

            migrationBuilder.DropColumn(
                name: "policy_id1",
                table: "payments");

            migrationBuilder.RenameColumn(
                name: "policy_id",
                table: "payments",
                newName: "insurance_policy_id");

            migrationBuilder.RenameColumn(
                name: "method",
                table: "payments",
                newName: "payment_method");

            migrationBuilder.RenameIndex(
                name: "ix_payments_policy_id",
                table: "payments",
                newName: "ix_payments_insurance_policy_id");

            migrationBuilder.AddColumn<DateTime>(
                name: "payment_date",
                table: "payments",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "user_id",
                table: "payments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "fk_payments_insurance_policies_insurance_policy_id",
                table: "payments",
                column: "insurance_policy_id",
                principalTable: "insurance_policies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_payments_insurance_policies_insurance_policy_id",
                table: "payments");

            migrationBuilder.DropColumn(
                name: "payment_date",
                table: "payments");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "payments");

            migrationBuilder.RenameColumn(
                name: "payment_method",
                table: "payments",
                newName: "method");

            migrationBuilder.RenameColumn(
                name: "insurance_policy_id",
                table: "payments",
                newName: "policy_id");

            migrationBuilder.RenameIndex(
                name: "ix_payments_insurance_policy_id",
                table: "payments",
                newName: "ix_payments_policy_id");

            migrationBuilder.AddColumn<Guid>(
                name: "policy_id1",
                table: "payments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_payments_policy_id1",
                table: "payments",
                column: "policy_id1");

            migrationBuilder.AddForeignKey(
                name: "fk_payments_insurance_policies_policy_id",
                table: "payments",
                column: "policy_id",
                principalTable: "insurance_policies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_payments_insurance_policies_policy_id1",
                table: "payments",
                column: "policy_id1",
                principalTable: "insurance_policies",
                principalColumn: "id");
        }
    }
}
