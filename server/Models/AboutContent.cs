namespace server.Models;

public class AboutContent
{
    public int Id { get; set; }

    // About
    public string? ProfileImage { get; set; }

    public string Introduction { get; set; } = string.Empty;

    public string? AboutText { get; set; }

    public string? WritingText { get; set; }

    // Contact
    public string ContactHeading { get; set; } = "Get in touch";

    public string? ContactText { get; set; }

    public string? Email { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}