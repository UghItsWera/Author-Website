using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExtraContentForWriting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "ExtraContent",
                newName: "Tags");

            migrationBuilder.AlterColumn<int>(
                name: "BookId",
                table: "ExtraContent",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "ExtraContent",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Summary",
                table: "ExtraContent");

            migrationBuilder.RenameColumn(
                name: "Tags",
                table: "ExtraContent",
                newName: "Description");

            migrationBuilder.AlterColumn<int>(
                name: "BookId",
                table: "ExtraContent",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
