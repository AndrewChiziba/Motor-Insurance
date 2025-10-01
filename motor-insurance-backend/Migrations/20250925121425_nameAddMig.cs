using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceApi.Migrations
{
    /// <inheritdoc />
    public partial class nameAddMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "display_name",
                table: "AspNetUsers",
                newName: "full_name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "full_name",
                table: "AspNetUsers",
                newName: "display_name");
        }
    }
}
