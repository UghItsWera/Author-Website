using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AboutController : ControllerBase
{
    private readonly AppDbContext _context;

    public AboutController(AppDbContext context)
    {
        _context = context;
    }

    // Public
    [HttpGet]
    public async Task<ActionResult<AboutContent>> GetAbout()
    {
        var about = await _context.AboutContent.FirstOrDefaultAsync();

        if (about == null)
        {
            about = new AboutContent
            {
                Introduction = "Welcome to my little corner of the internet."
            };

            _context.AboutContent.Add(about);
            await _context.SaveChangesAsync();
        }

        return Ok(about);
    }

    // Admin
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<AboutContent>> UpdateAbout(
        AboutContentRequest request)
    {
        var about = await _context.AboutContent.FirstOrDefaultAsync();

        if (about == null)
        {
            about = new AboutContent();
            _context.AboutContent.Add(about);
        }

        about.ProfileImage = request.ProfileImage;
        about.Introduction = request.Introduction ?? string.Empty;
        about.AboutText = request.AboutText;
        about.WritingText = request.WritingText;

        about.ContactHeading =
            string.IsNullOrWhiteSpace(request.ContactHeading)
                ? "Get in touch"
                : request.ContactHeading;

        about.ContactText = request.ContactText;
        about.Email = request.Email;

        about.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(about);
    }
}

public class AboutContentRequest
{
    public string? ProfileImage { get; set; }

    public string? Introduction { get; set; }

    public string? AboutText { get; set; }

    public string? WritingText { get; set; }

    public string? ContactHeading { get; set; }

    public string? ContactText { get; set; }

    public string? Email { get; set; }
}