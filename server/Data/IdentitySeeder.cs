using Microsoft.AspNetCore.Identity;

namespace server.Data;

public static class IdentitySeeder
{
    public static async Task SeedAdminAsync(
        IServiceProvider services,
        IConfiguration configuration)
    {
        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        const string adminRole = "Admin";

        var adminUsername = configuration["Admin:Username"];
        var adminPassword = configuration["Admin:Password"];

        if (string.IsNullOrWhiteSpace(adminUsername) ||
            string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException(
                "Admin credentials are missing. Set Admin:Username and Admin:Password in your development configuration."
            );
        }

        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            var roleResult = await roleManager.CreateAsync(
                new IdentityRole(adminRole)
            );

            if (!roleResult.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join(
                        ", ",
                        roleResult.Errors.Select(error => error.Description)
                    )
                );
            }
        }

        var adminUser = await userManager.FindByNameAsync(adminUsername);

        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = adminUsername,
                EmailConfirmed = true
            };

            var userResult = await userManager.CreateAsync(
                adminUser,
                adminPassword
            );

            if (!userResult.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join(
                        ", ",
                        userResult.Errors.Select(error => error.Description)
                    )
                );
            }
        }

        if (!await userManager.IsInRoleAsync(adminUser, adminRole))
        {
            var roleResult = await userManager.AddToRoleAsync(
                adminUser,
                adminRole
            );

            if (!roleResult.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join(
                        ", ",
                        roleResult.Errors.Select(error => error.Description)
                    )
                );
            }
        }
    }
}