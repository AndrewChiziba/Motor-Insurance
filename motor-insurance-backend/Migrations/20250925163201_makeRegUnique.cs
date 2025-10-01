using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceApi.Migrations
{
    /// <inheritdoc />
    public partial class makeRegUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_vehicles_registration_number",
                table: "vehicles",
                column: "registration_number",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_vehicles_registration_number",
                table: "vehicles");
        }
    }
}
