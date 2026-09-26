using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAboutSocialLinksAndLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CV",
                table: "AboutContent");

            migrationBuilder.DropColumn(
                name: "GitHub",
                table: "AboutContent");

            migrationBuilder.DropColumn(
                name: "LinkedIn",
                table: "AboutContent");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "AboutContent");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CV",
                table: "AboutContent",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GitHub",
                table: "AboutContent",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedIn",
                table: "AboutContent",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "AboutContent",
                type: "text",
                nullable: true);
        }
    }
}
