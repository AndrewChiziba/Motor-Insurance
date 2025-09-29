using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceApi.Migrations
{
    /// <inheritdoc />
    public partial class removeQuotationMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_quotations_vehicles_vehicle_id",
                table: "quotations");

            migrationBuilder.DropForeignKey(
                name: "fk_quotations_vehicles_vehicle_id1",
                table: "quotations");

            migrationBuilder.DropPrimaryKey(
                name: "pk_quotations",
                table: "quotations");

            migrationBuilder.RenameTable(
                name: "quotations",
                newName: "quotation");

            migrationBuilder.RenameIndex(
                name: "ix_quotations_vehicle_id1",
                table: "quotation",
                newName: "ix_quotation_vehicle_id1");

            migrationBuilder.RenameIndex(
                name: "ix_quotations_vehicle_id",
                table: "quotation",
                newName: "ix_quotation_vehicle_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_quotation",
                table: "quotation",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_quotation_vehicles_vehicle_id",
                table: "quotation",
                column: "vehicle_id",
                principalTable: "vehicles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_quotation_vehicles_vehicle_id1",
                table: "quotation",
                column: "vehicle_id1",
                principalTable: "vehicles",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_quotation_vehicles_vehicle_id",
                table: "quotation");

            migrationBuilder.DropForeignKey(
                name: "fk_quotation_vehicles_vehicle_id1",
                table: "quotation");

            migrationBuilder.DropPrimaryKey(
                name: "pk_quotation",
                table: "quotation");

            migrationBuilder.RenameTable(
                name: "quotation",
                newName: "quotations");

            migrationBuilder.RenameIndex(
                name: "ix_quotation_vehicle_id1",
                table: "quotations",
                newName: "ix_quotations_vehicle_id1");

            migrationBuilder.RenameIndex(
                name: "ix_quotation_vehicle_id",
                table: "quotations",
                newName: "ix_quotations_vehicle_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_quotations",
                table: "quotations",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_quotations_vehicles_vehicle_id",
                table: "quotations",
                column: "vehicle_id",
                principalTable: "vehicles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_quotations_vehicles_vehicle_id1",
                table: "quotations",
                column: "vehicle_id1",
                principalTable: "vehicles",
                principalColumn: "id");
        }
    }
}
